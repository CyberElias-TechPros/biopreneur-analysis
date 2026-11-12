export interface CategoryInfo {
  name: string;
  slug: string;
  numeral: string;
  shortLine: string;
  metaDescription: string;
  description: string;
  anchors: string;
  slateMonths: number[];
  featuredOnHome?: boolean;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    name: 'New Creation & Identity',
    slug: 'new-creation-and-identity',
    numeral: '01',
    shortLine: 'What actually happened in your human spirit when you believed the gospel.',
    metaDescription:
      "What happened in your spirit when you believed? Scripture-anchored teachings on the new creation, identity in Christ, and life born of incorruptible seed.",
    description:
      'The Christian life does not begin with self-renovation; it begins with regeneration. These teachings unpack 2 Corinthians 5:17, John 3, and the Pauline epistles to show who the believer now is in Christ — a brand-new creation born of incorruptible seed. Understanding identity precedes every lasting change in conduct.',
    anchors: '2 Corinthians 5:17 · John 3:3–8 · 1 Peter 1:23 · Ephesians 1–2',
    slateMonths: [1],
    featuredOnHome: true,
  },
  {
    name: 'Righteousness & Grace',
    slug: 'righteousness-and-grace',
    numeral: '02',
    shortLine: 'Right standing with God as a blood-bought gift that trains you to live uprightly.',
    metaDescription:
      "Right standing with God as a blood-bought gift. Teachings on justification, the great exchange, and the consciousness of righteousness that produces holiness.",
    description:
      'Grace neither excuses sin nor leaves the believer guessing where they stand with the Father. Here we study justification, the great exchange of Calvary, and the consciousness of righteousness that silences condemnation while awakening genuine holiness. Right living flows steadily from right standing.',
    anchors: '2 Corinthians 5:21 · Romans 3:21–26 · Romans 5:17 · Hebrews 10:19–22',
    slateMonths: [9],
    featuredOnHome: true,
  },
  {
    name: 'The Holy Spirit',
    slug: 'the-holy-spirit',
    numeral: '03',
    shortLine: 'Knowing the Comforter as an indwelling Divine Person — never an impersonal force.',
    metaDescription:
      "Know the Comforter as an indwelling Divine Person, never an impersonal force. Teachings on the Spirit's indwelling, guidance, fruit, and gifts today.",
    description:
      'Jesus did not leave His church orphaned; He sent the Spirit of truth to abide in believers forever. These studies explore the personhood, indwelling fellowship, teaching ministry, spiritual fruit, and empowering presence of the Holy Spirit in everyday discipleship.',
    anchors: 'John 14:16–26 · Romans 8:1–16 · 2 Corinthians 3:17 · Galatians 5:16–25',
    slateMonths: [2],
    featuredOnHome: true,
  },
  {
    name: 'The Word',
    slug: 'the-word',
    numeral: '04',
    shortLine: 'Approaching Scripture as the living voice of the God who cannot lie.',
    metaDescription:
      "Approach Scripture as the living voice of the God who cannot lie. Teachings on the authority, sufficiency, and renewing power of the written Word.",
    description:
      'God and His Word are inseparable in trustworthiness and creative authority. This category teaches how to read Scripture in context, meditate until truth renews the mind, and align daily speech and decisions with what God has spoken in Christ.',
    anchors: 'Titus 1:2 · Hebrews 4:12 · 2 Timothy 3:16–17 · Joshua 1:8 · James 1:22–25',
    slateMonths: [5],
    featuredOnHome: true,
  },
  {
    name: 'Faith',
    slug: 'faith',
    numeral: '05',
    shortLine: 'Active, restful trust in God’s character and promises across every season.',
    metaDescription:
      "Active, restful trust in God's character and promises in every season. Teachings on faith present tense, speaking faith, and faith that grows by use.",
    description:
      'Biblical faith is neither wishful optimism nor human strain; it is confident reliance on the trustworthy character of God revealed in His Word. These teachings examine how faith grows, speaks, endures testing, works through love, and partners with practical wisdom.',
    anchors: 'Hebrews 11:1, 6 · Romans 10:17 · Romans 4:17–21 · 2 Corinthians 5:7',
    slateMonths: [3],
  },
  {
    name: 'Authority of the Believer',
    slug: 'authority-of-the-believer',
    numeral: '06',
    shortLine: 'Seated with Christ and entrusted with ministry in the Matchless Name of Jesus.',
    metaDescription:
      "Seated with Christ and entrusted with ministry in the Matchless Name. Teachings on the believer's authority, spiritual warfare, and the Name of Jesus.",
    description:
      'Risen from the dead, Jesus Christ holds all authority in heaven and on earth and sends His church in His Name. Here we study our union with the enthroned Christ, what delegated spiritual authority means, and why spiritual authority serves people rather than dominating them.',
    anchors: 'Ephesians 1:19–23 · Ephesians 2:6 · Philippians 2:9–11 · Luke 10:19',
    slateMonths: [4],
  },
  {
    name: 'Prayer & Fasting',
    slug: 'prayer-and-fasting',
    numeral: '07',
    shortLine: 'Two-way communion with a welcoming Father in the Name of Jesus.',
    metaDescription:
      "Two-way communion with a welcoming Father in the Name of Jesus. Teachings on prayer that gets answers, fasting, intercession, and the life of communion.",
    description:
      'Prayer is not twisting the arm of a reluctant deity; it is fellowship with our Father on the ground of His Word and Spirit. These teachings cover adoration, petition, intercession, praying in the Spirit, biblical fasting, and listening sensitivity.',
    anchors: 'John 16:23–24 · Hebrews 4:16 · 1 John 5:14–15 · Matthew 6:5–18',
    slateMonths: [6],
  },
  {
    name: 'Divine Health',
    slug: 'divine-health',
    numeral: '08',
    shortLine: 'Christ’s compassion for the whole person — pairing faith in God with sound stewardship.',
    metaDescription:
      "Christ's compassion for the whole person, pairing faith in God with sound stewardship. Teachings on healing, divine health, and care for the body He redeemed.",
    description:
      'Scripture reveals the Lord as compassionate Redeemer of spirit, soul, and body, now in foretaste and wholly at the resurrection. We teach biblical hope and prayer for wholeness alongside gratitude for skilled medical care, healthy rest, and peace of heart — never shaming anyone walking through illness.',
    anchors: 'Isaiah 53:4–5 · Matthew 8:16–17 · Proverbs 4:20–22 · Romans 8:11, 23',
    slateMonths: [7],
  },
  {
    name: 'Prosperity & Stewardship',
    slug: 'prosperity-and-stewardship',
    numeral: '09',
    shortLine: 'Diligent work, contented hearts, debt-wise order, and cheerful Kingdom generosity.',
    metaDescription:
      "Diligent work, contented hearts, debt-wise order, and cheerful Kingdom generosity. Teachings on biblical prosperity and faithful stewardship.",
    description:
      'God delights to supply His servants so they may abound unto every good work without covetousness. These studies reject transactional get-rich schemes while teaching biblical diligence, honest craft, household provision, contentment, and joyful generosity.',
    anchors: '2 Corinthians 9:6–11 · Philippians 4:11–19 · Ephesians 4:28 · 1 Timothy 6:6–19',
    slateMonths: [8],
  },
  {
    name: 'Spiritual Warfare',
    slug: 'spiritual-warfare',
    numeral: '10',
    shortLine: 'Standing firm in the armor of light from a victory Christ has already won.',
    metaDescription:
      "Stand firm in the armor of light from a victory Christ has already won. Teachings on the believer's authority, resisting the enemy, and standing in victory.",
    description:
      'The cross disarmed spiritual principalities openly, yet believers are called to stand alert in the armor of God. We teach truth-centred discernment that tears down deceptive arguments while refusing fear-mongering or hostility toward flesh-and-blood neighbours.',
    anchors: 'Ephesians 6:10–18 · Colossians 2:15 · 2 Corinthians 10:3–5 · James 4:7',
    slateMonths: [10],
  },
  {
    name: 'Christian Living',
    slug: 'christian-living',
    numeral: '11',
    shortLine: 'Putting on the new man in speech, marriage, work, integrity, and everyday glory.',
    metaDescription:
      "Put on the new man in speech, marriage, work, integrity, and everyday glory. Teachings on practical holiness and a life that adorns the gospel.",
    description:
      'Sound doctrine proves its beauty on Tuesday afternoon in how we speak, work, forgive, and keep commitments. These teachings translate high New Testament theology into renewed habits of mind, peaceable relationships, and Spirit-empowered excellence.',
    anchors: 'Ephesians 4:22–32 · Colossians 3:12–24 · Romans 12:1–21 · Titus 2:11–14',
    slateMonths: [11],
  },
  {
    name: 'Redemption & His Return',
    slug: 'redemption-and-his-return',
    numeral: '12',
    shortLine: 'The Word made flesh, the finished cross, and the purifying hope of Christ’s appearing.',
    metaDescription:
      "The Word made flesh, the finished cross, and the purifying hope of Christ's appearing. Teachings on redemption, the Incarnation, and the Blessed Hope.",
    description:
      'From the incarnation at Bethlehem to the empty tomb and the promised return of the King, Jesus Christ is the centre of history. These studies anchor believers in the blood of the eternal covenant and the joyful, holy expectation of His appearing.',
    anchors: 'John 1:14 · Hebrews 9:11–15 · Titus 2:11–14 · 1 Thessalonians 4:13–18 · Revelation 21:1–5',
    slateMonths: [12],
  },
];

export function getCategoryByName(name: string): CategoryInfo {
  return (
    CATEGORIES.find((c) => c.name.toLowerCase() === name.toLowerCase()) ||
    CATEGORIES[0]
  );
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
