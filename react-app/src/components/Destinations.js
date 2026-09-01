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
import Error from "./Error";
import Loading from "./Loading";
import './Destinations.scss';

// The last segment of a destination's content path is used as the route id.
export function destinationName(path) {
    return path?.split('/').pop();
}

function Destinations() {
    const queryParameters = useMemo(() => ({ imageFormat: 'JPG', imageWidth: 1200, imageQuality: 80 }), []);
    const { destinations, errors } = useDestinations(queryParameters);
    const [country, setCountry] = useState('');

    // Handle error and loading conditions
    if (errors) {
        return <Error errorMessage={errors} />;
    } else if (!destinations) {
        return <Loading />;
    }

    // Derive the unique list of countries for the filter, sorted alphabetically
    const countries = [...new Set(destinations.map((d) => d.destinationCountry).filter(Boolean))].sort();
    const visibleDestinations = country
        ? destinations.filter((d) => d.destinationCountry === country)
        : destinations;

    return (
        <div className="destinations">
            <div className="destination-nav">
                <button className={country === '' ? 'active' : ''} onClick={() => setCountry('')}>All</button>
                {countries.map((name) => (
                    <button
                        key={name}
                        className={country === name ? 'active' : ''}
                        onClick={() => setCountry(name)}
                    >
                        {name}
                    </button>
                ))}
            </div>
            <ul className="destination-items">
                {visibleDestinations.map((destination) => (
                    <DestinationListItem key={destination._path} destination={destination} />
                ))}
            </ul>
        </div>
    );
}

// Render an individual destination card
function DestinationListItem({ destination }) {
    const { _path, destinationCity, destinationCountry, backgroundImage } = destination;

    // Must have a city to render
    if (!destinationCity) {
        return null;
    }

    const imageUrl = backgroundImage?._dynamicUrl || backgroundImage?._path;

    return (
        <li className="destination-item">
            <Link
                to={`/destination/${destinationName(_path)}`}
                state={{ city: destinationCity, country: destinationCountry }}
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
