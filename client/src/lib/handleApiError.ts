import { authResponse } from "@/context/AuthContext";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

interface HandleApiErrorOptions {
  error: unknown;
  router?: {
    push: (path: string) => void;
  };
  user?: authResponse | null;
  admin?: authResponse | null;
}

export function handleApiError({
  error,
  router,
  user,
  admin,
}: HandleApiErrorOptions) {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

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
    toast.error(message);
  } else {
    toast.error("Something went wrong. Please try again.");
  }
}
