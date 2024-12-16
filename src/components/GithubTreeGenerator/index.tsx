import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchRepoStructure, parseGitHubUrl, generateGitHubTreeStructure } from './github-tree-utils'
import { CopyButton } from '@/components/CopyButton'

export function GithubTreeGenerator() {
  const [repoUrl, setRepoUrl] = useState<string>('')
  const [depth, setDepth] = useState<string>('3')
  const [tree, setTree] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTree('')

    try {
      const { owner, repo } = parseGitHubUrl(repoUrl)
      const data = await fetchRepoStructure(owner, repo)
      const generatedTree = generateGitHubTreeStructure(data, parseInt(depth))
      setTree(generatedTree)
    } catch (err) {
      console.error(err)
      setError('Failed to generate tree. Please check the repository URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">GitHub Repository Tree Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="repoUrl">GitHub Repository URL</Label>
          <Input
            id="repoUrl"
            type="url"
            placeholder="https://github.com/owner/repo"
            value={repoUrl}
            className="bg-background"
            // TODO: Fix input bg color when selecting an auto-complete item
            // Use input-webkit-autofill to ensure bg color doesn't change
            autoComplete="off"
            onChange={(e) => setRepoUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="depth">Tree Depth</Label>
          <Select value={depth} onValueChange={setDepth}>
            <SelectTrigger id="depth">
              <SelectValue placeholder="Select depth" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Tree'}
        </Button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {tree && (
        <div className="mt-4 relative">
          <pre className="p-4 bg-zinc-900 leading-snug rounded overflow-x-auto">
            <CopyButton
              text={tree}
              className="absolute top-2 right-2 hover:bg-zinc-800"
            />
            <code>{tree}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
