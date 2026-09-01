/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from "react";
import "./SearchBar.scss";

// Presentational flight-search widget mirroring riyadhair.com (no booking backend).
function SearchBar() {
    return (
        <div className="flight-search" role="search" aria-label="Flight search">
            <div className="flight-search-field">
                <span className="flight-search-label">From</span>
                <span className="flight-search-value">RUH - Riyadh</span>
            </div>

            <button type="button" className="flight-search-swap" aria-label="Swap origin and destination">
                <SwapIcon />
            </button>

            <div className="flight-search-field">
                <span className="flight-search-label">To</span>
                <span className="flight-search-value flight-search-placeholder">To</span>
            </div>

            <div className="flight-search-field">
                <span className="flight-search-value flight-search-placeholder">Departure</span>
            </div>

            <div className="flight-search-field">
                <span className="flight-search-value flight-search-placeholder">Return</span>
            </div>

            <div className="flight-search-field">
                <span className="flight-search-label">Guests</span>
                <span className="flight-search-value">1 Guest</span>
            </div>

            <div className="flight-search-field">
                <span className="flight-search-label">Cabin</span>
                <span className="flight-search-value">Economy</span>
            </div>

            <button type="button" className="flight-search-submit" aria-label="Search flights">
                <SearchIcon />
            </button>
        </div>
    );
}

function SwapIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9h13l-3-3M20 15H7l3 3" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

export default SearchBar;
