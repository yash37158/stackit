export interface User {
  id: string
  username: string
  email: string
  role: "user" | "admin"
}

export interface Vote {
  id: string
  type: "upvote" | "downvote"
  user: {
    id: string
    username: string
  }
}

export interface Answer {
  id: string
  content: string
  isAccepted: boolean
  author: {
    id: string
    username: string
  }
  votes: Vote[]
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  name: string
}

export interface Question {
  id: string
  title: string
  description: string
  viewCount: number
  author: {
    id: string
    username: string
  }
  tags: Tag[]
  answers: Answer[]
  votes: Vote[]
  createdAt: string
  updatedAt: string
}

export interface QuestionResponse {
  questions: Question[]
  total: number
  currentPage: number
  totalPages: number
}
