export const SITE = {
  name: 'Live In Jesus Name',
  shortName: 'LIJN',
  tagline: 'The entrance of His Word gives light.',
  mission:
    'Scripture-anchored teachings unveiling who you are in Christ, what His finished work secured, and how to live from that reality every day of the week.',
  description:
    'Live In Jesus Name is a Christian teaching publication devoted to Scripture-saturated revelation, new-creation identity, sound doctrine, and practical everyday discipleship.',
  /**
   * Canonical origin fallback. Production sets PUBLIC_SITE_URL=https://lij.name.ng
   * in Vercel, so every canonical/sitemap/JSON-LD URL resolves to the live host
   * even when a preview deploy runs on a *.vercel.app URL. Keep this fallback in
   * step with whatever domain the project is actually served from.
   */
  url: 'https://lij.name.ng',
  locale: 'en_US',
  language: 'en',
  /**
   * Markets this publication is written for. Emitted as regional hreflang
   * alternates on one English URL — the correct signal when the content is not
   * translated but is *targeted*: it tells a Nigerian, Ghanaian, or Kenyan
   * search engine that this page is meant for its readers, without inventing
   * duplicate URLs for pages that would be identical.
   *
   * `en` and `x-default` are always emitted alongside these; keep that pair.
   */
  targetRegions: ['NG', 'GH', 'KE', 'ZA', 'GB', 'US', 'CA', 'AU'],
  /** Open Graph alternates, matching the regions above. */
  ogAlternateLocales: ['en_NG', 'en_GB'],
  /**
   * No public mailbox. Reader correspondence runs through the Contact page's
   * WhatsApp hand-off and the community channels below; AdSense's publisher
   * requirements are met by a reachable contact route, not by an inbox.
   */
  whatsapp: {
    /** Display form for the desk line, used in copy and the contact card. */
    display: '+234 708 913 8631',
    /** E.164 digits only, for wa.me links and tel: fallbacks. */
    e164: '2347089138631',
    tel: '+2347089138631',
  },
  /**
   * The Listening Room. Speech is produced by the reader's own browser
   * (Web Speech API) — no audio files, no third-party TTS keys, no quota, and
   * nothing leaves the device. Language translation uses the browser's built-in
   * Translator API where it exists and is otherwise *offered*, never faked.
   */
  listen: {
    /** Voice presets. `match` strings are tested against the platform voice list. */
    voices: [
      {
        id: 'dawn',
        label: 'Dawn',
        description: 'Warm, unhurried, closest to a pastoral reading.',
        prefer: ['female', 'Samantha', 'Google UK English Female', 'Serena', 'Karen'],
        rate: 0.94,
        pitch: 1.0,
      },
      {
        id: 'clarity',
        label: 'Clarity',
        description: 'Neutral and even — the default for study and note-taking.',
        prefer: ['Google US English', 'Microsoft Aria', 'Daniel', 'Alex'],
        rate: 1.0,
        pitch: 1.0,
      },
      {
        id: 'elder',
        label: 'Elder',
        description: 'Lower, slower, like a father reading the text aloud.',
        prefer: ['male', 'Daniel', 'Google UK English Male', 'Microsoft Guy', 'Fred'],
        rate: 0.88,
        pitch: 0.86,
      },
      {
        id: 'bright',
        label: 'Bright',
        description: 'Quick and clear — good for a second pass or a commute.',
        prefer: ['Google US English', 'Zira', 'Moira'],
        rate: 1.08,
        pitch: 1.04,
      },
    ],
    /** Rates the reader can choose from, independent of the preset's own rate. */
    rates: [0.8, 0.9, 1.0, 1.1, 1.2, 1.35],
  },
  /**
   * What this publication is *about*, as a controlled vocabulary. Used for
   * schema.org knowsAbout, the subject graph node, and llms.txt — one list so a
   * machine and a reader are told the same thing.
   */
  topics: [
    'Christian theology',
    'New creation identity in Christ',
    'Righteousness by faith',
    'Grace and justification',
    'The person and work of the Holy Spirit',
    'Biblical authority and interpretation',
    'Divine healing',
    'Prayer and fasting',
    'Spiritual warfare',
    'Biblical stewardship and prosperity',
    'Christian living and discipleship',
    'Redemption and the return of Christ',
    'Faith and confession',
    'Authority of the believer',
  ],
  foundedYear: 2026,
  adsense: {
    publisherId: 'ca-pub-9124992249317290',
    sellerId: 'f08c47fec0942fa0',
    /**
     * Placement mode is **Auto ads**: the loader script is on every page and
     * Google chooses where units appear. That is why no manual <ins> blocks are
     * rendered in the article template — hand-placed slots alongside Auto ads
     * compete with the same inventory and can stack two units on one screen.
     *
     * `<AdSlot />` and the slot IDs below are retained but intentionally unused,
     * so a single anchored placement can be switched on later without rebuilding
     * it. Set `manualSlots: true` and render <AdSlot /> to do that.
     */
    autoAds: true,
    manualSlots: false,
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
  /**
   * Community channels. Kept in one place so the Community page, the site-wide
   * invite band, the Contact page, and the Organization JSON-LD `sameAs` array
   * all point at the same URLs.
   */
  community: {
    /** WhatsApp Channels are one-way broadcasts: no member list is exposed. */
    channel: {
      label: 'WhatsApp Channel',
      name: 'Live In Jesus Name — Channel',
      href: 'https://whatsapp.com/channel/0029Vb9dtURBvvsopt3b2D2v',
      summary: 'One-way broadcast of each day\u2019s teaching. Joining does not reveal your number.',
    },
    /** Group chat: members can post, reply, and see who else is in the room. */
    group: {
      label: 'WhatsApp Group',
      name: 'Live In Jesus Name — Readers\u2019 Group',
      href: 'https://chat.whatsapp.com/L9ddgfpreCb9P9XqrV1haa',
      summary: 'The discussion room: questions, testimonies, and prayer requests between readers.',
    },
  },
  footerLinks: {
    study: [
      { label: 'The Listening Room', href: '/listen/' },
      { label: 'All Teachings', href: '/teachings/' },
      { label: '365-Day Curriculum Slate', href: '/slate/' },
      { label: 'Site Glossary (36 Terms)', href: '/glossary/' },
      { label: 'RSS Feed', href: '/rss.xml' },
    ],
    trust: [
      { label: 'About This Publication', href: '/about/' },
      { label: 'Doctrinal Basis', href: '/doctrinal-basis/' },
      { label: 'Contact the Desk', href: '/contact/' },
      { label: 'Accessibility', href: '/accessibility/' },
      { label: 'Privacy Policy', href: '/privacy/' },
    ],
    /** Reader community. Rendered as a third footer column with live joins. */
    community: [
      { label: 'Community & Study Rooms', href: '/community/' },
      { label: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/0029Vb9dtURBvvsopt3b2D2v' },
      { label: "WhatsApp Readers' Group", href: 'https://chat.whatsapp.com/L9ddgfpreCb9P9XqrV1haa' },
    ],
  },
  teacher: {
    name: 'Ellis Graham',
    role: 'Editor-in-Chief & Resident Bible Teacher',
    initials: 'EG',
    /** Portrait used in the author box, the About page schema, and og:image:alt. */
    image: '/images/author-ellis-graham-800.jpg',
    imageWidth: 800,
    imageHeight: 1067,
    imageAlt:
      'Ellis Graham, Editor-in-Chief and resident Bible teacher of Live In Jesus Name, seated at a desk with an open Bible.',
    shortBio:
      'Ellis Graham serves as Editor-in-Chief and resident Bible teacher at Live In Jesus Name, writing Scripture-anchored studies that bridge careful New Testament exegesis with Monday-morning Christian living. Every teaching is built on an eight-step Scripture chain — moving from text to principle, identity, and responsible action. The conviction behind each study is simple: when believers understand what Christ has finished, holiness and peace stop feeling forced.',
  },
} as const;
