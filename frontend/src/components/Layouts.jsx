import React from "react";
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import '../style/Layout.css'

export default function Layout() {
  return (
    <div className="layout-container">
      <Navbar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}