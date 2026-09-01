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

test('renders the Riyadh Air logo', () => {
  render(<App />);
  const logoElement = screen.getByAltText(/Riyadh Air/i);
  expect(logoElement).toBeInTheDocument();
});
