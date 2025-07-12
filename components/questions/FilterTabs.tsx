"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface FilterTabsProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
}

export default function FilterTabs({ currentFilter, onFilterChange }: FilterTabsProps) {
  const filters = [
    { id: "newest", label: "Newest" },
    { id: "unanswered", label: "Unanswered" },
    { id: "popular", label: "Popular" },
  ]

  const moreFilters = [
    { id: "active", label: "Active" },
    { id: "votes", label: "Most Votes" },
    { id: "views", label: "Most Views" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Main Filters - Always visible */}
      <div className="flex gap-1">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={currentFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className="text-sm"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* More Filters Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="text-sm bg-transparent">
            More
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {moreFilters.map((filter) => (
            <DropdownMenuItem
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={currentFilter === filter.id ? "bg-blue-50 text-blue-700" : ""}
            >
              {filter.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
