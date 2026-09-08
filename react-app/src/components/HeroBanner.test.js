import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroBanner from './HeroBanner';

jest.mock('../api/aemHeadlessClient', () => ({
  addAemHost: (url) => url,
}));

test('renders hero copy below the video banner', () => {
  const { container } = render(<HeroBanner />);

  expect(container.querySelector('.hero-banner video')).toBeInTheDocument();
  expect(screen.getByText('The journey begins here')).toBeInTheDocument();
  expect(container.querySelector('.hero-overlay')).not.toBeInTheDocument();
});

test('renders translated Arabic hero copy for Arabic routes', () => {
  render(<HeroBanner language="ar" />);

  expect(screen.getByText('طيران الرياض')).toBeInTheDocument();
  expect(screen.getByText('تبدأ الرحلة من هنا')).toBeInTheDocument();
  expect(screen.getByText('استكشف شبكتنا المتنامية من الوجهات.')).toBeInTheDocument();
});
