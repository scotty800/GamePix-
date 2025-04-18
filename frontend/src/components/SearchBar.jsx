import { React, useState, useEffect } from 'react';
import { getAllUsers } from "../API/api";
import { useNavigate } from "react-router-dom";

import "../style/SearchBar.css";
import Search from "../assets/images/search_icon.png";

export default function SearchBar({ placeholder }) {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [filterUsers, setFilterUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === "") {
            setFilterUsers([]);
        } else {
            setFilterUsers(
                users.filter((user) =>
                    user.pseudo.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    };

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="search-bar">
            <div className="group">
                <img src={Search} alt="search" className="search-icon" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleSearch}
                    className="input"
                />
            </div>
            {filterUsers.length > 0 ? (
                <ul className="search-results">
                    {filterUsers.map((user) => (
                        <li
                            key={user._id}
                            onClick={() => handleUserClick(user._id)}
                            className="search-result-item"
                        >
                            {user.pseudo}
                        </li>
                    ))}
                </ul>
            ) : (
                query.trim() !== "" && (
                    <div className="no-results-wrapper">
                        <p className="no-results">Aucun utilisateur trouvé.</p>
                    </div>
                )
            )}
        </div>
    );
}
