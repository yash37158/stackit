"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered, Code, Link, ImageIcon } from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)

  const insertText = useCallback(
    (before: string, after = "") => {
      const textarea = document.getElementById("editor") as HTMLTextAreaElement
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = content.substring(start, end)

      const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)
      onChange(newText)

      // Restore cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
      }, 0)
    },
    [content, onChange],
  )

  const toolbarButtons = [
    { icon: Bold, action: () => insertText("**", "**"), title: "Bold" },
    { icon: Italic, action: () => insertText("*", "*"), title: "Italic" },
    { icon: Code, action: () => insertText("`", "`"), title: "Inline Code" },
    { icon: Link, action: () => insertText("[", "](url)"), title: "Link" },
    { icon: List, action: () => insertText("\n- "), title: "Bullet List" },
    { icon: ListOrdered, action: () => insertText("\n1. "), title: "Numbered List" },
    { icon: ImageIcon, action: () => insertText("![alt text](", ")"), title: "Image" },
  ]

  const renderPreview = (text: string) => {
    // Simple markdown-like rendering
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\n- (.*)/g, "<li>$1</li>")
      .replace(/\n\d+\. (.*)/g, "<li>$1</li>")
      .replace(/\n/g, "<br>")
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-gray-50">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              title={button.title}
              className="h-8 w-8 p-0"
            >
              <button.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsPreview(!isPreview)} className="text-xs">
            {isPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="min-h-[200px]">
        {isPreview ? (
          <div className="p-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderPreview(content) }} />
        ) : (
          <textarea
            id="editor"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-48 p-4 resize-none border-0 focus:outline-none focus:ring-0"
          />
        )}
      </div>

      {/* Help Text */}
      <div className="p-2 border-t bg-gray-50 text-xs text-gray-600">
        <div className="flex flex-wrap gap-4">
          <span>**bold**</span>
          <span>*italic*</span>
          <span>`code`</span>
          <span>[link](url)</span>
          <span>- list item</span>
        </div>
      </div>
    </div>
  )
}
