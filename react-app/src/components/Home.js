/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from 'react';
import HeroBanner from './HeroBanner';
import Destinations from './Destinations';

/***
 * Displays the video hero banner and a grid of Riyadh Air destinations
 */
function Home() {
    return (
      <div className="Home">
        <HeroBanner />
        <div className="page">
          <h2>Explore Destinations</h2>
          <Destinations />
        </div>
      </div>
    );
}

export default Home;
