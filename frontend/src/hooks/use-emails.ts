import { api } from "@/lib/api";
import { ErrorResponse } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
export interface Email {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  subject: string;
  message: string;
  isSeen: boolean;
}

export interface EmailsResponse {
  data: Email[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useEmails(params: { skip: number; limit: number }) {
  return useQuery<EmailsResponse>({
    queryKey: ["emails", params],
    queryFn: async () => {
      const { data } = await api.get("/emails", { params });
      return data;
    },
  });
}

export function useUpdateEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data: response } = await api.put(`/emails/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      toast.success("Email updated successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to update email");
    },
  });
}
