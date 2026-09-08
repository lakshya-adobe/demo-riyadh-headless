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
import { DEFAULT_LANGUAGE, LANGUAGES, replacePathLanguage } from "../locale";
import "./Header.scss";

// Primary navigation mirrors riyadhair.com; links open the live site in a new tab.
const RA_BASE = "https://www.riyadhair.com";
const NAV_ITEMS = [
    { key: "planBook", path: "plan-book" },
    { key: "manage", path: "manage" },
    { key: "experience", path: "experience" },
    { key: "discoverRiyadh", path: "discover-riyadh" },
    { key: "sfeer", path: "sfeer" },
    { key: "aboutUs", path: "about-us" },
    { key: "help", path: "help" },
];

function Header({ language }) {
    const location = useLocation();
    const navigate = useNavigate();
    const labels = LANGUAGES[language]?.header ?? LANGUAGES[DEFAULT_LANGUAGE].header;

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
                <Link to={`/${language}`} className="site-logo-link" aria-label={labels.homeLabel}>
                    <img src={logo} className="site-logo" alt={labels.logoAlt} />
                </Link>

                <nav className="site-nav" aria-label={labels.navLabel}>
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.key}
                            className="site-nav-link"
                            href={`${RA_BASE}/${language}/${item.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {labels.navItems[item.key]}
                        </a>
                    ))}
                </nav>

                <div className="site-header-actions">
                    <label className="site-language-selector">
                        <span className="site-language-icon"><GlobeIcon /></span>
                        <span className="visually-hidden">{labels.languageLabel}</span>
                        <select
                            className="site-language-select"
                            value={language}
                            onChange={handleLanguageChange}
                            aria-label={labels.languageLabel}
                        >
                            <option value="en">EN</option>
                            <option value="ar">العربية</option>
                        </select>
                        <ChevronIcon />
                    </label>
                    <button type="button" className="site-icon-button" aria-label={labels.cartLabel}>
                        <CartIcon />
                    </button>
                    <div className="site-account-pill">
                        <button type="button" className="site-account-button" aria-label={labels.accountLabel}>
                            <UserIcon />
                        </button>
                        <button type="button" className="site-account-button" aria-label={labels.menuLabel}>
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
