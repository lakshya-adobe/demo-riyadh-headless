import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import Header from './Header';

function TestHeader() {
  const { language } = useParams();
  const location = useLocation();

  return (
    <>
      <Header language={language} />
      <output data-testid="location">
        {location.pathname}{location.search}{location.hash}
      </output>
    </>
  );
}

test('switches the URL language without losing the current page', async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={['/en/destination/bangkok?trip=1#details']}>
      <Routes>
        <Route path="/:language/*" element={<TestHeader />} />
      </Routes>
    </MemoryRouter>
  );

  await user.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'ar');

  expect(screen.getByTestId('location'))
    .toHaveTextContent('/ar/destination/bangkok?trip=1#details');
  expect(screen.getByRole('link', { name: 'الصفحة الرئيسية لطيران الرياض' }))
    .toHaveAttribute('href', '/ar');
});

test('renders Arabic header labels on Arabic routes', () => {
  render(
    <MemoryRouter initialEntries={['/ar']}>
      <Routes>
        <Route path="/:language/*" element={<TestHeader />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole('link', { name: 'الصفحة الرئيسية لطيران الرياض' }))
    .toHaveAttribute('href', '/ar');
  expect(screen.getByRole('navigation', { name: 'التنقل الرئيسي' }))
    .toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'خطط واحجز' }))
    .toHaveAttribute('href', 'https://www.riyadhair.com/ar/plan-book');
  expect(screen.getByRole('combobox', { name: 'اللغة' })).toHaveValue('ar');
});
