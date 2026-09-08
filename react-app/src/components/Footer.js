/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from "react";
import logo from "../images/riyadhair-logo-white.svg";
import { DEFAULT_LANGUAGE, LANGUAGES } from "../locale";
import "./Footer.scss";

// Footer content mirrors riyadhair.com; links open the live site in a new tab.
const RA_BASE = "https://www.riyadhair.com";

const LINK_COLUMNS = [
    {
        headingKey: "riyadhAir",
        links: [
            { labelKey: "aboutUs", path: "about-us" },
            { labelKey: "sfeer", path: "sfeer" },
            { labelKey: "riyadhCargo", path: "riyadh-cargo" },
            { labelKey: "discoverRiyadh", path: "discover-riyadh" },
            { labelKey: "airlinePartnerships", path: "about-us/our-story/airline-partnerships" },
        ],
    },
    {
        headingKey: "experience",
        links: [
            { labelKey: "cabin", path: "experience/cabin" },
            { labelKey: "fleet", path: "experience/fleet" },
            { labelKey: "brandSonic", path: "experience/sonic-brand" },
        ],
    },
    {
        headingKey: "connectWithUs",
        links: [
            { labelKey: "contactUs", path: "help/contact-us" },
            { labelKey: "mediaHub", path: "media-hub" },
            { labelKey: "toolkit", path: "toolkit" },
            { labelKey: "careers", path: "careers" },
        ],
    },
    {
        headingKey: "businessSolutions",
        links: [
            { labelKey: "businessSolutions", path: "business-solution" },
            { labelKey: "marProgram", path: "mar-program" },
            { labelKey: "gtaaAddendum", path: "gtaa-addendum" },
        ],
    },
];

const LEGAL_LINKS = [
    { labelKey: "sitemap", path: "sitemap" },
    { labelKey: "legal", path: "legal" },
    { labelKey: "termsOfUse", path: "terms-of-use" },
    { labelKey: "privacyPolicy", path: "privacy-policy" },
    { labelKey: "cookiePolicy", path: "cookie-policy" },
    { labelKey: "conditionsOfCarriage", path: "conditions-of-carriage" },
];

const SOCIALS = [
    { label: "Instagram", icon: InstagramIcon },
    { label: "X", icon: XIcon },
    { label: "Facebook", icon: FacebookIcon },
    { label: "YouTube", icon: YouTubeIcon },
    { label: "TikTok", icon: TikTokIcon },
    { label: "LinkedIn", icon: LinkedInIcon },
];

function localizedHref(language, path) {
    return `${RA_BASE}/${language}/${path}`;
}

function footerLink(link, labels, language) {
    const label = labels[link.labelKey];

    return (
        <a key={link.labelKey} className="site-footer-link" href={localizedHref(language, link.path)} target="_blank" rel="noopener noreferrer">
            {label}
        </a>
    );
}

function Footer({ language = DEFAULT_LANGUAGE }) {
    const labels = LANGUAGES[language]?.footer ?? LANGUAGES[DEFAULT_LANGUAGE].footer;

    function handleSubscribe(event) {
        // Demo app: no backend to submit to.
        event.preventDefault();
    }

    return (
        <footer className="site-footer">
            <div className="site-footer-inner">
                <div className="site-footer-top">
                    <div className="site-footer-brand">
                        <img src={logo} className="site-footer-logo" alt={labels.logoAlt} />
                        <h2 className="site-footer-heading">{labels.newsletterHeading}</h2>

                        <form className="site-newsletter" onSubmit={handleSubscribe}>
                            <label className="site-newsletter-label" htmlFor="footer-email">{labels.emailLabel}</label>
                            <div className="site-newsletter-field">
                                <input id="footer-email" type="email" placeholder={labels.emailLabel} className="site-newsletter-input" />
                                <button type="submit" className="site-newsletter-submit" aria-label={labels.subscribeLabel}>
                                    <ArrowIcon />
                                </button>
                            </div>
                            <label className="site-consent">
                                <input type="checkbox" />
                                <span>{labels.consent}</span>
                            </label>
                            <p className="site-newsletter-terms">
                                {labels.termsPrefix}{" "}
                                <a href={localizedHref(language, "terms-of-use")} target="_blank" rel="noopener noreferrer">{labels.termsLink}</a>{" "}
                                {labels.privacyPrefix}{" "}
                                <a href={localizedHref(language, "privacy-policy")} target="_blank" rel="noopener noreferrer">{labels.privacyLink}</a>.
                            </p>
                        </form>
                    </div>

                    <div className="site-footer-columns">
                        {LINK_COLUMNS.map((column) => (
                            <nav key={column.headingKey} className="site-footer-column" aria-label={labels.columns[column.headingKey]}>
                                <h3 className="site-footer-column-heading">{labels.columns[column.headingKey]}</h3>
                                {column.links.map((link) => footerLink(link, labels.columns, language))}
                            </nav>
                        ))}
                    </div>
                </div>

                <hr className="site-footer-divider" />

                <div className="site-footer-bottom">
                    <p className="site-footer-copyright">{labels.legal.copyright}</p>

                    <div className="site-footer-legal">
                        {LEGAL_LINKS.map((link) => footerLink(link, labels.legal, language))}
                    </div>

                    <div className="site-footer-socials">
                        {SOCIALS.map(({ label, icon: Icon }) => (
                            <a
                                key={label}
                                className="site-footer-social"
                                href={RA_BASE}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                            >
                                <Icon />
                            </a>
                        ))}
                    </div>

                    <span className="site-footer-endorsement" aria-label={labels.legal.pifCompany}>
                        <PifIcon />
                        {labels.legal.pifCompany}
                    </span>
                </div>
            </div>
        </footer>
    );
}

function PifIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M3.5 9h17M3.5 15h17" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.02 4.13H5.06l12.02 15.64Z" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
        </svg>
    );
}

function YouTubeIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M23 12s0-3.2-.41-4.74a2.5 2.5 0 0 0-1.76-1.77C19.29 5.08 12 5.08 12 5.08s-7.29 0-8.83.41A2.5 2.5 0 0 0 1.41 7.26C1 8.8 1 12 1 12s0 3.2.41 4.74a2.5 2.5 0 0 0 1.76 1.77c1.54.41 8.83.41 8.83.41s7.29 0 8.83-.41a2.5 2.5 0 0 0 1.76-1.77C23 15.2 23 12 23 12ZM9.75 15.02V8.98L15 12l-5.25 3.02Z" />
        </svg>
    );
}

function TikTokIcon() {
    return (
        <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
            <path d="M16.5 2h-3v13.2a2.7 2.7 0 1 1-2-2.6V9.5a6 6 0 1 0 5 5.9V8.9a7 7 0 0 0 4 1.3V7.1a4 4 0 0 1-4-4Z" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
        </svg>
    );
}

export default Footer;
