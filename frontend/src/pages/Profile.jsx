import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserInfo, getUserPosts, updateUserBio } from "../API/api";
import ProfileImg from "../components/ProfileImg";
import Follower from "../components/Follower";
import Bio from "../components/Bio";
import PostCard from "../components/PostCard";
import "../style/profile.css";

const UserProfile = () => {
  const { user: currentUser, updateUser } = useAuth();
  const { id: userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
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

  const fetchUserPosts = async (userId) => {
    try {
      const postsData = await getUserPosts(userId);
      setPosts(postsData);
    } catch (err) {
      console.error('Erreur chargement posts:', err);
      setError(`Erreur lors du chargement des posts: ${err.message}`);
    }
  };

  const loadProfileData = async () => {
    try {
      const data = await fetchProfileData();
      setProfileUser(data);
      await fetchUserPosts(data._id);
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

      if (currentUser) {
        const updatedCurrentUser = await getUserInfo(currentUser._id);
        updateUser(updatedCurrentUser);
      }
    } catch (err) {
      console.error("Erreur rafraîchissement données:", err);
    }
  };

  const refreshPosts = async () => {
    if (profileUser) {
      await fetchUserPosts(profileUser._id);
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
          {/* Colonne de profil */}
          <div className="profile-column">
            <div className="profile-header">
              <ProfileImg
                username={profileUser.pseudo}
                userId={profileUser._id}
              />
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

          {/* Colonne de followers */}
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

          {/* Section des posts - Nouvelle disposition */}
          <div className="posts-full-width">
            <div className="user-posts-section">
              <h3>Posts de {profileUser.pseudo}</h3>
              {posts.length > 0 ? (
                posts.map(post => (
                  <PostCard
                    key={post._id}
                    post={post}
                    refreshPosts={refreshPosts}
                  />
                ))
              ) : (
                <p>Aucune Publication</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;