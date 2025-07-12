import api from '../api';

export interface Answer {
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
}

export interface CreateAnswerData {
  questionId: string;
  content: string;
}

export const answerService = {
  async createAnswer(data: CreateAnswerData): Promise<Answer> {
    const response = await api.post<Answer>('/answers', data);
    return response.data;
  },

  async updateAnswer(id: string, content: string): Promise<Answer> {
    const response = await api.put<Answer>(`/answers/${id}`, { content });
    return response.data;
  },

  async deleteAnswer(id: string): Promise<void> {
    await api.delete(`/answers/${id}`);
  },

  async acceptAnswer(id: string): Promise<Answer> {
    const response = await api.post<Answer>(`/answers/${id}/accept`);
    return response.data;
  },

  async voteAnswer(id: string, type: 'upvote' | 'downvote'): Promise<any> {
    const response = await api.post(`/answers/${id}/vote`, { type });
    return response.data;
  },

  async getUserAnswersCount(): Promise<{ count: number }> {
    const response = await api.get<{ count: number }>('/answers/user/count');
    return response.data;
  },
}; 