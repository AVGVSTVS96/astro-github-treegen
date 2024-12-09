export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: string;
  size?: number;
  sha: string;
  url: string;
}
export interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}
export type TreeNode = { [key: string]: TreeNode; };

