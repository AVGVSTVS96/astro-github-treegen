import type { GitHubTreeResponse, TreeNode } from '@/lib/types'
import { fetchWithError } from '@/lib/utils'

export const fetchRepoStructure = async (owner: string, repo: string): Promise<GitHubTreeResponse> => {
  const repoData = await fetchWithError(
    `https://api.github.com/repos/${owner}/${repo}`,
    'Repository not found'
  )

  const treeData = await fetchWithError(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`,
    'Tree not found'
  )

  return treeData
}

export const parseGitHubUrl = (url: string): { owner: string; repo: string } => {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    let [owner, repo] = pathParts

    if (repo && repo.endsWith('.git')) {
      repo = repo.replace(/\.git$/, '')
    }

    if (!owner || !repo) {
      throw new Error('Invalid repository URL format.')
    }

    return { owner, repo }
  } catch (error) {
    throw new Error('Invalid repository URL format.')
  }
}

export const generateGitHubTreeStructure = (data: GitHubTreeResponse, maxDepth: number): string => {
  const buildTreeStructure = (data: GitHubTreeResponse): TreeNode => {
    const tree: TreeNode = {}
    data.tree.forEach((item) => {
      const parts = item.path.split('/')
      let current = tree
      parts.forEach((part, index) => {
        if (index < maxDepth) {
          if (!current[part]) {
            current[part] = {}
          }
          current = current[part]
        }
      })
    })
    return tree
  }

  const renderTree = (node: TreeNode, prefix = ''): string => {
    let result = ''
    const entries = Object.entries(node)
    entries.forEach(([key, value], index) => {
      const isLast = index === entries.length - 1
      result += `${prefix}${isLast ? '└── ' : '├── '}${key}\n`
      if (Object.keys(value).length > 0) {
        result += renderTree(value, `${prefix}${isLast ? '    ' : '│   '}`)
      }
    })
    return result
  }

  const tree = buildTreeStructure(data)
  return renderTree(tree)
}
