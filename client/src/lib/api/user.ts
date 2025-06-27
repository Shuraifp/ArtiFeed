import userInstance from "./axios/user";
import adminInstance from "./axios/admin";
import { UserFormData } from "../types/user";

export const getAllUsers = async (page: number, limit: number) => {
  try {
    const res = await adminInstance.get("/user/admin", {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAdminStats = async () => {
  try {
    const res = await adminInstance.get("/user/admin/stats");
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const getUserById = async () => {
  try {
    const res = await userInstance.get(`/user`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (updatedData: UserFormData) => {
  try {
    const res = await userInstance.put(`/user`, updatedData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await adminInstance.delete(`/user/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const blockUser = async (id: string) => {
  try {
    const res = await adminInstance.post(`/user/block/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
