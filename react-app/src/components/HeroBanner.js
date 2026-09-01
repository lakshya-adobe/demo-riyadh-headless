/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React, { useEffect, useRef, useState } from "react";
import { addAemHost } from "../api/aemHeadlessClient";
import "./HeroBanner.scss";

// Banner video served directly from the AEM DAM (REACT_APP_HOST_URI + asset path).
const BANNER_VIDEO_PATH = "/content/dam/riyadh/assets/riyadh_air_banner.mp4";

function HeroBanner() {
    const videoUrl = addAemHost(BANNER_VIDEO_PATH);
    const videoRef = useRef(null);
    // Autoplay requires the video to start muted; the toggle lets the user enable sound.
    const [muted, setMuted] = useState(true);

    // Drive the DOM `muted` property directly; the React prop alone is unreliable.
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = muted;
        }
    }, [muted]);

    return (
        <section className="hero-banner" aria-label="Riyadh Air">
            <video
                ref={videoRef}
                className="hero-video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
            >
                <source src={videoUrl} type="video/mp4" />
            </video>
            <div className="hero-overlay">
                <div className="hero-content">
                    <p className="hero-eyebrow">Riyadh Air</p>
                    <h1 className="hero-title">The journey begins here</h1>
                    <p className="hero-subtitle">Explore our growing network of destinations.</p>
                </div>
            </div>
            <button
                type="button"
                className="hero-mute-toggle"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute video" : "Mute video"}
                aria-pressed={!muted}
            >
                {muted ? <MutedIcon /> : <SoundIcon />}
            </button>
        </section>
    );
}

function MutedIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4V5Z" />
            <path d="m23 9-6 6M17 9l6 6" />
        </svg>
    );
}

function SoundIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4V5Z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
    );
}

export default HeroBanner;
