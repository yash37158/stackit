"use client"

import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoteButtonProps {
  votes: number
  onVote: (type: "up" | "down") => void
  orientation?: "horizontal" | "vertical"
  userVote?: "up" | "down" | null
}

export default function VoteButton({ votes, onVote, orientation = "horizontal", userVote = null }: VoteButtonProps) {
  const isVertical = orientation === "vertical"

  return (
    <div className={cn("flex items-center gap-1", isVertical ? "flex-col" : "flex-row")}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onVote("up")}
        className={cn("p-1 h-8 w-8", userVote === "up" && "text-green-600 bg-green-50")}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>

      <span
        className={cn(
          "font-medium text-sm min-w-[2rem] text-center",
          votes > 0 && "text-green-600",
          votes < 0 && "text-red-600",
        )}
      >
        {votes}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onVote("down")}
        className={cn("p-1 h-8 w-8", userVote === "down" && "text-red-600 bg-red-50")}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  )
}
