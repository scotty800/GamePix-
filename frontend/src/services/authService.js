const TOKEN_KEY = "gamepix_auth_token";
const USER_DATA_KEY = "gamepix_user_data";

// Schéma de base pour les données utilisateur
const DEFAULT_USER = {
  _id: '',
  pseudo: '',
  email: '',
  bio: '',
  profileImg: '',
  followers: [],
  following: []
};

export const authService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  
  isAuthenticated: function() {
    const token = this.getToken();
    const user = this.getUser();
    return !!token && !!user?._id; // Vérifie à la fois le token ET l'ID utilisateur
  },
  
  getUser: function() {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);
      if (!userData) return null;
      
      const parsedData = JSON.parse(userData);
      
      // Validation des données essentielles
      if (!parsedData._id && !parsedData.id) {
        console.error("🚨 Données utilisateur invalides: ID manquant");
        return null;
      }
      
      const formattedUser = {
        ...DEFAULT_USER,
        ...parsedData,
        _id: parsedData._id || parsedData.id // Normalisation de l'ID
      };
      
      console.log("✅ getUser - Données valides:", formattedUser);
      return formattedUser;
    } catch (e) {
      console.error("❌ Erreur de parsing des données utilisateur", e);
      this.logout();
      return null;
    }
  },
  
  login: function(token, userData) {
    if (!token || !userData) {
      console.error("❌ Login: Token ou données utilisateur manquants");
      return false;
    }
    
    // Validation des données obligatoires
    if (!userData._id && !userData.id) {
      console.error("❌ Login: ID utilisateur manquant");
      return false;
    }
    
    const formattedUser = {
      ...DEFAULT_USER,
      ...userData,
      _id: userData._id || userData.id
    };
    
    try {
      console.log("💾 Sauvegarde des données utilisateur...");
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(formattedUser));
      
      // Vérification que les données sont bien sauvegardées
      const savedData = localStorage.getItem(USER_DATA_KEY);
      if (!savedData) throw new Error("Échec de la sauvegarde");
      
      console.log("✅ Login réussi - Utilisateur:", formattedUser);
      window.dispatchEvent(new Event('storage'));
      return true;
    } catch (e) {
      console.error("❌ Erreur lors du login:", e);
      this.logout();
      return false;
    }
  },
  
  logout: function() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    window.dispatchEvent(new Event('storage'));
    console.log("✅ Déconnexion effectuée");
  },
  
  updateUserData: function(updatedData) {
    const currentUser = this.getUser();
    if (!currentUser) {
      console.error("❌ updateUserData: Aucun utilisateur connecté");
      return false;
    }
    
    const mergedData = {
      ...currentUser,
      ...updatedData
    };
    
    try {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(mergedData));
      window.dispatchEvent(new Event('storage'));
      console.log("✅ Mise à jour réussie:", mergedData);
      return true;
    } catch (e) {
      console.error("❌ Erreur lors de la mise à jour:", e);
      return false;
    }
  },
  
  getAuthHeader: function() {
    const token = this.getToken();
    return token ? { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {};
  }
};