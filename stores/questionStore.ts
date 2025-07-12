"use client"

import { create } from "zustand"
import { questionService } from "@/lib/services/question.service"
import { answerService } from "@/lib/services/answer.service"
import type { Question, Answer } from "@/types"

interface QuestionState {
  questions: Question[]
  currentQuestion: Question | null
  currentFilter: string
  searchQuery: string
  selectedTag: string | null
  filteredQuestions: Question[]
  isLoading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  userStats: { questionsCount: number; answersCount: number } | null
  setFilter: (filter: string) => void
  setSearchQuery: (query: string) => void
  setSelectedTag: (tag: string | null) => void
  loadQuestions: (page?: number, tag?: string) => Promise<void>
  loadQuestionById: (id: string) => Promise<void>
  addQuestion: (title: string, description: string, tagIds: string[]) => Promise<void>
  addAnswer: (questionId: string, content: string) => Promise<void>
  voteOnQuestion: (questionId: string, type: "upvote" | "downvote") => Promise<void>
  voteOnAnswer: (questionId: string, answerId: string, type: "upvote" | "downvote") => Promise<void>
  acceptAnswer: (questionId: string, answerId: string) => Promise<void>
  loadUserStats: () => Promise<void>
  clearError: () => void
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  currentQuestion: null,
  currentFilter: "newest",
  searchQuery: "",
  selectedTag: null,
  filteredQuestions: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  userStats: null,

  setFilter: (filter) => {
    set({ currentFilter: filter, searchQuery: "", selectedTag: null })
    get().loadQuestions(1)
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, selectedTag: null })
    get().loadQuestions(1)
  },

  setSelectedTag: (tag) => {
    set({ selectedTag: tag, searchQuery: "" })
    get().loadQuestions(1, tag || undefined)
  },

  loadQuestions: async (page = 1, tag?: string) => {
    try {
      set({ isLoading: true, error: null })
      const tagToUse = tag || get().selectedTag || undefined
      const searchQuery = get().searchQuery
      const currentFilter = get().currentFilter
      const response = await questionService.getQuestions(page, 10, tagToUse, searchQuery, currentFilter)
      set({ 
        questions: response.questions,
        filteredQuestions: response.questions,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        isLoading: false 
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load questions', isLoading: false })
    }
  },

  loadQuestionById: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      const question = await questionService.getQuestionById(id)
      set({ 
        currentQuestion: question,
        isLoading: false 
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load question', isLoading: false })
    }
  },

  addQuestion: async (title: string, description: string, tagIds: string[]) => {
    try {
      set({ isLoading: true, error: null })
      await questionService.createQuestion({ title, description, tagIds })
      await get().loadQuestions(1) // Reload questions after adding new one
      await get().loadUserStats() // Reload user stats after adding new question
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create question', isLoading: false })
      throw error
    }
  },

  addAnswer: async (questionId: string, content: string) => {
    try {
      set({ isLoading: true, error: null })
      await answerService.createAnswer({ questionId, content })
      // Reload the current question to get the updated answer list
      if (get().currentQuestion?.id === questionId) {
        await get().loadQuestionById(questionId)
      }
      await get().loadUserStats() // Reload user stats after adding new answer
      set({ isLoading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add answer', isLoading: false })
      throw error
    }
  },

  voteOnQuestion: async (questionId: string, type: "upvote" | "downvote") => {
    try {
      set({ isLoading: true, error: null })
      await questionService.voteQuestion(questionId, type)
      // Reload the current question to get the updated votes
      if (get().currentQuestion?.id === questionId) {
        await get().loadQuestionById(questionId)
      }
      set({ isLoading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to vote on question', isLoading: false })
      throw error
    }
  },

  voteOnAnswer: async (questionId: string, answerId: string, type: "upvote" | "downvote") => {
    try {
      set({ isLoading: true, error: null })
      await answerService.voteAnswer(answerId, type)
      // Reload the current question to get the updated votes
      if (get().currentQuestion?.id === questionId) {
        await get().loadQuestionById(questionId)
      }
      set({ isLoading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to vote on answer', isLoading: false })
      throw error
    }
  },

  acceptAnswer: async (questionId: string, answerId: string) => {
    try {
      set({ isLoading: true, error: null })
      await answerService.acceptAnswer(answerId)
      // Reload the current question to get the updated accepted status
      if (get().currentQuestion?.id === questionId) {
        await get().loadQuestionById(questionId)
      }
      set({ isLoading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to accept answer', isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),

  loadUserStats: async () => {
    try {
      const [questionsResponse, answersResponse] = await Promise.all([
        questionService.getUserQuestionsCount(),
        answerService.getUserAnswersCount()
      ]);
      
      set({ 
        userStats: { 
          questionsCount: questionsResponse.count, 
          answersCount: answersResponse.count 
        } 
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  },
}))
