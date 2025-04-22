import React, { useState } from "react";
import { uploadProfilePic } from "../API/api";
import "../style/ProfileImg.css";

export default function ProfileImg({ username }) {
    const [profilePic, setProfilePic] = useState(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !username) return;

        try {
            const previewUrl = URL.createObjectURL(file);
            setProfilePic(previewUrl);

            const response = await uploadProfilePic(file, username);

            if (response?.user?.picture) {
                setProfilePic(response.user.picture);
            }
        } catch (error) {
            console.error("Erreur lors de l'upload :", error);
            setProfilePic(null);
        }
    };

    return (
        <div className="profile-img-container">
            {profilePic ? (
                <img 
                    src={profilePic} 
                    alt={`Profil de ${username}`} 
                    className="profile-img"
                    onError={() => setProfilePic(null)}
                />
            ) : (
                <div className="default-img">
                    {username?.charAt(0).toUpperCase() || "?"}
                </div>
            )}
            
            <label htmlFor="file-upload" className="upload-btn">
                +
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                />
            </label>
        </div>
    );
}