/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from 'react';
import { useParams } from 'react-router-dom';
import { LANGUAGES } from '../locale';
import HeroBanner from './HeroBanner';
import Destinations from './Destinations';
import EdsBlock from './EdsBlock';

// EDS page whose "hero-lab" block is embedded below the hero banner.
const HERO_FRAGMENT_URL =
    'https://main--vwr--ynaka-adobe.aem.page/us/en/fragments/hero-fragment';

/***
 * Displays the video hero banner and a grid of Riyadh Air destinations
 */
function Home() {
    const { language } = useParams();

    return (
      <div className="Home">
        <HeroBanner />
        {/* Embedded AEM Edge Delivery "hero-lab" block, isolated in shadow DOM */}
        <EdsBlock url={HERO_FRAGMENT_URL} />
        <div className="page">
          <h2>{LANGUAGES[language].destinationsHeading}</h2>
          <Destinations language={language} />
        </div>
      </div>
    );
}

export default Home;
