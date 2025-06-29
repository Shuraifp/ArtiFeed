import userInstance from "./axios/user";
import adminInstance from "./axios/admin";

export const createArticle = async (data: {
  title: string;
  body: string;
  category: string;
  tags: string[];
  image: string | null;
}) => {
  try {
    const res = await userInstance.post("/article", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getArticles = async (page: number, limit: number) => {
  try {
    const res = await userInstance.get("/article/following", {
      params: { page, limit },
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const getExploreArticles = async (page: number, limit: number) => {
  try {
    const res = await userInstance.get("/article", {
      params: { page, limit },
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const getArticlesForadmin = async (page: number, limit: number) => {
  try {
    const res = await userInstance.get("/article/admin", {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getUserArticles = async (page: number, limit: number) => {
  try {
    const res = await userInstance.get("/article/user", {
      params: { page, limit },
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

// 4. Get Single Article by ID
export const getArticleById = async (id: string) => {
  try {
    const res = await userInstance.get(`/article/articles/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateArticle = async (
  id: string,
  updatedData: {
    title: string;
    body: string;
    category: string;
    tags: string[];
    image: string | null;
  }
) => {
  try {
    const res = await userInstance.put(`/article/${id}`, updatedData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteArticle = async (id: string) => {
  try {
    const res = await userInstance.delete(`/article/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const likeArticle = async (id: string) => {
  try {
    const res = await userInstance.post(`/article/${id}/like`);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const dislikeArticle = async (id: string) => {
  try {
    const res = await userInstance.post(`/article/${id}/dislike`);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const blockArticle = async (id: string) => {
  try {
    const res = await userInstance.post(`/article/${id}/block`);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const adminBlockArticle = async (id: string) => {
  try {
    const res = await adminInstance.post(`/article/${id}/admin-block`);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};
