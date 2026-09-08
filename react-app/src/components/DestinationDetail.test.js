import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useDestinationByPath } from '../api/usePersistedQueries';
import DestinationDetail from './DestinationDetail';

jest.mock('../api/usePersistedQueries');

test('queries the destination under the selected Arabic content root', () => {
  useDestinationByPath.mockReturnValue({
    destination: {
      destinationCity: 'بانكوك',
      destinationDetails: { html: '' },
    },
    errors: null,
  });

  render(
    <MemoryRouter initialEntries={['/ar/destination/bangkok']}>
      <Routes>
        <Route path="/:language/destination/:name" element={<DestinationDetail />} />
      </Routes>
    </MemoryRouter>
  );

  expect(useDestinationByPath).toHaveBeenCalledWith(
    '/content/dam/riyadh/language-masters/ar/content-fragments/destinations/bangkok'
  );
});
