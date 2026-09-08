/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/riyadhair-logo-white.svg";
import { replacePathLanguage } from "../locale";
import "./Header.scss";

// Primary navigation mirrors riyadhair.com; links open the live site in a new tab.
const RA_BASE = "https://www.riyadhair.com";
const NAV_ITEMS = [
    { label: "Plan & book", path: "plan-book" },
    { label: "Manage", path: "manage" },
    { label: "Experience", path: "experience" },
    { label: "Discover Riyadh", path: "discover-riyadh" },
    { label: "Sfeer", path: "sfeer" },
    { label: "About us", path: "about-us" },
    { label: "Help", path: "help" },
];

function Header({ language }) {
    const location = useLocation();
    const navigate = useNavigate();

    function handleLanguageChange(event) {
        const nextLanguage = event.target.value;
        navigate(
            {
                pathname: replacePathLanguage(location.pathname, nextLanguage),
                search: location.search,
                hash: location.hash,
            },
            { state: location.state }
        );
    }

    return (
        <header className="site-header">
            <div className="site-header-inner">
                <Link to={`/${language}`} className="site-logo-link" aria-label="Riyadh Air home">
                    <img src={logo} className="site-logo" alt="Riyadh Air" />
                </Link>

                <nav className="site-nav" aria-label="Primary">
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.label}
                            className="site-nav-link"
                            href={`${RA_BASE}/${language}/${item.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="site-header-actions">
                    <label className="site-language-selector">
                        <span className="site-language-icon"><GlobeIcon /></span>
                        <span className="visually-hidden">Language</span>
                        <select
                            className="site-language-select"
                            value={language}
                            onChange={handleLanguageChange}
                            aria-label="Language"
                        >
                            <option value="en">EN</option>
                            <option value="ar">العربية</option>
                        </select>
                        <ChevronIcon />
                    </label>
                    <button type="button" className="site-icon-button" aria-label="Cart">
                        <CartIcon />
                    </button>
                    <div className="site-account-pill">
                        <button type="button" className="site-account-button" aria-label="Account">
                            <UserIcon />
                        </button>
                        <button type="button" className="site-account-button" aria-label="Menu">
                            <MenuIcon />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

function ChevronIcon() {
    return (
        <svg className="site-language-chevron" viewBox="0 0 12 8" width="12" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="m1 1 5 5 5-5" />
        </svg>
    );
}

function GlobeIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
        </svg>
    );
}

function CartIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M2 3h3l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.1a1.5 1.5 0 0 0 1.5-1.2L22 7H6" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20a8 8 0 0 1 16 0" />
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
    );
}

export default Header;
