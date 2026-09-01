/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React, { useMemo } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import DOMPurify from 'dompurify';
import { useDestinationByPath } from "../api/usePersistedQueries";
import { addAemHost } from "../api/aemHeadlessClient";

import backIcon from '../images/icon-close.svg';
import './DestinationDetail.scss';
import Error from "./Error";
import Loading from "./Loading";

// All destination content fragments live under this parent path.
const DESTINATIONS_ROOT = '/content/dam/riyadh/content-fragments/destinations';

/**
 * The destinationDetails.html field arrives with escaped markup (e.g. &lt;p&gt;), so
 * decode the entities first, then sanitize the resulting markup before rendering.
 */
function toSafeHtml(html) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return DOMPurify.sanitize(textarea.value);
}

function DestinationDetail() {
    // The route param is the destination's content-path node name (e.g. "bangkok")
    const { name } = useParams();
    const { state } = useLocation();

    const destinationPath = `${DESTINATIONS_ROOT}/${name}`;
    const queryParameters = useMemo(() => ({ imageFormat: 'JPG', imageSeoName: name, imageWidth: 1200, imageQuality: 80 }), [name]);
    const { destination, error } = useDestinationByPath(destinationPath, queryParameters);

    // Handle error and loading conditions
    if (error) {
        return <div className="page"><Error errorMessage={error} /></div>;
    } else if (!destination) {
        return <div className="page"><Loading /></div>;
    }

    // The by-path query returns no image, so use the one passed from the list card when available.
    const heroImage = state?.image;

    return (
        <div className="page">
        <div className="destination-detail">
            <Link className="destination-detail-close-button" to="/">
                <img src={backIcon} alt="Return" />
            </Link>

            <p className="destination-detail-country">{destination.destinationCountry}</p>
            <h1 className="destination-detail-city">{destination.destinationCity}</h1>

            {heroImage && (
                <img
                    className="destination-detail-image"
                    src={addAemHost(heroImage)}
                    alt={destination.destinationCity}
                />
            )}

            {destination.destinationDetails?.html && (
                <div
                    className="destination-detail-body"
                    dangerouslySetInnerHTML={{ __html: toSafeHtml(destination.destinationDetails.html) }}
                />
            )}
        </div>
        </div>
    );
}

export default DestinationDetail;
