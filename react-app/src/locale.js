/*
Copyright 2026 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

export const DEFAULT_LANGUAGE = "en";

export const LANGUAGES = {
  en: {
    direction: "ltr",
    destinationRoots: [
      "/content/dam/riyadh/language-masters/en/content-fragments/destinations",
    ],
    destinationsHeading: "Explore Destinations",
    allDestinations: "All",
  },
  ar: {
    direction: "rtl",
    destinationRoots: [
      "/content/dam/riyadh/language-masters/ar/content-fragments/destinations",
      "/content/dam/riyadh/ar/content-fragments/destinations",
    ],
    destinationsHeading: "استكشف الوجهات",
    allDestinations: "الكل",
  },
};

export function isSupportedLanguage(language) {
  return Object.prototype.hasOwnProperty.call(LANGUAGES, language);
}

export function getDestinationRoot(language) {
  return getDestinationRoots(language)[0];
}

export function getDestinationRoots(language) {
  return LANGUAGES[language]?.destinationRoots ?? LANGUAGES[DEFAULT_LANGUAGE].destinationRoots;
}

export function isDestinationForLanguage(path, language) {
  if (!path || !isSupportedLanguage(language)) {
    return false;
  }

  return getDestinationRoots(language).some((root) =>
    path === root || path.startsWith(`${root}/`)
  );
}

export function replacePathLanguage(pathname, language) {
  if (!isSupportedLanguage(language)) {
    return pathname;
  }

  const segments = pathname.split("/").filter(Boolean);
  if (isSupportedLanguage(segments[0])) {
    segments[0] = language;
  } else {
    segments.unshift(language);
  }

  return `/${segments.join("/")}`;
}
