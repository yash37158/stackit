"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Menu, Search, User, LogOut, Settings, Shield } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import LoginModal from "@/components/auth/LoginModal"
import NotificationDropdown from "@/components/common/NotificationDropdown"

export default function Header() {
  const { user, logout } = useAuthStore()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">StackIt</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Questions
              </Link>
              <Link href="/ask" className="text-gray-700 hover:text-blue-600 transition-colors">
                Ask Question
              </Link>
              <Link href="/tags" className="text-gray-700 hover:text-blue-600 transition-colors">
                Tags
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input type="text" placeholder="Search questions..." className="pl-10 pr-4" />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative"
                    >
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        3
                      </Badge>
                    </Button>
                    {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
                  </div>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="hidden sm:block">{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      {user.role === "admin" && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button onClick={() => setShowLoginModal(true)}>Login</Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input type="text" placeholder="Search questions..." className="pl-10 pr-4" />
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  <Link
                    href="/"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Questions
                  </Link>
                  <Link
                    href="/ask"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Ask Question
                  </Link>
                  <Link
                    href="/tags"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Tags
                  </Link>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
