import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserInfo } from "../API/api";
import ProfileImg from "../components/ProfileImg";
import Follower from "../components/Follower";
import Bio from "../components/Bio";
import "../style/profile.css";
import { updateUserBio } from "../API/api";

const UserProfile = () => {
  const { user: currentUser, updateUser } = useAuth();
  const { id: userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    try {
      if (!userId || userId === ':id' || userId === 'undefined') {
        if (!currentUser) throw new Error('Utilisateur non connecté');
        return currentUser;
      }
      return await getUserInfo(userId);
    } catch (err) {
      throw err;
    }
  };

  const loadProfileData = async () => {
    try {
      const data = await fetchProfileData();
      setProfileUser(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erreur chargement profil:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [userId, currentUser]);

  const updateProfileUserData = async () => {
    try {
      const updatedProfileUser = await fetchProfileData();
      setProfileUser(updatedProfileUser);
      
      // Si l'utilisateur courant est affecté, rafraîchir ses données
      if (currentUser) {
        const updatedCurrentUser = await getUserInfo(currentUser._id);
        updateUser(updatedCurrentUser);
      }
    } catch (err) {
      console.error("Erreur rafraîchissement données:", err);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profileUser) return <div className="not-found">Profil non disponible</div>;

  const isOwnProfile = currentUser && profileUser._id === currentUser._id;

  return (
    <div className="profile-root">
      <div className="profile-container">
        <div className="profile-page">
          <div className="profile-column">
            <div className="profile-header">
              <ProfileImg username={profileUser.pseudo} size="large" />
              <h2>{profileUser.pseudo}</h2>
            </div>
            <Bio
              initialBio={profileUser.bio || ""}
              onSaveBio={async (bio) => {
                try {
                  const updatedUser = await updateUserBio(profileUser._id, bio);
                  if (isOwnProfile) {
                    updateUser({ bio: updatedUser.bio });
                  }
                  setProfileUser(prev => ({ ...prev, bio: updatedUser.bio }));
                } catch (error) {
                  console.error("Erreur sauvegarde bio:", error);
                }
              }}
              isOwnProfile={isOwnProfile}
            />
          </div>

          <div className="follower-column">
            <div className="follower-section-enhanced">
              <Follower
                currentUserId={currentUser?._id}
                targetUserId={profileUser._id}
                initialFollowed={currentUser?.following?.includes(profileUser._id)}
                initialFollowersCount={profileUser.followers?.length || 0}
                initialFollowingCount={
                  isOwnProfile 
                    ? currentUser?.following?.length || 0 
                    : profileUser.following?.length || 0
                }
                onFollowChange={updateProfileUserData}
                isOwnProfile={isOwnProfile}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;