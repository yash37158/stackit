export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

export interface Answer {
  id: string
  content: string
  author: User
  createdAt: string
  votes: number
  isAccepted: boolean
}

export interface Question {
  id: string
  title: string
  content: string
  tags: string[]
  author: User
  createdAt: string
  votes: number
  answers: Answer[]
  views: number
  isAnswered: boolean
}
