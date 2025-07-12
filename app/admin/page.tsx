"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/authStore";
import { useQuestionStore } from "@/stores/questionStore";
import { Badge } from "@/components/ui/badge";
import { Trash2, Flag, Eye, Users, MessageSquare, Tag } from "lucide-react";

export default function AdminPanel() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { questions } = useQuestionStore();
  const [newTag, setNewTag] = useState("");

  // Mock admin check - in real app this would be from user role
  const isAdmin = user?.role === "admin";

  if (!user) {
    router.push("/");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the admin panel.
            </p>
            <Button onClick={() => router.push("/")}>Back to Home</Button>
          </div>
        </main>
      </div>
    );
  }

  const stats = {
    totalQuestions: questions.length,
    totalAnswers: questions.reduce((acc, q) => acc + q.answers.length, 0),
    totalUsers: 156, // Mock data
    flaggedContent: 3, // Mock data
  };

  const flaggedQuestions = questions.slice(0, 3); // Mock flagged content

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      // In real app, this would call an API
      console.log("Deleting question:", questionId);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      // In real app, this would call an API
      console.log("Adding tag:", newTag);
      setNewTag("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Manage content and monitor platform activity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Questions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalQuestions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Answers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalAnswers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Flag className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Flagged Content
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.flaggedContent}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content Moderation</TabsTrigger>
            <TabsTrigger value="tags">Manage Tags</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Flagged Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flaggedQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {question.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          By {question.author.name} •{" "}
                          {new Date(question.createdAt).toLocaleDateString(
                            "en-GB",
                          )}
                        </p>
                        <div className="flex gap-2">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tags" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tag Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <Button onClick={handleAddTag}>Add Tag</Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Popular Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "javascript",
                        "react",
                        "typescript",
                        "node.js",
                        "python",
                        "css",
                        "html",
                        "api",
                      ].map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                        >
                          <span className="text-sm">{tag}</span>
                          <button className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>User management features coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
