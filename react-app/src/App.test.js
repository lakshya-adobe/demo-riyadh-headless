/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/EdsBlock', () => function MockEdsBlock() {
  return null;
});

jest.mock('./components/HeroBanner', () => function MockHeroBanner() {
  return null;
});

jest.mock('./api/usePersistedQueries', () => ({
  useDestinations: () => ({ destinations: [], errors: null }),
  useDestinationByPath: () => ({ destination: null, errors: null }),
}));

test('redirects the root URL to English and renders the Riyadh Air logo', async () => {
  window.scrollTo = jest.fn();
  window.history.pushState({}, '', '/');
  render(<App />);

  const homeLink = await screen.findByRole('link', { name: 'Riyadh Air home' });
  expect(homeLink).toBeInTheDocument();
  expect(window.location.pathname).toBe('/en');
  expect(document.documentElement.lang).toBe('en');
  expect(document.documentElement.dir).toBe('ltr');
});
