import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Resume, ErrorResponse } from '@/types/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ResumeResponse } from "@/lib/validations/resume";

export function useResumes() {
  return useQuery<ResumeResponse>({
    queryKey: ["resumes"],
    queryFn: async () => {
      const { data } = await api.get("/resumes");
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

export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const { data: response } = await api.patch(`/resumes/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume updated successfully');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Failed to update resume');
    },
  });
} 