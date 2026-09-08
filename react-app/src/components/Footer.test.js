import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('renders Arabic footer copy and Arabic Riyadh Air links', () => {
  render(<Footer language="ar" />);

  expect(screen.getByRole('heading', {
    name: 'اشترك في نشرتنا الإخبارية وكن أول من يعرف ما هو قادم',
  })).toBeInTheDocument();
  expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'اشترك' })).toBeInTheDocument();
  expect(screen.getByText('©2026 جميع الحقوق محفوظة')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'شروط الاستخدام' }))
    .toHaveAttribute('href', 'https://www.riyadhair.com/ar/terms-of-use');
  expect(screen.getAllByRole('link', { name: 'سياسة الخصوصية' }))
    .toEqual(expect.arrayContaining([
      expect.objectContaining({
        href: 'https://www.riyadhair.com/ar/privacy-policy',
      }),
    ]));
});
