import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useDestinations } from '../api/usePersistedQueries';
import Destinations from './Destinations';

jest.mock('../api/usePersistedQueries');

const destinations = [
  {
    _path: '/content/dam/riyadh/language-masters/en/content-fragments/destinations/bangkok',
    destinationCity: 'Bangkok',
    destinationCountry: 'Thailand',
  },
  {
    _path: '/content/dam/riyadh/language-masters/ar/content-fragments/destinations/bangkok',
    destinationCity: 'بانكوك',
    destinationCountry: 'تايلاند',
  },
  {
    _path: '/content/dam/riyadh/ar/content-fragments/destinations/jeddah',
    destinationCity: 'جدة',
    destinationCountry: 'السعودية',
  },
  {
    _path: '/content/dam/riyadh/content-fragments/destinations/bangkok',
    destinationCity: 'Legacy Bangkok',
    destinationCountry: 'Thailand',
  },
];

beforeEach(() => {
  useDestinations.mockReturnValue({ destinations, errors: null });
});

test('shows only Arabic content fragments on the Arabic route', () => {
  render(
    <MemoryRouter>
      <Destinations language="ar" />
    </MemoryRouter>
  );

  expect(screen.getByText('بانكوك')).toBeInTheDocument();
  expect(screen.getByText('جدة')).toBeInTheDocument();
  expect(screen.queryByText('Bangkok')).not.toBeInTheDocument();
  expect(screen.queryByText('Legacy Bangkok')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'بانكوك' })).toHaveAttribute('href', '/ar/destination/bangkok');
});

test('shows only language-master English fragments on the English route', () => {
  render(
    <MemoryRouter>
      <Destinations language="en" />
    </MemoryRouter>
  );

  expect(screen.getByText('Bangkok')).toBeInTheDocument();
  expect(screen.queryByText('بانكوك')).not.toBeInTheDocument();
  expect(screen.queryByText('جدة')).not.toBeInTheDocument();
  expect(screen.queryByText('Legacy Bangkok')).not.toBeInTheDocument();
});
