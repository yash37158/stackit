"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, MessageSquare, ThumbsUp, CheckCircle } from "lucide-react"

interface NotificationDropdownProps {
  onClose: () => void
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const notifications = [
    {
      id: 1,
      type: "answer",
      title: "New answer on your question",
      message: 'Someone answered "How to implement React hooks?"',
      time: "2 minutes ago",
      unread: true,
      icon: MessageSquare,
    },
    {
      id: 2,
      type: "vote",
      title: "Your answer was upvoted",
      message: 'Your answer on "JavaScript async/await" received an upvote',
      time: "1 hour ago",
      unread: true,
      icon: ThumbsUp,
    },
    {
      id: 3,
      type: "accepted",
      title: "Your answer was accepted",
      message: 'Your answer on "CSS Grid Layout" was marked as accepted',
      time: "3 hours ago",
      unread: false,
      icon: CheckCircle,
    },
  ]

  return (
    <Card ref={dropdownRef} className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto shadow-lg z-50">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <Button variant="ghost" size="sm" className="text-xs">
            Mark all read
          </Button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.map((notification) => {
          const IconComponent = notification.icon
          return (
            <div
              key={notification.id}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                notification.unread ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    notification.type === "answer"
                      ? "bg-blue-100 text-blue-600"
                      : notification.type === "vote"
                        ? "bg-green-100 text-green-600"
                        : "bg-purple-100 text-purple-600"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    {notification.unread && <Badge className="h-2 w-2 p-0 bg-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full text-sm">
          <Bell className="h-4 w-4 mr-2" />
          View all notifications
        </Button>
      </div>
    </Card>
  )
}
