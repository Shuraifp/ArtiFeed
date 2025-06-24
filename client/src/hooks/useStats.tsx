import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import publicInstance from "@/lib/api/axios/public";

interface Stats {
  activeUsers: number;
  totalArticles: number;
  satisfactionRate: string;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await publicInstance.get("/user/count");
        setStats(response.data.stats);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data.message);
        }
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
