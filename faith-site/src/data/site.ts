export const SITE = {
  name: 'In Jesus Name',
  shortName: 'IJN',
  tagline: 'The entrance of His Word gives light.',
  mission:
    'Scripture-anchored teachings unveiling who you are in Christ, what His finished work secured, and how to live from that reality every day of the week.',
  description:
    'In Jesus Name is a Christian teaching publication devoted to Scripture-saturated revelation, new-creation identity, sound doctrine, and practical everyday discipleship.',
  url: 'https://injesusname.org',
  locale: 'en_US',
  language: 'en',
  email: 'editorial@injesusname.org',
  foundedYear: 2026,
  adsense: {
    publisherId: 'ca-pub-9124992249317290',
    sellerId: 'f08c47fec0942fa0',
    /**
     * Per TODO E2 & faith-site/adsense.html:
     * Flip PUBLIC_ADSENSE_LIVE="true" once 50+ teachings are live and AdSense is connected.
     * Append ?ads=preview to any article URL to inspect the 3 zero-CLS reserved slots.
     */
    live: import.meta.env.PUBLIC_ADSENSE_LIVE === 'true',
    slots: {
      afterTheme: '1000000001',
      midArticle: '1000000002',
      beforeRelated: '1000000003',
    },
  },
  /**
   * Strictly 5 items per DESIGN_SPEC.md §9.5:
   * Home · Teachings · About · Doctrinal Basis · Contact
   */
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Teachings', href: '/teachings/' },
    { label: 'About', href: '/about/' },
    { label: 'Doctrinal Basis', href: '/doctrinal-basis/' },
    { label: 'Contact', href: '/contact/' },
  ],
  footerLinks: {
    study: [
      { label: 'All Teachings', href: '/teachings/' },
      { label: '365-Day Curriculum Slate', href: '/slate/' },
      { label: 'Site Glossary (36 Terms)', href: '/glossary/' },
      { label: 'RSS Feed', href: '/rss.xml' },
    ],
    trust: [
      { label: 'About This Publication', href: '/about/' },
      { label: 'Doctrinal Basis', href: '/doctrinal-basis/' },
      { label: 'Contact the Desk', href: '/contact/' },
      { label: 'Privacy Policy', href: '/privacy/' },
    ],
  },
  teacher: {
    name: 'Elias Okafor',
    role: 'Editor-in-Chief & Resident Bible Teacher',
    initials: 'EO',
    shortBio:
      'Elias Okafor serves as Editor-in-Chief and resident Bible teacher at In Jesus Name, writing Scripture-anchored studies that bridge careful New Testament exegesis with Monday-morning Christian living. Every teaching is built on an eight-step Scripture chain — moving from text to principle, identity, and responsible action. His conviction is simple: when believers understand what Christ has finished, holiness and peace stop feeling forced.',
  },
} as const;
