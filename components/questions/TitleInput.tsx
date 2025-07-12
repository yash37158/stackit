"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TitleInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export default function TitleInput({ value, onChange, error }: TitleInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="title" className="text-sm font-medium text-gray-700">
        Title
      </Label>
      <Input
        id="title"
        type="text"
        placeholder="What's your programming question? Be specific."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-red-500" : ""}
        maxLength={120}
      />
      <div className="flex justify-between text-xs">
        {error ? (
          <span className="text-red-600">{error}</span>
        ) : (
          <span className="text-gray-500">Be specific and imagine you're asking a question to another person</span>
        )}
        <span className="text-gray-400">{value.length}/120</span>
      </div>
    </div>
  )
}
