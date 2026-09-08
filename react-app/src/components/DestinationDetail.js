/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from 'react';
import { useParams } from "react-router-dom";
import { useDestinationByPath } from "../api/usePersistedQueries";
import { getDestinationRoot } from "../locale";
import SearchBar from "./SearchBar";
import './DestinationDetail.scss';
import Error from "./Error";
import Loading from "./Loading";

/**
 * Decodes HTML entities (the destinationDetails html is double-escaped).
 */
function decodeEntities(html) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
}

/**
 * Parses the destinationDetails html into the pieces the design lays out:
 * a title, a hero image, a heading and the body copy.
 */
function parseDestinationDetails(rawHtml) {
    if (!rawHtml) {
        return { title: '', imageUrl: null, heading: '', body: '' };
    }

    // Decode twice to unwrap the double-escaped markup, then parse the real DOM.
    const decoded = decodeEntities(decodeEntities(rawHtml));
    const doc = new DOMParser().parseFromString(`<div id="root">${decoded}</div>`, 'text/html');
    const root = doc.getElementById('root');

    const img = root.querySelector('img');
    const src = img?.getAttribute('src') || '';
    const imageUrl = /^https?:\/\//i.test(src) ? src : null;

    const paragraphs = [...root.querySelectorAll('p')]
        .map((p) => p.textContent.trim())
        .filter(Boolean);

    const title = paragraphs[0] || '';
    const description = paragraphs.slice(1).join('\n\n');

    // The heading and body are concatenated in the source at a lowercase->uppercase
    // seam (a missing space, e.g. "Riyadh AirBangkok"). Split there.
    let heading = '';
    let body = description;
    const seam = description.match(/^(.*?[a-z])([A-Z].*)$/s);
    if (seam) {
        heading = seam[1];
        body = seam[2];
    }

    return { title, imageUrl, heading, body };
}

function DestinationDetail() {
    // The route param is the destination's content-path node name (e.g. "bangkok")
    const { language, name } = useParams();
    const destinationPath = `${getDestinationRoot(language)}/${name}`;
    const { destination, errors } = useDestinationByPath(destinationPath);

    // Handle error and loading conditions
    if (errors) {
        return <div className="page"><Error errorMessage={errors} /></div>;
    } else if (!destination) {
        return <div className="page"><Loading /></div>;
    }

    const { title, imageUrl, heading, body } = parseDestinationDetails(destination.destinationDetails?.html);

    return (
        <div className="page">
            <SearchBar />

            <article className="destination-detail">
                {title && <h1 className="destination-detail-title">{title}</h1>}

                {imageUrl && (
                    <img
                        className="destination-detail-hero"
                        src={imageUrl}
                        alt={destination.destinationCity || title}
                    />
                )}

                {heading && <h2 className="destination-detail-heading">{heading}</h2>}
                {body && <p className="destination-detail-body">{body}</p>}
            </article>
        </div>
    );
}

export default DestinationDetail;
