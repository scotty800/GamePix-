import React, { useState, useEffect } from "react";
import "../style/Bio.css";

export default function Bio({ initialBio = "", onSaveBio, isOwnProfile }) {
  const [bio, setBio] = useState(initialBio);
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Définir la fonction handleChange
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
      setTimeout(() => setShowSavedMessage(false), 2000);  // Message de confirmation
      setIsEditing(false); // Masque le champ de texte après la sauvegarde
    } catch (error) {
      console.error("Erreur sauvegarde bio:", error);
      setBio(initialBio);  // Restaure la bio originale en cas d'échec
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);  // Active l'édition
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
        <>
          {/* Affiche la bio seulement si elle est modifiée ou pas encore modifiée */}
          <div className="bio-display" onClick={isSaving ? undefined : handleEdit}>
            {bio || (
              <span className="bio-placeholder">
                Cliquez pour ajouter une bio...
              </span>
            )}
          </div>
          {/* Affiche le message de confirmation seulement après la sauvegarde */}
          {showSavedMessage && (
            <div className="bio-saved-message">Bio sauvegardée !</div>
          )}
        </>
      )}
    </div>
  );
}
