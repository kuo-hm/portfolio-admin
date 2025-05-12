import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface DashboardData {
  kpis: {
    totalProjects: number;
    totalSkills: number;
    totalResumes: number;
  };
  recentProjects: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string | null;
    createdAt: string;
  }>;
  recentSkills: Array<{
    id: string;
    name: string;
    type: string;
    imageUrl: string;
    createdAt: string;
  }>;
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard');
      return data;
    },
  });
} 