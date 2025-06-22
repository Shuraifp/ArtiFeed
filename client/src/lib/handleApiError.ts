import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

interface HandleApiErrorOptions {
  error: unknown;
  router?: {
    push: (path: string) => void;
  };
}

export function handleApiError({ error, router }: HandleApiErrorOptions) {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
console.log('hiiii')
    if (router) {
      if (status === 401) return router.push("/login");
      if (status === 403) return router.push("/blocked");
    }

    toast.error(message);
  } else {
    toast.error("Something went wrong. Please try again.");
  }
}
