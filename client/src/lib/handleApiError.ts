import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

interface HandleApiErrorOptions {
  error: unknown;
  router?: {
    push: (path: string) => void;
  };
  user?: string | null;
  admin?: string | null;
}

export function handleApiError({ error, router, user, admin }: HandleApiErrorOptions) {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    toast.error(message);

    if (router) {
      if (status === 401) {
        if (user) {
          router.push("/login");
          localStorage.removeItem("artiUser");
        } else if (admin) {
          router.push("/admin/login");
          localStorage.removeItem("artiAdmin");
        }
      }
      if (status === 403) return router.push("/blocked");
    }
  } else {
    toast.error("Something went wrong. Please try again.");
  }
}
