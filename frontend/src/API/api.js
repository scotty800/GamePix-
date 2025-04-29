import axios from "axios";
import { authService } from "../services/authService";

const API_URL = import.meta.env.VITE_API_URL; // URL de base récupérée depuis les variables d'environnement

const apiInstance = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  withCredentials: true,
});

apiInstance.interceptors.request.use((config) => {
  const authHeader = authService.getAuthHeader();
  config.headers = { ...config.headers, ...authHeader };
  return config;
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(
      error.response?.data || { message: "Une erreur réseau est survenue" }
    );
  }
);

// Fonction pour le login
export const loginUser = async (data) => {
  try {
    const response = await apiInstance.post("/user/login", data);
    // Utilisez response.data.user au lieu de response.data.userData pour être cohérent
    authService.login(response.data.token, response.data.user);
    return response.data;
  } catch (error) {
    // Amélioration du traitement d'erreur
    throw {
      message: error.response?.data?.message || "Une erreur est survenue",
      errors: error.response?.data?.errors,
      status: error.response?.status
    };
  }
};

export const registerUser = async (data) => {
  try {
    const response = await apiInstance.post("/user/register", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Une erreur est survenue" };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiInstance.get("/user/getalluser");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Une erreur est survenue" };
  }
};

export const uploadProfilePic = async (file, userId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", userId)

    const response = await apiInstance.post(`/user/upload/profil/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Une erreur est survenue" };
  }
};

export const getProfilePicture = async (username) => {
  try {
    const response = await apiInstance.get(`/user/getprofilepic/${username}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Une erreur est survenue" };
  }
};

export const followUser = async (userId, idToFollow) => {
  try {
    const response = await apiInstance.patch(`/user/follow/${userId}`, { idtoFollow: idToFollow });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Une erreur est survenue" };
  }
};

export const unfollowUser = async (userId, idToUnfollow) => {
  try {
    const response = await apiInstance.patch(`/user/unfollow/${userId}`, { idTounFollow: idToUnfollow });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Une erreur est survenue" };
  }
};

export const getUserInfo = async (userId) => {
  // Vérification que l'ID est valide avant l'envoi
  if (!userId || typeof userId !== 'string' || userId.includes(':')) {
    throw new Error('ID utilisateur invalide');
  }

  try {
    const response = await apiInstance.get(`/user/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error("Erreur API:", error.response?.data || error.message);
    throw error;
  }
};


export const updateUserBio = async (id, newBio) => {
  try {
    const response = await apiInstance.put(`/user/${id}`, { bio: newBio });
    return response.data;
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la bio", err);
    throw err;
  }
};

export const createPost = async (formData) => {
  try {
    const response = await apiInstance.post('/post/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la création du post" };
  }
};

export const getUserPosts = async (userId) => {
  try {
    const response = await apiInstance.get(`/post/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur détaillée:', error.response?.data || error.message);
    throw error.response?.data || { 
      message: "Erreur lors de la récupération des posts utilisateur",
      details: error.message
    };
  }
};

export const readPosts = async () => {
  try {
    const response = await apiInstance.get('/post/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la récupération des posts" };
  }
};

export const updatePost = async (postId, message) => {
  try {
    const response = await apiInstance.patch(`/post/${postId}`, { message });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la mise à jour du post" };
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await apiInstance.delete(`/post/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la suppression du post" };
  }
};

export const likePost = async (postId, userId) => {
  try {
    const response = await apiInstance.patch(`/post/like-post/${postId}`, { id: userId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors du like" };
  }
};

export const unlikePost = async (postId, userId) => {
  try {
    const response = await apiInstance.patch(`/post/unlike-post/${postId}`, { id: userId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de l'unlike" };
  }
};

export const commentPost = async (postId, commentData) => {
  try {
    const response = await apiInstance.patch(`/post/comment-post/${postId}`, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de l'ajout du commentaire" };
  }
};

export const editComment = async (postId, commentId, newText) => {
  try {
    const response = await apiInstance.patch(`/post/edit-comment-post/${postId}`, {
      commentid: commentId,
      text: newText
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la modification du commentaire" };
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    const response = await apiInstance.patch(`/post/delete-comment-post/${postId}`, {
      commentid: commentId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la suppression du commentaire" };
  }
};

export const getFreeGames = async () => {
  try {
    const response = await apiInstance.get('/free-games'); // Utilise votre route backend
    return response.data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};
