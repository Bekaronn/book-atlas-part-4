import React from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/NavBar.css'
import { useAuth } from '../context/AuthProvider'

export default function Navbar() {
    const { user, loading, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="brand">
                <NavLink to="/" className="brand">BookAtlas</NavLink>
            </div>

            <div className="nav-right">

                <NavLink to="/" end>Home</NavLink>
                <NavLink to="/books">Books</NavLink>
                <NavLink to="/about">About</NavLink>

                {loading ? (
                    <span className="loading-mini">...</span> 
                ) : user ? (
                    <>
                        <NavLink to="/profile">Profile</NavLink>
                        <button onClick={logout} className="logout-btn">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className="login-btn">Login</NavLink>
                        <NavLink to="/signup" className="signup-btn">Signup</NavLink>
                    </>
                )}

            </div>
        </nav>
    );
}
