/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDestinations } from "../api/usePersistedQueries";
import { addAemHost } from "../api/aemHeadlessClient";
import { DEFAULT_LANGUAGE, LANGUAGES, isDestinationForLanguage } from "../locale";
import Error from "./Error";
import Loading from "./Loading";
import './Destinations.scss';

// The last segment of a destination's content path is used as the route id.
export function destinationName(path) {
    return path?.split('/').pop();
}

function Destinations({ language = DEFAULT_LANGUAGE }) {
    const queryParameters = useMemo(() => ({ imageFormat: 'JPG', imageWidth: 1200, imageQuality: 80 }), []);
    const { destinations, errors } = useDestinations(queryParameters);
    const [country, setCountry] = useState('');

    // Handle error and loading conditions
    if (errors) {
        return <Error errorMessage={errors} />;
    } else if (!destinations) {
        return <Loading />;
    }

    const localizedDestinations = destinations.filter((destination) =>
        isDestinationForLanguage(destination._path, language)
    );

    // Derive the unique list of countries for the filter, sorted for the active language.
    const countries = [...new Set(localizedDestinations.map((d) => d.destinationCountry).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, language));
    const activeCountry = countries.includes(country) ? country : '';
    const visibleDestinations = activeCountry
        ? localizedDestinations.filter((d) => d.destinationCountry === activeCountry)
        : localizedDestinations;
    const allLabel = LANGUAGES[language]?.allDestinations ?? LANGUAGES[DEFAULT_LANGUAGE].allDestinations;

    return (
        <div className="destinations">
            <div className="destination-nav">
                <button className={activeCountry === '' ? 'active' : ''} onClick={() => setCountry('')}>{allLabel}</button>
                {countries.map((name) => (
                    <button
                        key={name}
                        className={activeCountry === name ? 'active' : ''}
                        onClick={() => setCountry(name)}
                    >
                        {name}
                    </button>
                ))}
            </div>
            <ul className="destination-items">
                {visibleDestinations.map((destination) => (
                    <DestinationListItem key={destination._path} destination={destination} language={language} />
                ))}
            </ul>
        </div>
    );
}

// Render an individual destination card
function DestinationListItem({ destination, language }) {
    const { _path, destinationCity, destinationCountry, backgroundImage } = destination;

    // Must have a city to render
    if (!destinationCity) {
        return null;
    }

    const imageUrl = backgroundImage?._dynamicUrl || backgroundImage?._path;

    return (
        <li className="destination-item">
            <Link
                to={`/${language}/destination/${destinationName(_path)}`}
                state={{ city: destinationCity, country: destinationCountry }}
                aria-label={destinationCity}
            >
                {imageUrl ? (
                    <img className="destination-item-image" src={addAemHost(imageUrl)} alt={destinationCity} />
                ) : (
                    <div className="destination-item-image destination-item-image--placeholder" aria-hidden="true" />
                )}
            </Link>
            <div className="destination-item-city">{destinationCity}</div>
            <div className="destination-item-country">{destinationCountry}</div>
        </li>
    );
}

export default Destinations;
