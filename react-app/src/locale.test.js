import {
  getDestinationRoot,
  getDestinationRoots,
  isDestinationForLanguage,
  replacePathLanguage,
} from './locale';

describe('locale paths', () => {
  test('uses the translated AEM destination roots', () => {
    expect(getDestinationRoot('en')).toBe(
      '/content/dam/riyadh/language-masters/en/content-fragments/destinations'
    );
    expect(getDestinationRoot('ar')).toBe(
      '/content/dam/riyadh/language-masters/ar/content-fragments/destinations'
    );
    expect(getDestinationRoots('ar')).toContain(
      '/content/dam/riyadh/ar/content-fragments/destinations'
    );
  });

  test('only accepts content fragments under the exact selected-language root', () => {
    expect(isDestinationForLanguage(
      '/content/dam/riyadh/language-masters/en/content-fragments/destinations/bangkok',
      'en'
    )).toBe(true);
    expect(isDestinationForLanguage(
      '/content/dam/riyadh/content-fragments/destinations/bangkok',
      'en'
    )).toBe(false);
    expect(isDestinationForLanguage(
      '/content/dam/riyadh/language-masters/ar/content-fragments/destinations/bangkok',
      'en'
    )).toBe(false);
    expect(isDestinationForLanguage(
      '/content/dam/riyadh/language-masters/ar/content-fragments/destinations/bangkok',
      'ar'
    )).toBe(true);
    expect(isDestinationForLanguage(
      '/content/dam/riyadh/ar/content-fragments/destinations/bangkok',
      'ar'
    )).toBe(true);
  });

  test('changes the locale segment while preserving the rest of the path', () => {
    expect(replacePathLanguage('/en/destination/bangkok', 'ar'))
      .toBe('/ar/destination/bangkok');
    expect(replacePathLanguage('/', 'ar')).toBe('/ar');
  });
});
