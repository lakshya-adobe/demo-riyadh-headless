/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/riyadhair-logo-white.svg";
import "./Header.scss";

// Primary navigation mirrors riyadhair.com; links open the live site in a new tab.
const RA_BASE = "https://www.riyadhair.com";
const NAV_ITEMS = [
    { label: "Plan & book", href: "/en/plan-book" },
    { label: "Manage", href: "/en/manage" },
    { label: "Experience", href: "/en/experience" },
    { label: "Discover Riyadh", href: "/en/discover-riyadh" },
    { label: "Sfeer", href: "/en/sfeer" },
    { label: "About us", href: "/en/about-us" },
    { label: "Help", href: "/en/help" },
];

function Header() {
    return (
        <header className="site-header">
            <div className="site-header-inner">
                <Link to="/" className="site-logo-link" aria-label="Riyadh Air home">
                    <img src={logo} className="site-logo" alt="Riyadh Air" />
                </Link>

                <nav className="site-nav" aria-label="Primary">
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.label}
                            className="site-nav-link"
                            href={`${RA_BASE}${item.href}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="site-header-actions">
                    <button type="button" className="site-icon-button" aria-label="Select language">
                        <GlobeIcon />
                    </button>
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
