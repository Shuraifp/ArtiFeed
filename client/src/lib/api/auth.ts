import { FormData } from "@/components/RegisterPage";
import publicInstance from "./axios/public";

export const login = async (email: string, password: string) => {
  try {
    const response = await publicInstance.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error
  }
}

export const register = async (userData: FormData) => {
  try {
    const response = await publicInstance.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    throw error
  }
}

export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await publicInstance.post("/auth/admin/login", { email, password });
    return response.data;
  } catch (error) {
    throw error
  }
}