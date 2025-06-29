import { FormData } from "@/components/RegisterPage";
import publicInstance from "./axios/public";
import userInstance from "./axios/user";
import adminInstance from "./axios/admin";

export const loginUser = async (identifier: string, password: string) => {
  let Data;
  if(identifier.includes("@")) {
    Data = { email: identifier, password };
  } else {
    Data = { phone: identifier, password };
  }
  try {
    const response = await publicInstance.post("/auth/login", Data);
    return response.data.data;
  } catch (error) {
    throw error
  }
}

export const register = async (userData: FormData) => {
  try {
    const response = await publicInstance.post("/auth/signup", userData);
    return response.data.data;
  } catch (error) {
    throw error
  }
}

export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await publicInstance.post("/auth/admin/login", { email, password });
    return response.data.data;
  } catch (error) {
    throw error
  }
}

export const logoutUser = async () => {
  try {
    const response = await userInstance.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error
  }
}

export const adminLogout = async () => {
  try {
    const response = await adminInstance.post("/auth/admin/logout");
    return response.data;
  } catch (error) {
    throw error
  }
}