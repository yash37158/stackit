"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/common/Header"
import FilterTabs from "@/components/questions/FilterTabs"
import SearchBar from "@/components/common/SearchBar"
import QuestionCard from "@/components/questions/QuestionCard"
import Pagination from "@/components/common/Pagination"
import { useQuestionStore } from "@/stores/questionStore"
import { useAuthStore } from "@/stores/authStore"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function HomePage() {
  const router = useRouter()
  const { 
    filteredQuestions, 
    currentFilter, 
    setFilter, 
    searchQuery, 
    setSearchQuery, 
    selectedTag,
    setSelectedTag,
    loadQuestions, 
    loadUserStats,
    userStats,
    isLoading, 
    error, 
    clearError,
    currentPage,
    totalPages
  } = useQuestionStore()
  const { user } = useAuthStore()

  useEffect(() => {
    loadQuestions(1)
  }, [loadQuestions])

  useEffect(() => {
    if (user) {
      loadUserStats()
    }
  }, [user, loadUserStats])

  const handlePageChange = (page: number) => {
    loadQuestions(page)
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
    // No need to navigate since we're already on the homepage
  }

  const handleClearTag = () => {
    setSelectedTag(null)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
      
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {searchQuery && `Search results for "${searchQuery}"`}
                    {!searchQuery && currentFilter === "newest" && "Newest Questions"}
                    {!searchQuery && currentFilter === "unanswered" && "Unanswered Questions"}
                    {!searchQuery && currentFilter === "popular" && "Popular Questions"}
                    {!searchQuery && currentFilter === "active" && "Active Questions"}
                    {!searchQuery && currentFilter === "votes" && "Most Voted Questions"}
                    {!searchQuery && currentFilter === "views" && "Most Viewed Questions"}
                    {!searchQuery && selectedTag && `Questions tagged "${selectedTag}"`}
                  </h1>
                  {(selectedTag || searchQuery) && (
                    <div className="flex gap-2">
                      {selectedTag && (
                        <button
                          onClick={handleClearTag}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          Clear tag
                        </button>
                      )}
                      {searchQuery && (
                        <button
                          onClick={handleClearSearch}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{filteredQuestions.length} questions</span>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4 mb-6">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search questions..." />
                <FilterTabs currentFilter={currentFilter} onFilterChange={setFilter} />
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Loading questions...</p>
                  </div>
                ) : filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question) => <QuestionCard key={question.id} question={question} />)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No questions found</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {searchQuery ? "Try adjusting your search terms" : selectedTag ? "No questions found with this tag" : "Be the first to ask a question!"}
                    </p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["javascript", "react", "typescript", "node.js", "python", "css", "html", "api"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 cursor-pointer transition-colors"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {selectedTag && (
                <div className="mt-4 text-sm text-gray-600">
                  <span>Currently filtering by: </span>
                  <span className="font-medium text-blue-600">{selectedTag}</span>
                  <span className="cursor-pointer text-blue-600 hover:underline" onClick={handleClearTag}>
                    (clear)
                  </span>
                </div>
              )}
            </div>

            {user && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mt-4">
                <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions Asked</span>
                    <span className="font-medium">
                      {userStats ? userStats.questionsCount : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Answers Given</span>
                    <span className="font-medium">
                      {userStats ? userStats.answersCount : 0}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
