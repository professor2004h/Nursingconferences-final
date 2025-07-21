// Static fallback data for registration types
export const STATIC_REGISTRATION_TYPES = [
  {
    _id: 'speaker-inperson-1',
    name: 'Speaker/Poster (In-Person)',
    category: 'speaker-inperson',
    description: 'Present your research in person at the conference',
    earlyBirdPrice: 299,
    nextRoundPrice: 374,
    onSpotPrice: 449,
    currentPrice: 374, // Current period price
    benefits: ['Conference access', 'Presentation slot', 'Networking events'],
    isActive: true,
    displayOrder: 1
  },
  {
    _id: 'speaker-virtual-1',
    name: 'Speaker/Poster (Virtual)',
    category: 'speaker-virtual',
    description: 'Present your research virtually',
    earlyBirdPrice: 199,
    nextRoundPrice: 249,
    onSpotPrice: 299,
    currentPrice: 249,
    benefits: ['Virtual conference access', 'Virtual presentation slot'],
    isActive: true,
    displayOrder: 2
  },
  {
    _id: 'listener-inperson-1',
    name: 'Listener (In-Person)',
    category: 'listener-inperson',
    description: 'Attend the conference in person',
    earlyBirdPrice: 399,
    nextRoundPrice: 499,
    onSpotPrice: 599,
    currentPrice: 499,
    benefits: ['Conference access', 'All sessions', 'Networking events'],
    isActive: true,
    displayOrder: 3
  },
  {
    _id: 'listener-virtual-1',
    name: 'Listener (Virtual)',
    category: 'listener-virtual',
    description: 'Attend the conference virtually',
    earlyBirdPrice: 299,
    nextRoundPrice: 374,
    onSpotPrice: 449,
    currentPrice: 374,
    benefits: ['Virtual conference access', 'All virtual sessions'],
    isActive: true,
    displayOrder: 4
  },
  {
    _id: 'student-inperson-1',
    name: 'Student (In-Person)',
    category: 'student-inperson',
    description: 'Student rate for in-person attendance',
    earlyBirdPrice: 199,
    nextRoundPrice: 249,
    onSpotPrice: 299,
    currentPrice: 249,
    benefits: ['Conference access', 'Student networking'],
    isActive: true,
    displayOrder: 5
  },
  {
    _id: 'student-virtual-1',
    name: 'Student (Virtual)',
    category: 'student-virtual',
    description: 'Student rate for virtual attendance',
    earlyBirdPrice: 149,
    nextRoundPrice: 186,
    onSpotPrice: 224,
    currentPrice: 186,
    benefits: ['Virtual conference access'],
    isActive: true,
    displayOrder: 6
  },
  {
    _id: 'eposter-virtual-1',
    name: 'E-poster (Virtual)',
    category: 'eposter-virtual',
    description: 'Present an electronic poster',
    earlyBirdPrice: 99,
    nextRoundPrice: 124,
    onSpotPrice: 149,
    currentPrice: 124,
    benefits: ['E-poster presentation', 'Virtual access'],
    isActive: true,
    displayOrder: 7
  },
  {
    _id: 'exhibitor-1',
    name: 'Exhibitor',
    category: 'exhibitor',
    description: 'Exhibit your products/services',
    earlyBirdPrice: 599,
    nextRoundPrice: 749,
    onSpotPrice: 899,
    currentPrice: 749,
    benefits: ['Exhibition space', 'Conference access', 'Networking'],
    isActive: true,
    displayOrder: 8
  }
];

export const STATIC_PRICING_PERIODS = [
  {
    _id: 'early-bird-1',
    periodId: 'earlyBird',
    title: 'Early Bird Registration',
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-04-26T23:59:59Z',
    isActive: true,
    displayOrder: 1
  },
  {
    _id: 'next-round-1',
    periodId: 'nextRound',
    title: 'Mid Term Registration',
    startDate: '2025-04-27T00:00:00Z',
    endDate: '2025-07-22T23:59:59Z',
    isActive: true,
    displayOrder: 2
  },
  {
    _id: 'spot-1',
    periodId: 'spotRegistration',
    title: 'Onspot Registration',
    startDate: '2025-07-23T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    isActive: true,
    displayOrder: 3
  }
];

export const STATIC_ACTIVE_PERIOD = STATIC_PRICING_PERIODS[1]; // Currently Mid Term
