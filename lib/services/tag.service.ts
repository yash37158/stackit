import api from '../api';

export interface Tag {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PopularTag extends Tag {
  questionCount: number;
}

export interface CreateTagData {
  name: string;
  description: string;
}

export const tagService = {
  async getAllTags(): Promise<Tag[]> {
    const response = await api.get<Tag[]>('/tags');
    return response.data;
  },

  async getPopularTags(limit = 10): Promise<PopularTag[]> {
    const response = await api.get<PopularTag[]>(`/tags/popular?limit=${limit}`);
    return response.data;
  },

  async createTag(data: CreateTagData): Promise<Tag> {
    const response = await api.post<Tag>('/tags', data);
    return response.data;
  },

  async updateTag(id: string, data: Partial<CreateTagData>): Promise<Tag> {
    const response = await api.put<Tag>(`/tags/${id}`, data);
    return response.data;
  },

  async deleteTag(id: string): Promise<void> {
    await api.delete(`/tags/${id}`);
  },
}; 