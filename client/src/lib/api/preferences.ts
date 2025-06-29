import adminInstance from "./axios/admin";
import publicInstance from "./axios/public";
import userInstance from "./axios/user";

export const getPreferencesForSignup = async () => {
  try {
    const res = await publicInstance.get("/preference/preferences");
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const getPreferences = async () => {
  try {
    const res = await userInstance.get("/preference/user/preferences");
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPreferences = async () => {
  try {
    const res = await adminInstance.get("/preference/admin/preferences");
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const createPreference = async (category: string) => {
  try {
    const res = await adminInstance.post(`/preference`, { category });
    return res;
  } catch (error) {
    throw error;
  }
};

export const deletePreference = async (category: string) => {
  try {
    const res = await adminInstance.delete(`/preference/${category}`);
    return res;
  } catch (error) {
    throw error;
  }
};
