"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  error?: string
}

export default function TagSelector({ selectedTags, onChange, error }: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("")

  const popularTags = [
    "javascript",
    "react",
    "typescript",
    "node.js",
    "python",
    "css",
    "html",
    "api",
    "database",
    "git",
  ]

  const filteredTags = popularTags.filter(
    (tag) => tag.toLowerCase().includes(inputValue.toLowerCase()) && !selectedTags.includes(tag),
  )

  const handleAddTag = (tag: string) => {
    if (selectedTags.length < 5 && !selectedTags.includes(tag)) {
      onChange([...selectedTags, tag])
      setInputValue("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      const newTag = inputValue.trim().toLowerCase()
      if (newTag && selectedTags.length < 5 && !selectedTags.includes(newTag)) {
        onChange([...selectedTags, newTag])
        setInputValue("")
      }
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
        Tags
      </Label>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Input
        id="tags"
        type="text"
        placeholder="Add tags (e.g., javascript, react)..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        className={error ? "border-red-500" : ""}
        disabled={selectedTags.length >= 5}
      />

      {/* Popular Tags Suggestions */}
      {inputValue && filteredTags.length > 0 && (
        <div className="border rounded-md p-2 bg-white shadow-sm">
          <div className="text-xs text-gray-600 mb-2">Popular tags:</div>
          <div className="flex flex-wrap gap-1">
            {filteredTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between text-xs">
        {error ? (
          <span className="text-red-600">{error}</span>
        ) : (
          <span className="text-gray-500">Add up to 5 tags to describe what your question is about</span>
        )}
        <span className="text-gray-400">{selectedTags.length}/5</span>
      </div>
    </div>
  )
}
