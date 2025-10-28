// i18n/i18n.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** ---------- Oversettelser ---------- */
const translations = {
  no: {
    tabs: { home: 'Hjem', checklist: 'Sjekkliste', quiz: 'Quiz', learn: 'Lær mer' },
    actions: { back: 'Tilbake', backToHome: 'Tilbake til Hjem' },

    home: {
      title: 'Velkommen til PhishShield 🔒',
      subtitle: 'Velg kategori og test deg selv.',
      startQuiz: 'Start quiz',
      checklist: 'Sjekkliste',
      tip: 'Tips: 1) Sjekk avsender 2) Sjekk lenker 3) Bruk 2FA.',
      best: 'Beste i «{label}»: {score}/{total} ({pct}%)',
      categories: {
        blandet: 'Blandet',
        avsender: 'Avsender',
        lenker: 'Lenker',
        okonomi: 'Økonomi',
        kjarlighet: 'Kjærlighet',
        passord2fa: 'Passord/2FA',
      },
    },

    checklist: {
      title: 'Før du klikker… ✅',
      items: [
        'Sjekk avsender: domene, e-post og telefonnummer',
        'Hold over/forhåndsvis lenken: er toppdomenet ekte?',
        'Ikke la deg stresse: tidsfrister og trusler = rødt flagg',
        'Skriv aldri inn passord via en lenke du fikk',
        'Bruk 2FA og egne bokmerker til pålogging',
        'Se etter stavefeil, dårlig språk og generiske hilsener',
        'Ikke åpne mistenkelige vedlegg (.zip/.exe/.html)',
        'Bekreft via offisielle kanaler (ring, app, nettbank)',
        'Rapportér mistenkelig e-post til IT eller leverandør',
        'Bytt passord og sjekk enhetslogg ved mistanke',
      ],
      tip: 'Tips: Bruk en passordmanager og unike passord – så tåler du at ett passord lekker.',
    },

    quiz: {
      progress: 'Spørsmål {i} av {total}',
      choicePhish: 'Dette er PHISH',
      choiceSafe: 'Dette ser TRYGT ut',
      feedbackPhish: 'Phish oppdaget 🧪',
      feedbackSafe: 'Ser trygt ut ✅',
      next: 'Neste',
      seeResult: 'Se resultat',
      resultTitle: 'Ferdig! 🎉',
      replay: 'Spill igjen',
      share: 'Del resultat',
      backHome: 'Til Hjem',
      explainer: 'Tips: Sjekk avsender, sjekk lenker, bruk 2FA.',
      bestNone: 'Ingen beste score ennå',
      bestText: 'Beste: {score}/{total} ({pct}%)',
      shareMsg:
        'Kategori: {category}\nResultat: {score}/{total} ({pct}%) i PhishShield 🛡️\nTest deg selv – lær å avsløre phishing!',
    },

    /** ---------- LÆR MER ---------- */
    learn: {
      title: 'Lær mer 🔎',

      featuresTitle: 'Kjennetegn på phishing',
      features: [
        'Uvanlig avsender eller domene',
        'Hastverk, trusler eller «for godt til å være sant»',
        'Lenker som etterligner kjente tjenester',
        'Filer som ber om makroer eller pålogging',
      ],

      verifyTitle: 'Slik verifiserer du',
      verify: [
        'Gå selv til tjenesten via bokmerke eller app',
        'Sammenlign domenet nøye (vipps.no vs vipps-no-login.com)',
        'Ring offisielt nummer, ikke nummeret i meldingen',
      ],

      habitsTitle: 'Sikre vaner',
      habits: [
        'Unike passord + passordmanager',
        'Aktiver 2FA overalt',
        'Oppdater enheter og apper',
        'Rapportér mistenkelig aktivitet tidlig',
      ],

      sourcesTitle: 'Gode kilder',
      sources: {
        nettvett: 'nettvett.no',
        politiet: 'politiet.no – svindel',
        nsm: 'Nasjonal sikkerhetsmyndighet – Råd og anbefalinger',
      },

      aboutTitle: 'Om utvikleren',
      aboutText:
        'Applikasjonen er laget av Louise Fosdahl, med stor interesse for cybersikkerhet. Jeg vil gjøre digital sikkerhet enklere og mer tilgjengelig for alle.',

      contactTitle: 'Kontakt',
      emailLabel: '📧 fosdahllouise@gmail.com',

      privacyTitle: 'Personvern & sikkerhet',
      privacy: {
        noAccountTitle: 'Ingen konto. Ingen database.',
        noAccountText:
          'Appen lagrer ikke data i skyen og krever ingen innlogging. Vi har ingen servere og samler ikke inn personopplysninger.',

        localTitle: 'Lokal lagring kun for funksjon',
        localText:
          'Appen bruker AsyncStorage lokalt for ting som beste quiz-score. Disse dataene forlater ikke enheten din.',

        noNetworkTitle: 'Ingen nettverkskall',
        noNetworkText:
          'Appen gjør ingen bakgrunns-kall. Eksterne lenker åpnes kun når du trykker.',

        noTrackingTitle: 'Ingen sporing',
        noTrackingText:
          'Ingen analytics, ingen tredjeparts-SDK-er for sporing eller annonser.',

        permissionsTitle: 'Tillatelser',
        permissionsText:
          'Appen ber ikke om kamera, mikrofon, kontakter eller posisjon.',

        howSafeTitle: 'Hvor trygg er appen?',
        howSafeText:
          'Siden det ikke sendes/lagres data hos oss, er personvernet svært godt. Risiko finnes alltid (f.eks. ondsinnede lenker i nettleser).',

        improveTitle: 'Slik øker du sikkerheten',
        improve: [
          'Hold enheten oppdatert',
          'Bruk skjermlås og auto-oppdatering av apper',
          'Vær varsom med alle lenker – også fra ressurssiden',
        ],
      },
    },
  },

  en: {
    tabs: { home: 'Home', checklist: 'Checklist', quiz: 'Quiz', learn: 'Learn More' },
    actions: { back: 'Back', backToHome: 'Back to Home' },

    home: {
      title: 'Welcome to PhishShield 🔒',
      subtitle: 'Pick a category and test yourself.',
      startQuiz: 'Start quiz',
      checklist: 'Checklist',
      tip: 'Tips: 1) Check sender 2) Check links 3) Use 2FA.',
      best: 'Best in “{label}”: {score}/{total} ({pct}%)',
      categories: {
        blandet: 'Mixed',
        avsender: 'Sender',
        lenker: 'Links',
        okonomi: 'Finance',
        kjarlighet: 'Romance',
        passord2fa: 'Passwords/2FA',
      },
    },

    checklist: {
      title: 'Before you click… ✅',
      items: [
        'Check the sender: domain, email and phone',
        'Hover/preview the link: is the top-level domain legit?',
        'Don’t be rushed: deadlines and threats = red flag',
        'Never enter passwords via a received link',
        'Use 2FA and bookmarks for logins',
        'Look for typos, poor language and generic greetings',
        'Don’t open suspicious attachments (.zip/.exe/.html)',
        'Verify via official channels (call, app, bank)',
        'Report suspicious emails to IT or provider',
        'Change password and review device logs if in doubt',
      ],
      tip: 'Tip: Use a password manager and unique passwords – then one leak won’t compromise everything.',
    },

    quiz: {
      progress: 'Question {i} of {total}',
      choicePhish: 'This is PHISH',
      choiceSafe: 'This looks SAFE',
      feedbackPhish: 'Phish detected 🧪',
      feedbackSafe: 'Looks safe ✅',
      next: 'Next',
      seeResult: 'View results',
      resultTitle: 'Done! 🎉',
      replay: 'Play again',
      share: 'Share result',
      backHome: 'Back Home',
      explainer: 'Tip: Check sender, check links, use 2FA.',
      bestNone: 'No best score yet',
      bestText: 'Best: {score}/{total} ({pct}%)',
      shareMsg:
        'Category: {category}\nResult: {score}/{total} ({pct}%) in PhishShield 🛡️\nTest yourself – learn to spot phishing!',
    },

    /** ---------- LEARN MORE ---------- */
    learn: {
      title: 'Learn more 🔎',

      featuresTitle: 'Signs of phishing',
      features: [
        'Unusual sender or domain',
        'Urgency, threats, or “too good to be true”',
        'Links imitating well-known services',
        'Files asking for macros or login',
      ],

      verifyTitle: 'How to verify',
      verify: [
        'Go to the service yourself via bookmark or app',
        'Compare the domain carefully (vipps.no vs vipps-no-login.com)',
        'Call an official number, not the one in the message',
      ],

      habitsTitle: 'Secure habits',
      habits: [
        'Unique passwords + password manager',
        'Enable 2FA everywhere',
        'Keep devices and apps updated',
        'Report suspicious activity early',
      ],

      sourcesTitle: 'Useful sources',
      sources: {
        nettvett: 'nettvett.no',
        politiet: 'The police – fraud (politiet.no)',
        nsm: 'NSM – Recommendations (nsm.no)',
      },

      aboutTitle: 'About the developer',
      aboutText:
        'This app is built by Louise Fosdahl with a strong interest in cybersecurity. I want to make digital security easier and more accessible for everyone.',

      contactTitle: 'Contact',
      emailLabel: '📧 fosdahllouise@gmail.com',

      privacyTitle: 'Privacy & security',
      privacy: {
        noAccountTitle: 'No account. No database.',
        noAccountText:
          'The app stores nothing in the cloud and requires no login. We run no servers and collect no personal data.',

        localTitle: 'Local storage only for features',
        localText:
          'The app uses AsyncStorage on your device for simple things like best quiz score. This data never leaves your device.',

        noNetworkTitle: 'No network calls',
        noNetworkText:
          'The app makes no background API calls. External links open only when you tap them.',

        noTrackingTitle: 'No tracking',
        noTrackingText:
          'No analytics and no third-party SDKs for tracking or ads.',

        permissionsTitle: 'Permissions',
        permissionsText:
          'The app does not request camera, microphone, contacts, or location.',

        howSafeTitle: 'How safe is the app?',
        howSafeText:
          'Since no data is sent to or stored by us, privacy is very strong. There is always some risk (e.g. malicious links you open in the browser).',

        improveTitle: 'How to increase your security',
        improve: [
          'Keep your device updated',
          'Use screen lock and auto-updates for apps',
          'Be careful with all links – also those opened from the resources page',
        ],
      },
    },
  },
};

/** ---------- Kontekst + interpolering + persistering ---------- */
const I18nContext = createContext();

export const I18nProvider = ({ children, defaultLang = 'no' }) => {
  const [lang, setLang] = useState(defaultLang);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('phishshield_lang');
      if (saved) setLang(saved);
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('phishshield_lang', lang).catch(() => {});
  }, [lang]);

  const t = (key, params) => {
    const parts = key.split('.');
    let value = parts.reduce((acc, k) => acc?.[k], translations[lang]);

    if (typeof value === 'string' && params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replaceAll(`{${k}}`, String(v));
      });
    }
    return value ?? key;
  };

  return (
    <I18nContext.Provider value={{ t, lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
