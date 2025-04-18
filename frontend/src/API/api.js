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

export const uploadProfilePic = async (file, name) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // Fichier image
    formData.append("name", name); // Nom de l'utilisateur

    const response = await apiInstance.post("/user/upload/profil", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Indique qu'on envoie un fichier
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
    const response = await apiInstance.patch(`/follow/${userId}`, { idtoFollow: idToFollow });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Une erreur est survenue" };
  }
};

export const unfollowUser = async (userId, idToUnfollow) => {
  try {
    const response = await apiInstance.patch(`/unfollow/${userId}`, { idTounFollow: idToUnfollow });
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