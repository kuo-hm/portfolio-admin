import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skill, PaginatedResponse, ErrorResponse } from '@/types/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function useSkills(page = 1, limit = 10) {
  return useQuery<PaginatedResponse<Skill>>({
    queryKey: ['skills', page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/skills?page=${page}&limit=${limit}`);
      return data;
    },
  });
}

export function useSkill(id: string) {
  return useQuery<Skill>({
    queryKey: ['skills', id],
    queryFn: async () => {
      const { data } = await api.get(`/skills/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await api.post('/skills', skill);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill created successfully');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Failed to create skill');
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...skill
    }: Partial<Skill> & { id: string }) => {
      const { data } = await api.put(`/skills/${id}`, skill);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills', variables.id] });
      toast.success('Skill updated successfully');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Failed to update skill');
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill deleted successfully');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Failed to delete skill');
    },
  });
} 