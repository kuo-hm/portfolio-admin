import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Project, PaginatedResponse, ErrorResponse } from '@/types/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function useProjects(page = 1, limit = 10) {
  return useQuery<PaginatedResponse<Project>>({
    queryKey: ['projects', page, limit],
    queryFn: async () => {
      try {
        console.log('Fetching projects...');
        const { data } = await api.get('/projects', {
          params: { page, limit }
        });
        console.log('Projects response:', data);
        return data;
      } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
    },
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['projects', id],
    queryFn: async () => {
      const { data } = await api.get(`/projects/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Error creating project:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...project
    }: Partial<Project> & { id: string }) => {
      const { data } = await api.put(`/projects/${id}`, project);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
      toast.success('Project updated successfully');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Error updating project:', error);
      toast.error(error.response?.data?.message || 'Failed to update project');
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Error deleting project:', error);
      toast.error(error.response?.data?.message || 'Failed to delete project');
    },
  });
} 