export const REPO_URL = 'https://github.com/J2TEAM/vibe.j2team.org'

export interface PageInfo {
  name: string
  path: string
  description: string
  author: string
}

export const pages: PageInfo[] = [
  {
    name: 'Hello World',
    path: '/hello-world',
    description: 'Trang mẫu đầu tiên - bắt đầu từ đây!',
    author: 'J2TEAM',
  },
]
