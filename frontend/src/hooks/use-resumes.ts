import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Resume, PaginatedResponse, ErrorResponse } from '@/types/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function useResumes(page = 1, limit = 10) {
  return useQuery<PaginatedResponse<Resume>>({
    queryKey: ['resumes', page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/resumes?page=${page}&limit=${limit}`);
      return data;
    },
  });
}

export function useResume(id: string) {
  return useQuery<Resume>({
    queryKey: ['resumes', id],
    queryFn: async () => {
      const { data } = await api.get(`/resumes/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);

      const { data } = await api.post('/resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume uploaded successfully');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/resumes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume deleted successfully');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Failed to delete resume');
    },
  });
} 