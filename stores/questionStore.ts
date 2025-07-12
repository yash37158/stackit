"use client"

import { create } from "zustand"
import type { Question, Answer } from "@/types"

interface QuestionState {
  questions: Question[]
  currentFilter: string
  searchQuery: string
  filteredQuestions: Question[]
  setFilter: (filter: string) => void
  setSearchQuery: (query: string) => void
  addQuestion: (question: Question) => void
  addAnswer: (questionId: string, answer: Answer) => void
  voteOnQuestion: (questionId: string, type: "up" | "down", userId: string) => void
  voteOnAnswer: (questionId: string, answerId: string, type: "up" | "down", userId: string) => void
  acceptAnswer: (questionId: string, answerId: string) => void
}

// Mock data
const mockQuestions: Question[] = [
  {
    id: "1",
    title: "How to implement React hooks for state management?",
    content:
      "<p>I'm trying to understand how to properly use React hooks for managing component state. Can someone explain the difference between useState and useReducer?</p><pre><code>const [count, setCount] = useState(0);</code></pre>",
    tags: ["react", "javascript", "hooks"],
    author: { id: "2", name: "Alice Johnson", email: "alice@example.com", role: "user" },
    createdAt: "2024-01-15T10:30:00Z",
    votes: 15,
    answers: [
      {
        id: "1",
        content:
          "<p>useState is perfect for simple state updates, while useReducer is better for complex state logic.</p><pre><code>// useState example\nconst [count, setCount] = useState(0);\n\n// useReducer example\nconst [state, dispatch] = useReducer(reducer, initialState);</code></pre>",
        author: { id: "3", name: "Bob Smith", email: "bob@example.com", role: "user" },
        createdAt: "2024-01-15T11:00:00Z",
        votes: 8,
        isAccepted: true,
      },
    ],
    views: 234,
    isAnswered: true,
  },
  {
    id: "2",
    title: "Best practices for TypeScript with React components?",
    content:
      "<p>What are the recommended patterns for typing React components in TypeScript? Should I use interfaces or types for props?</p>",
    tags: ["typescript", "react", "best-practices"],
    author: { id: "4", name: "Charlie Brown", email: "charlie@example.com", role: "user" },
    createdAt: "2024-01-14T15:45:00Z",
    votes: 12,
    answers: [],
    views: 156,
    isAnswered: false,
  },
  {
    id: "3",
    title: "How to handle async operations in JavaScript?",
    content: "<p>I'm confused about promises, async/await, and callbacks. When should I use each approach?</p>",
    tags: ["javascript", "async", "promises"],
    author: { id: "5", name: "Diana Prince", email: "diana@example.com", role: "user" },
    createdAt: "2024-01-13T09:20:00Z",
    votes: 8,
    answers: [
      {
        id: "2",
        content: "<p>Async/await is generally the most readable approach for handling asynchronous operations.</p>",
        author: { id: "6", name: "Eve Wilson", email: "eve@example.com", role: "user" },
        createdAt: "2024-01-13T10:15:00Z",
        votes: 5,
        isAccepted: false,
      },
    ],
    views: 189,
    isAnswered: true,
  },
]

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: mockQuestions,
  currentFilter: "newest",
  searchQuery: "",
  filteredQuestions: mockQuestions,

  setFilter: (filter) => {
    set({ currentFilter: filter })
    get().updateFilteredQuestions()
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
    get().updateFilteredQuestions()
  },

  updateFilteredQuestions: () => {
    const { questions, currentFilter, searchQuery } = get()
    let filtered = [...questions]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply sort filter
    switch (currentFilter) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "unanswered":
        filtered = filtered.filter((q) => q.answers.length === 0)
        break
      case "popular":
        filtered.sort((a, b) => b.votes - a.votes)
        break
      case "active":
        filtered.sort((a, b) => {
          const aLatest = Math.max(
            new Date(a.createdAt).getTime(),
            ...a.answers.map((ans) => new Date(ans.createdAt).getTime()),
          )
          const bLatest = Math.max(
            new Date(b.createdAt).getTime(),
            ...b.answers.map((ans) => new Date(ans.createdAt).getTime()),
          )
          return bLatest - aLatest
        })
        break
      case "votes":
        filtered.sort((a, b) => b.votes - a.votes)
        break
      case "views":
        filtered.sort((a, b) => b.views - a.views)
        break
    }

    set({ filteredQuestions: filtered })
  },

  addQuestion: (question) => {
    set((state) => ({
      questions: [question, ...state.questions],
    }))
    get().updateFilteredQuestions()
  },

  addAnswer: (questionId, answer) => {
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId ? { ...q, answers: [...q.answers, answer], isAnswered: true } : q,
      ),
    }))
    get().updateFilteredQuestions()
  },

  voteOnQuestion: (questionId, type, userId) => {
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId ? { ...q, votes: q.votes + (type === "up" ? 1 : -1) } : q,
      ),
    }))
    get().updateFilteredQuestions()
  },

  voteOnAnswer: (questionId, answerId, type, userId) => {
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, votes: a.votes + (type === "up" ? 1 : -1) } : a,
              ),
            }
          : q,
      ),
    }))
    get().updateFilteredQuestions()
  },

  acceptAnswer: (questionId, answerId) => {
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) => ({
                ...a,
                isAccepted: a.id === answerId,
              })),
            }
          : q,
      ),
    }))
    get().updateFilteredQuestions()
  },
}))

// Initialize filtered questions
useQuestionStore.getState().updateFilteredQuestions()
