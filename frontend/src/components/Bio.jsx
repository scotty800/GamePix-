import React, { useState, useEffect } from "react";
import "../style/Bio.css";

export default function Bio({ initialBio = "", onSaveBio, isOwnProfile }) {
  const [bio, setBio] = useState(initialBio);
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Définir la fonction handleChange qui manquait
  const handleChange = (e) => {
    setBio(e.target.value);
  };

  useEffect(() => {
    setBio(initialBio);
  }, [initialBio]);

  const handleSave = async () => {
    if (!onSaveBio || bio === initialBio) {
      console.error("La fonction onSaveBio n'est pas définie");
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSaveBio(bio);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 2000);
    } catch (error) {
      console.error("Erreur sauvegarde bio:", error);
      setBio(initialBio);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!isOwnProfile) {
    return <div className="bio-text">{bio || "Aucune bio disponible"}</div>;
  }

  return (
    <div className="bio-container">
      {isEditing ? (
        <>
          <textarea
            className="bio-textarea"
            value={bio}
            onChange={handleChange}
            placeholder="Décrivez-vous en quelques mots..."
            maxLength={150}
            disabled={isSaving}
          />
          <div className="bio-actions">
            <button 
              className="bio-save-button" 
              onClick={handleSave}
              disabled={isSaving || bio === initialBio}
            >
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            <button
              className="bio-cancel-button"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              Annuler
            </button>
          </div>
          <div className="bio-counter">{bio.length}/150</div>
        </>
      ) : (
        <div className="bio-display" onClick={isSaving ? undefined : handleEdit}>
          {bio || (
            <span className="bio-placeholder">
              Cliquez pour ajouter une bio...
            </span>
          )}
          {showSavedMessage && (
            <div className="bio-saved-message">Bio sauvegardée !</div>
          )}
        </div>
      )}
    </div>
  );
}