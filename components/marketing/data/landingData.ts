import { NavItem, AffordabilityPreset, CoachingScenario, FaqItem, UserGoalProof, TickerItem } from '../types';

export const tickerItems: TickerItem[] = [
  { id: '1', text: '🏆 Built at Weekend of Startups in partnership with Swyftx, UQIES & UQ Ventures' },
  { id: '2', text: '⚡️ Real-time proactive spending coach — zero spreadsheets needed' },
  { id: '3', text: '💡 Aligned shared savings model: Low fixed fee + percentage of what you save' },
  { id: '4', text: '🔒 Read-only 256-bit bank-grade encryption' },
  { id: '5', text: '🚀 Private beta batch #4 invites sending this Friday' },
];

export const navLinks: NavItem[] = [
  { label: 'Can I Afford It?', href: '#afford-section' },
  { label: 'Weekend of Startups', href: '#partners-section' },
  { label: 'The Coach', href: '#coach-section' },
  { label: 'Pricing Model', href: '#afford-section' },
  { label: 'FAQ', href: '#faq-section' },
];

export const userProofs: UserGoalProof[] = [
  { id: '1', name: 'Sarah M.', goal: 'Euro Summer', progress: 65, avatarColor: 'lime', initial: 'S' },
  { id: '2', name: 'James K.', goal: 'House Deposit', progress: 42, avatarColor: 'white', initial: 'J' },
  { id: '3', name: 'Liam T.', goal: 'Emergency Fund', progress: 88, avatarColor: 'lime', initial: 'L' },
  { id: '4', name: 'Chloe B.', goal: 'New Car', progress: 54, avatarColor: 'white', initial: 'C' },
  { id: '5', name: 'Marcus W.', goal: 'Japan Trip', progress: 78, avatarColor: 'lime', initial: 'M' },
  { id: '6', name: 'Elena R.', goal: 'Wedding Fund', progress: 91, avatarColor: 'white', initial: 'E' },
];

export const affordabilityPresets: AffordabilityPreset[] = [
  { item: 'New sneakers', amount: 120 },
  { item: 'Weekend trip to Byron', amount: 450 },
  { item: 'Dinner with friends', amount: 75 },
  { item: 'Concert ticket', amount: 180 },
  { item: 'Designer jacket', amount: 320 },
];

export const coachingScenarios: CoachingScenario[] = [
  {
    id: 'concert',
    title: 'Concert Ticket ($180)',
    shortDesc: 'Instant timeline adjustment',
    messages: [
      {
        id: 'c1',
        sender: 'coach',
        text: 'Hey! That $180 concert ticket put you behind on your Euro Summer goal for this week.',
        time: '7:42 PM',
      },
      {
        id: 'u1',
        sender: 'user',
        text: "Can you adjust my timeline? I don't want to skip it.",
        time: '7:43 PM',
      },
      {
        id: 'c2',
        sender: 'coach',
        text: 'Done — new target is $360/week. Try skipping dining out this weekend to catch up quickly! 🎯',
        time: '7:43 PM',
        highlight: true,
      },
    ],
  },
  {
    id: 'dining',
    title: 'UberEats & Dining Out',
    shortDesc: 'Micro-swap coaching',
    messages: [
      {
        id: 'c1_2',
        sender: 'coach',
        text: "You've ordered takeout 3 times this week ($84). Your Bali Trip fund could use that boost.",
        time: '12:15 PM',
      },
      {
        id: 'u1_2',
        sender: 'user',
        text: 'What if I cook dinner tonight and tomorrow instead?',
        time: '12:16 PM',
      },
      {
        id: 'c2_2',
        sender: 'coach',
        text: "You'll bank +$45 straight to Bali and stay at 88% on-track! Sending high five 🙌",
        time: '12:16 PM',
        highlight: true,
      },
    ],
  },
  {
    id: 'payday',
    title: 'Payday Automation',
    shortDesc: 'Automated allocation',
    messages: [
      {
        id: 'c1_3',
        sender: 'coach',
        text: 'Salary landed! 💰 $2,850 detected. Ready to route your automated savings split?',
        time: '9:00 AM',
      },
      {
        id: 'u1_3',
        sender: 'user',
        text: 'Yes please, stick to the 50/30/20 rule for Euro Summer.',
        time: '9:01 AM',
      },
      {
        id: 'c2_3',
        sender: 'coach',
        text: 'Done! $570 allocated to Euro Summer ($3,810 total). You are now 2 weeks ahead of schedule 🚀',
        time: '9:01 AM',
        highlight: true,
      },
    ],
  },
];

export const faqItems: FaqItem[] = [
  {
    id: '1',
    question: 'How does Knodle charge and what is the pricing model?',
    answer:
      'We operate on a transparent, performance-aligned model (similar to Morfless): a low fixed platform fee ($4/mo) plus a modest percentage (5%) of your verified net savings. If Knodle doesn’t save you money on your goals and expenses, you pay zero success fee. We only win when your bank balance grows.',
  },
  {
    id: '2',
    question: 'What is Weekend of Startups?',
    answer:
      'Knodle was conceived, engineered, and validated during the Weekend of Startups in official partnership with Swyftx (Australia’s premier crypto exchange), UQIES (The University of Queensland Innovation & Entrepreneurship Society), and UQ Ventures.',
  },
  {
    id: '3',
    question: 'Is my bank data secure?',
    answer:
      'Yes. We use read-only Open Banking APIs with 256-bit bank-grade encryption. We can never move your money or access your login credentials.',
  },
  {
    id: '4',
    question: 'Can Knodle move my money?',
    answer:
      'No. We never have access to initiate transfers or withdraw funds. Knodle acts as an intelligent decision companion that sends proactive coaching nudges before you overspend.',
  },
  {
    id: '5',
    question: 'Is this financial advice?',
    answer:
      'Knodle provides behavioral coaching based on your stated goals and spending patterns, not formal financial planning or investment advice.',
  },
  {
    id: '6',
    question: 'When do you launch and how do I get access?',
    answer:
      'The live demo is available now. Enter your email on this page to unlock it — we use that to grant access, not to spam you.',
  },
];
