import React from "react";
import Navbar from "../components/Navbar";
import "../style/home.css";
import PostsPage from "../components/PostsPage";

export default function Home() {
  return (
    <div className="home-page"> {/* Classe principale */}
      <div className="page-container">
        <div className="background-home">
          <PostsPage/>
        </div>
      </div>
    </div>
  );
}
