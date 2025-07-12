import api from '../api';

export interface Question {
  id: string;
  title: string;
  description: string;
  viewCount: number;
  author: {
    id: string;
    username: string;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
  votes: Array<{
    id: string;
    type: 'upvote' | 'downvote';
    user: {
      id: string;
      username: string;
    };
  }>;
  answers: Array<{
    id: string;
    content: string;
    isAccepted: boolean;
    author: {
      id: string;
      username: string;
    };
    votes: Array<{
      id: string;
      type: 'upvote' | 'downvote';
      user: {
        id: string;
        username: string;
      };
    }>;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionResponse {
  questions: Question[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface CreateQuestionData {
  title: string;
  description: string;
  tagIds: string[];
}

export const questionService = {
  async getQuestions(page = 1, limit = 10, tag?: string, search?: string, filter?: string): Promise<QuestionResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(tag && { tag }),
      ...(search && { search }),
      ...(filter && { filter }),
    });
    const response = await api.get<QuestionResponse>(`/questions?${params}`);
    return response.data;
  },

  async getQuestionById(id: string): Promise<Question> {
    const response = await api.get<Question>(`/questions/${id}`);
    return response.data;
  },

  async createQuestion(data: CreateQuestionData): Promise<Question> {
    const response = await api.post<Question>('/questions', data);
    return response.data;
  },

  async updateQuestion(id: string, data: Partial<CreateQuestionData>): Promise<Question> {
    const response = await api.put<Question>(`/questions/${id}`, data);
    return response.data;
  },

  async deleteQuestion(id: string): Promise<void> {
    await api.delete(`/questions/${id}`);
  },

  async voteQuestion(id: string, type: 'upvote' | 'downvote'): Promise<any> {
    const response = await api.post(`/questions/${id}/vote`, { type });
    return response.data;
  },

  async getUserQuestionsCount(): Promise<{ count: number }> {
    const response = await api.get<{ count: number }>('/questions/user/count');
    return response.data;
  },
}; 