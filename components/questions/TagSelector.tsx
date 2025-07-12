"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tagService } from "@/lib/services/tag.service"

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  error?: string
}

export default function TagSelector({ selectedTags, onChange, error }: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<Array<{id: string, name: string}>>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadTags = async () => {
      try {
        setIsLoading(true)
        const tags = await tagService.getAllTags()
        setAvailableTags(tags)
      } catch (error) {
        console.error('Failed to load tags:', error)
        // Fallback to predefined tags if API fails
        setAvailableTags([
          { id: '1', name: 'javascript' },
          { id: '2', name: 'react' },
          { id: '3', name: 'typescript' },
          { id: '4', name: 'node.js' },
          { id: '5', name: 'python' },
          { id: '6', name: 'css' },
          { id: '7', name: 'html' },
          { id: '8', name: 'api' }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadTags()
  }, [])

  // Filter out already selected tags
  const filteredTags = availableTags.filter(
    (tag) => !selectedTags.includes(tag.id)
  )

  const handleAddTag = (tagId: string) => {
    if (selectedTags.length < 5 && !selectedTags.includes(tagId)) {
      onChange([...selectedTags, tagId])
    }
  }

  const handleRemoveTag = (tagIdToRemove: string) => {
    onChange(selectedTags.filter((tagId) => tagId !== tagIdToRemove))
  }

  // Get tag name by ID for display
  const getTagName = (tagId: string) => {
    const tag = availableTags.find(t => t.id === tagId)
    return tag ? tag.name : tagId
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
        Tags
      </Label>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tagId) => (
            <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
              {getTagName(tagId)}
              <button type="button" onClick={() => handleRemoveTag(tagId)} className="ml-1 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tag Selection Dropdown */}
      <Select 
        onValueChange={handleAddTag}
        disabled={selectedTags.length >= 5 || isLoading}
      >
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder={isLoading ? "Loading tags..." : "Select a tag to add..."} />
        </SelectTrigger>
        <SelectContent>
          {filteredTags.map((tag) => (
            <SelectItem key={tag.id} value={tag.id}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
