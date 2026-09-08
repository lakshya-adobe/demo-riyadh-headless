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
    hero: {
      eyebrow: "Riyadh Air",
      title: "The journey begins here",
      subtitle: "Explore our growing network of destinations.",
    },
    header: {
      homeLabel: "Riyadh Air home",
      logoAlt: "Riyadh Air",
      navLabel: "Primary",
      languageLabel: "Language",
      cartLabel: "Cart",
      accountLabel: "Account",
      menuLabel: "Menu",
      navItems: {
        planBook: "Plan & book",
        manage: "Manage",
        experience: "Experience",
        discoverRiyadh: "Discover Riyadh",
        sfeer: "Sfeer",
        aboutUs: "About us",
        help: "Help",
      },
    },
    footer: {
      logoAlt: "Riyadh Air",
      newsletterHeading: "Subscribe to our newsletter and be the first to know what's coming",
      emailLabel: "Email address",
      subscribeLabel: "Subscribe",
      consent: "I consent to the processing of my personal data for the purpose of sending me direct marketing communications, updates and offers from Riyadh Air.",
      termsPrefix: "By signing up, you agree to Riyadh Air's",
      termsLink: "Website Terms of Use",
      privacyPrefix: "and confirm that you have read the",
      privacyLink: "Privacy Policy",
      columns: {
        riyadhAir: "Riyadh Air",
        aboutUs: "About us",
        sfeer: "Sfeer",
        riyadhCargo: "Riyadh Cargo",
        discoverRiyadh: "Discover Riyadh",
        airlinePartnerships: "Airline partnerships",
        experience: "Experience",
        cabin: "Cabin",
        fleet: "Fleet",
        brandSonic: "Brand Sonic",
        connectWithUs: "Connect with us",
        contactUs: "Contact us",
        mediaHub: "Media hub",
        toolkit: "Toolkit",
        careers: "Careers",
        businessSolutions: "Business Solutions",
        marProgram: "MAR Program",
        gtaaAddendum: "GTAA Addendum",
      },
      legal: {
        copyright: "©2026 Copyright all rights reserved",
        sitemap: "Sitemap",
        legal: "Legal",
        termsOfUse: "Terms of use",
        privacyPolicy: "Privacy policy",
        cookiePolicy: "Cookie policy",
        conditionsOfCarriage: "Conditions of carriage",
        pifCompany: "A PIF COMPANY",
      },
    },
  },
  ar: {
    direction: "rtl",
    destinationRoots: [
      "/content/dam/riyadh/language-masters/ar/content-fragments/destinations",
      "/content/dam/riyadh/ar/content-fragments/destinations",
    ],
    destinationsHeading: "استكشف الوجهات",
    allDestinations: "الكل",
    hero: {
      eyebrow: "طيران الرياض",
      title: "تبدأ الرحلة من هنا",
      subtitle: "استكشف شبكتنا المتنامية من الوجهات.",
    },
    header: {
      homeLabel: "الصفحة الرئيسية لطيران الرياض",
      logoAlt: "طيران الرياض",
      navLabel: "التنقل الرئيسي",
      languageLabel: "اللغة",
      cartLabel: "السلة",
      accountLabel: "الحساب",
      menuLabel: "القائمة",
      navItems: {
        planBook: "خطط واحجز",
        manage: "إدارة الحجز",
        experience: "التجربة",
        discoverRiyadh: "اكتشف الرياض",
        sfeer: "سفير",
        aboutUs: "من نحن",
        help: "المساعدة",
      },
    },
    footer: {
      logoAlt: "طيران الرياض",
      newsletterHeading: "اشترك في نشرتنا الإخبارية وكن أول من يعرف ما هو قادم",
      emailLabel: "البريد الإلكتروني",
      subscribeLabel: "اشترك",
      consent: "أوافق على معالجة بياناتي الشخصية لغرض إرسال الاتصالات التسويقية المباشرة والتحديثات والعروض من طيران الرياض.",
      termsPrefix: "بالتسجيل، فإنك توافق على",
      termsLink: "شروط استخدام الموقع",
      privacyPrefix: "وتؤكد أنك قرأت",
      privacyLink: "سياسة الخصوصية",
      columns: {
        riyadhAir: "طيران الرياض",
        aboutUs: "من نحن",
        sfeer: "سفير",
        riyadhCargo: "الشحن في طيران الرياض",
        discoverRiyadh: "اكتشف الرياض",
        airlinePartnerships: "شراكات الطيران",
        experience: "التجربة",
        cabin: "المقصورة",
        fleet: "الأسطول",
        brandSonic: "الهوية الصوتية",
        connectWithUs: "تواصل معنا",
        contactUs: "اتصل بنا",
        mediaHub: "المركز الإعلامي",
        toolkit: "مجموعة الأدوات",
        careers: "الوظائف",
        businessSolutions: "حلول الأعمال",
        marProgram: "برنامج MAR",
        gtaaAddendum: "ملحق GTAA",
      },
      legal: {
        copyright: "©2026 جميع الحقوق محفوظة",
        sitemap: "خريطة الموقع",
        legal: "الشؤون القانونية",
        termsOfUse: "شروط الاستخدام",
        privacyPolicy: "سياسة الخصوصية",
        cookiePolicy: "سياسة ملفات تعريف الارتباط",
        conditionsOfCarriage: "شروط النقل",
        pifCompany: "إحدى شركات صندوق الاستثمارات العامة",
      },
    },
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
