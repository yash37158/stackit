import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const renderMarkdown = (text: string) => {
  // Simple markdown-like rendering
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
    .replace(/\n- (.*)/g, "<li>$1</li>")
    .replace(/\n\d+\. (.*)/g, "<li>$1</li>")
    .replace(/\n/g, "<br>")
}
