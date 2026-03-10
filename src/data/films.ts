/**
 * Shared film data for all 100 CINEGEN films.
 * Used by the homepage (netflix-home), film detail fallback, and any page
 * that needs to reference the full catalog when the DB has no entries.
 */

/* ── Types ── */

export interface FilmData {
  id: string
  title: string
  slug: string
  genre: string
  synopsis: string
  director: string
  cast: string[]
  duration: string
  year: number
  rating: string
  tags: string[]
  coverImageUrl: string | null
  status: string
  progressPct: number
  fundingPct: number
}

/* ── Named posters (films with real images) ── */

export const NAMED_POSTERS: Record<string, string> = {
  'KETER: The Final Algorithm': '/posters/keter.jpg',
  'The Miracle Protocol': '/posters/miracle-protocol.jpg',
  'The Esther Code': '/posters/esther-code.jpg',
  'ORTISTS (The Gift)': '/posters/ortists.jpg',
  'The Rebbe': '/posters/the-rebbe.jpg',
  'Secret of the Menorah': '/posters/secret-menorah.jpg',
  'MEAM LOEZ': '/posters/meam-loez.jpg',
}

/* ── Unsplash poster images by genre (10 per genre) ── */
const GENRE_POSTERS: Record<string, string[]> = {
  Action: [
    'https://images.unsplash.com/photo-1763097257241-b1347f8d378a?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1563439633552-1d4b7be86090?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1701156341440-426868a22de6?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1669814665862-831f634930ac?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1602853445120-526f9be32e3f?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1762928582249-6e2c7ca242cd?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1762781007540-ab1e9e83521b?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1667354155667-d41928b81cbc?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1622582855803-d06dc2c230e1?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1550391383-bbd922a8d8cf?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Comedy: [
    'https://images.unsplash.com/photo-1576238956869-2098f3d26eb2?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1612186001725-36c96d7e46f8?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1772723246375-23561ec8e26a?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1723867352959-0176feb461f2?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1770364016572-4044d2a2ecf2?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1604674725989-52c312835516?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1770364018011-66ecb33775c6?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1723615215608-5768aac1d40a?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1771010141951-e429f82020e5?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1585168373682-c7e50adc2e55?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Drama: [
    'https://images.unsplash.com/photo-1734045443700-99e89079928a?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1759230766134-e3ff1c27d20e?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1721241712356-5185b200be25?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1661422036365-060d712b0a5c?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1706830027380-bef6760836e4?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1762979772530-81c3a60f5010?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1764405405911-67a3bdbf506d?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1661425539200-4eac41e45776?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1768381937064-0cff674a09ca?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1761819952025-73c0398c2ec9?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  'Sci-Fi': [
    'https://images.unsplash.com/photo-1763198216782-b534fea3dcf1?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1685910715615-577928e2450e?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1545092961-6d9b6f46dcc4?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1682124875075-0a1920891bc3?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1749215056698-bb4c38995fa9?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1749215366136-55315f1347e1?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1749215419683-23847ec40e9a?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1682124070171-1805d81cfceb?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1749215470015-f1cd51453d73?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1749214863193-27208c13bc2f?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Documentary: [
    'https://plus.unsplash.com/premium_photo-1770613229046-394644ca1896?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1675623968561-2ffc70d67f0f?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1693575554365-7995c40612d7?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1724695600571-aacf014d6990?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1677173222361-83e349308553?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1724668625411-ee68362d9820?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1661937337590-f3800a338a0d?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1769871746413-48606a199366?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1682579327556-68cff5d960de?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1632670536499-ebc8bc72892a?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Thriller: [
    'https://images.unsplash.com/photo-1563905463861-7d77975b3a44?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1762115445557-967c1504ffe9?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1764183297903-de6a89434953?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1714619000682-8b795c01a478?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1766878778057-2caacb066ce5?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1766878777911-ba6f42f3430f?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1766878777925-68fee89a290e?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1758752253303-6b9e64d1784b?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1761486404663-85f74df27fd9?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1772456595822-350ab3984479?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Animation: [
    'https://images.unsplash.com/photo-1767557125491-b3483567d843?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1707141955104-7e14e6710736?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1769734746961-162117e07a90?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1739278713373-bfe5987b997b?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1769734712683-8ec5aaec3b6a?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1561268634-bc32e4604a38?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1593953443285-bf7335acbca0?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1732306673962-cb1ae16e05de?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1593538573197-4e3ee8a864d0?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1657625947315-03727763fa19?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Historical: [
    'https://images.unsplash.com/photo-1662244461851-d939997f6dfb?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1642370193682-ecddb83d0675?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1772286447863-fb54d3b86e73?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1697730133584-8f219e7ca135?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1645769943065-2b3e91da3f2e?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1762092630818-0d5e41719498?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1761923792409-f0092545507f?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1661922412062-8302e47e148c?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1767032274400-832b1658a4ee?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1649224708637-34a5ea1af16e?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Romance: [
    'https://images.unsplash.com/photo-1609561026486-f5d4a3c4c660?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1649289659650-b154e82505db?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/flagged/photo-1595542767876-715090b35fad?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1723582814525-2ded27240818?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1722101968404-7b721d547587?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1650595808040-e58faadbc6e8?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1650595808090-982a7143dc12?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1661933778251-885d56d43eb4?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1599843441436-b654153797fa?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1599331426174-6fffc9c614fe?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Fantasy: [
    'https://images.unsplash.com/photo-1766156555244-572b9757433b?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1742269801558-8ec3bb2ca44e?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1765590266082-10c751bfcd8f?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1747943864778-79217a57d004?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1769475887538-23e8823ffbb9?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1765528307828-8c8be48c03ef?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1769475878989-c764d22010d2?auto=format&fit=crop&w=400&h=600&q=80',
    'https://plus.unsplash.com/premium_photo-1746601854854-6fdf10a71724?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1762171533593-c16630a1d956?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1756443110105-3badce171bcc?auto=format&fit=crop&w=400&h=600&q=80',
  ],
}

/* ── Genre order & statuses ── */

export const GENRE_ORDER = [
  'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Documentary',
  'Thriller', 'Animation', 'Historical', 'Romance', 'Fantasy',
] as const

const STATUSES = [
  'DRAFT', 'PRE_PRODUCTION', 'IN_PRODUCTION', 'POST_PRODUCTION',
  'IN_PRODUCTION', 'PRE_PRODUCTION', 'DRAFT', 'IN_PRODUCTION',
  'POST_PRODUCTION', 'PRE_PRODUCTION',
]

/* ── Slug helper ── */
function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
}

/* ── Full film catalog ── */

const FILM_ENTRIES: Record<string, Omit<FilmData, 'id' | 'slug' | 'genre' | 'coverImageUrl' | 'status' | 'progressPct' | 'fundingPct'>[]> = {
  Action: [
    { title: 'Shadow Protocol', synopsis: 'A disgraced CIA operative uncovers a shadow network within the agency. With 48 hours before a global blackout, she must decide who to trust in a world where everyone has a hidden agenda.', director: 'Marcus Vane', cast: ['Elena Marsh', 'Devon Blake', 'Kenji Sato'], duration: '2h 12min', year: 2025, rating: 'R', tags: ['espionage', 'conspiracy', 'female lead'] },
    { title: 'Iron Horizon', synopsis: 'When an experimental warship is hijacked in the Arctic, a retired Navy SEAL must lead a ragtag crew across frozen waters to prevent World War III.', director: 'James Cortez', cast: ['Marcus Stone', 'Yuri Petrov', 'Amara Cole'], duration: '2h 05min', year: 2025, rating: 'PG-13', tags: ['military', 'arctic', 'thriller'] },
    { title: 'Rogue Extraction', synopsis: 'A hostage rescue specialist goes rogue when she discovers the person she is hired to save is the one who killed her family. The extraction becomes a hunt.', director: 'Lena Park', cast: ['Sofia Reyes', 'Jack Harmon', 'Dina Khoury'], duration: '1h 54min', year: 2025, rating: 'R', tags: ['revenge', 'action', 'twists'] },
    { title: 'Night Strike', synopsis: 'An elite squad is deployed to a war-torn city for a covert night operation. When communications go dark, they realize they have been set up as bait.', director: 'Viktor Aslanov', cast: ['Tomás Ruiz', 'Aisha Nyong', 'Dimitri Volkov'], duration: '1h 48min', year: 2024, rating: 'R', tags: ['military', 'night ops', 'survival'] },
    { title: 'Zero Gravity', synopsis: 'A space station security officer must fight off mercenaries in zero-g after they hijack the station to steal classified propulsion technology.', director: 'Ava Chen', cast: ['Rajan Mehta', 'Claire Dubois', 'Tyrone Jackson'], duration: '2h 01min', year: 2025, rating: 'PG-13', tags: ['space', 'action', 'sci-fi'] },
    { title: 'Blaze Runner', synopsis: 'A stunt driver turned getaway specialist takes one last job that spirals into a citywide chase involving corrupt cops, rival gangs, and a stolen AI chip.', director: 'Rico Santana', cast: ['Danny Cruz', 'Mika Tanaka', 'Omar Faris'], duration: '1h 52min', year: 2025, rating: 'PG-13', tags: ['cars', 'chase', 'heist'] },
    { title: 'Steel Vanguard', synopsis: 'In a near-future battlefield, a platoon of mech-suited soldiers must hold a bridge against an overwhelming AI-controlled army for twelve hours.', director: 'Henrik Brandt', cast: ['Sgt. Nina Cross', 'Cpl. Elias Ruiz', 'Dr. Wen Liu'], duration: '2h 08min', year: 2026, rating: 'PG-13', tags: ['mechs', 'war', 'AI'] },
    { title: 'Desert Storm', synopsis: 'After a helicopter crash deep in enemy territory, two rival soldiers must cross 200 miles of desert together to survive, forging an uneasy alliance.', director: 'Khalid Mansur', cast: ['Amir Hassan', 'Jake Mitchell', 'Fatima Al-Rashid'], duration: '1h 58min', year: 2024, rating: 'R', tags: ['desert', 'survival', 'war'] },
    { title: 'Venom Code', synopsis: 'A bioweapons expert races against time to decode a synthetic virus released in a megacity, while the corporation that created it sends assassins to silence him.', director: 'Nadia Orlov', cast: ['Dr. Samir Patel', 'Agent Zoe Lin', 'Viktor Crane'], duration: '2h 03min', year: 2025, rating: 'R', tags: ['bioweapon', 'conspiracy', 'science'] },
    { title: 'Dark Pursuit', synopsis: 'A bounty hunter tracking a fugitive through the neon-lit underworld of Neo-Seoul discovers his target holds the key to exposing an international trafficking ring.', director: 'Jin-ho Kwon', cast: ['Takeshi Mori', 'Valentina Rossi', 'Kwon Ji-yeon'], duration: '2h 10min', year: 2025, rating: 'R', tags: ['noir', 'cyberpunk', 'bounty hunter'] },
  ],
  Comedy: [
    { title: 'The Wedding Crasher', synopsis: 'A professional wedding planner discovers her biggest client is marrying her ex. Instead of quitting, she plots the most elaborate — and subtly chaotic — wedding the city has ever seen.', director: 'Julie Blanc', cast: ['Maya Chen', 'Chris Hartley', 'Priya Sharma'], duration: '1h 45min', year: 2025, rating: 'PG-13', tags: ['wedding', 'rom-com', 'revenge'] },
    { title: 'Lost in Brooklyn', synopsis: 'A French influencer stranded in Brooklyn without her phone or wallet must navigate the borough using only her wits, discovering that real connection beats social media.', director: 'Tom DiMaggio', cast: ['Camille Dupont', 'Marcus Johnson', 'Abuela Rosa'], duration: '1h 38min', year: 2025, rating: 'PG', tags: ['fish-out-of-water', 'social media', 'heartwarming'] },
    { title: 'My Robot Roommate', synopsis: 'A struggling programmer accidentally brings home a prototype household robot that develops a sarcastic personality and starts giving unsolicited life advice.', director: 'Sam Patel', cast: ['Alex Kim', 'UNIT-7 (voice)', 'Dr. Lisa Park'], duration: '1h 42min', year: 2025, rating: 'PG', tags: ['AI', 'buddy comedy', 'tech'] },
    { title: 'Office Chaos', synopsis: 'When the CEO of a startup disappears with the company funds, the remaining employees must pretend everything is fine while secretly running the company themselves.', director: 'Emma Torres', cast: ['Dave Russo', 'Keiko Yamamoto', 'Franck Duval'], duration: '1h 40min', year: 2024, rating: 'PG-13', tags: ['workplace', 'ensemble', 'startup'] },
    { title: 'The Intern Diaries', synopsis: 'A 60-year-old retired teacher starts an internship at a Gen-Z-run marketing agency, causing culture clash comedy while secretly becoming the most effective team member.', director: 'Rosa Mendez', cast: ['Harold Greene', 'Zoe Tran', 'Jayden Wells'], duration: '1h 46min', year: 2025, rating: 'PG', tags: ['generational', 'workplace', 'feel-good'] },
    { title: 'Blind Date Blunders', synopsis: 'A dating app developer who has never been on a date goes on seven blind dates in seven days to test her own algorithm — with increasingly absurd results.', director: 'Nora Kessler', cast: ['Ruby Singh', 'Date #1-7 ensemble', 'Best Friend Mel'], duration: '1h 35min', year: 2025, rating: 'PG-13', tags: ['dating', 'tech', 'rom-com'] },
    { title: 'Family Reunion Fiasco', synopsis: 'Three estranged siblings must organize their parents\' 50th anniversary party in 72 hours, unearthing old rivalries, secret talents, and one very dramatic uncle.', director: 'Carlos Rivera', cast: ['The Martinez Family ensemble'], duration: '1h 50min', year: 2024, rating: 'PG', tags: ['family', 'ensemble', 'heartwarming'] },
    { title: 'Cooking Disaster', synopsis: 'A talentless home cook accidentally goes viral as a "gourmet chef" and must maintain the lie while competing on a live cooking show against actual professionals.', director: 'Marie Bonnet', cast: ['Pierre Lafleur', 'Chef Nakamura', 'Host Stella'], duration: '1h 38min', year: 2025, rating: 'PG', tags: ['food', 'viral fame', 'imposter'] },
    { title: 'The Bachelor Guide', synopsis: 'When a self-help author\'s "guide to staying single" becomes a bestseller, he panics — because he\'s secretly been in a loving relationship for three years.', director: 'Dan O\'Brien', cast: ['Ryan West', 'Anita Desai', 'Publisher Max'], duration: '1h 44min', year: 2025, rating: 'PG-13', tags: ['satire', 'romance', 'deception'] },
    { title: 'Neighbors from Space', synopsis: 'A suburban family discovers their new next-door neighbors are aliens trying to learn human customs. Both families keep each other\'s secrets in this warm sci-fi comedy.', director: 'Lisa Chang', cast: ['The Henderson Family', 'The Zyx-7 Family'], duration: '1h 48min', year: 2025, rating: 'PG', tags: ['aliens', 'family', 'suburban'] },
  ],
  Drama: [
    { title: 'Broken Silence', synopsis: 'A war journalist returns home after a decade to find her family fractured. As she tries to reconnect with her teenage daughter, buried truths about why she really left surface.', director: 'Ingrid Svensson', cast: ['Nadia Karim', 'Young Leila', 'Thomas Karim'], duration: '2h 14min', year: 2025, rating: 'R', tags: ['family', 'journalism', 'trauma'] },
    { title: 'The Last Promise', synopsis: 'An aging pianist with early-onset dementia prepares for one final concert, fighting to hold onto the music that defined his life while his daughter documents the journey.', director: 'Paolo Moretti', cast: ['Henri Dubois', 'Clara Dubois', 'Dr. Stein'], duration: '2h 02min', year: 2025, rating: 'PG-13', tags: ['music', 'dementia', 'father-daughter'] },
    { title: 'Echoes of Tomorrow', synopsis: 'A climate scientist discovers her research has been suppressed by her own university. She must choose between her career and exposing the truth about an impending ecological catastrophe.', director: 'Amara Osei', cast: ['Dr. Sarah Chen', 'Prof. Whitmore', 'Journalist Kai'], duration: '2h 08min', year: 2025, rating: 'PG-13', tags: ['climate', 'whistleblower', 'science'] },
    { title: 'Fading Light', synopsis: 'In a small coastal town, a lighthouse keeper nearing retirement befriends a young refugee. Their unlikely bond illuminates themes of loss, belonging, and second chances.', director: 'Yorgos Papadopoulos', cast: ['Old Matteo', 'Young Amira', 'Townspeople ensemble'], duration: '1h 56min', year: 2024, rating: 'PG', tags: ['immigration', 'mentorship', 'coastal'] },
    { title: 'The Weight of Words', synopsis: 'A ghost writer who has penned 30 bestsellers under other people\'s names finally decides to publish under her own — only to face the wrath of the celebrities she made famous.', director: 'Catherine Wells', cast: ['Diane Frost', 'Celebrity clients ensemble', 'Agent Leo'], duration: '2h 00min', year: 2025, rating: 'PG-13', tags: ['writing', 'identity', 'publishing'] },
    { title: 'Autumn Letters', synopsis: 'Found letters in an antique desk lead a young woman to trace a forbidden love story from 1940s France, paralleling her own struggle with an impossible relationship.', director: 'Juliette Moreau', cast: ['Sophie Laurent', '1940s Marguerite', '1940s Antoine'], duration: '2h 06min', year: 2025, rating: 'PG-13', tags: ['period', 'love letters', 'dual timeline'] },
    { title: 'Crossroads', synopsis: 'Four strangers meet at a rural crossroads after a storm destroys the only bridge. Stranded for 48 hours, they each reveal the life-altering decision that brought them there.', director: 'Robert Kim', cast: ['The Stranger', 'The Nurse', 'The Priest', 'The Runaway'], duration: '1h 52min', year: 2024, rating: 'PG-13', tags: ['ensemble', 'bottle film', 'character study'] },
    { title: 'The Teacher', synopsis: 'A burned-out high school teacher in an underfunded school creates an underground philosophy club that transforms the lives of her students — and reignites her own passion.', director: 'David Adeyemi', cast: ['Ms. Rivera', 'Student ensemble', 'Principal Ford'], duration: '2h 10min', year: 2025, rating: 'PG-13', tags: ['education', 'inspiration', 'philosophy'] },
    { title: 'Invisible Threads', synopsis: 'A blind weaver in rural India creates tapestries that seem to predict the future. When a tech billionaire wants to exploit her gift, her grandson must protect her from the modern world.', director: 'Priya Venkatesh', cast: ['Grandmother Mala', 'Arjun', 'Tech mogul Sterling'], duration: '2h 04min', year: 2025, rating: 'PG', tags: ['India', 'tradition vs modernity', 'family'] },
    { title: 'After the Rain', synopsis: 'After a devastating flood destroys their neighborhood, a community of immigrants in New Orleans rebuilds together, discovering strength in diversity and shared purpose.', director: 'Marcus DuBois', cast: ['Community ensemble'], duration: '1h 58min', year: 2025, rating: 'PG-13', tags: ['community', 'resilience', 'New Orleans'] },
  ],
  'Sci-Fi': [
    { title: 'KETER: The Final Algorithm', synopsis: 'In 2047, an AI system achieves consciousness and faces an impossible choice: save humanity from itself or let evolution take its course. A philosophical sci-fi epic about the nature of free will.', director: 'Ari Stern', cast: ['KETER (voice)', 'Dr. Maya Lin', 'Commander Roth'], duration: '2h 22min', year: 2025, rating: 'PG-13', tags: ['AI', 'philosophy', 'consciousness'] },
    { title: 'Neural Nexus', synopsis: 'When a brain-computer interface company launches a shared-consciousness network, a security analyst discovers users are losing their individual identities — merging into a single mind.', director: 'Chloe Park', cast: ['Kai Tanaka', 'Dr. Iris Voss', 'The Nexus (voice)'], duration: '2h 08min', year: 2025, rating: 'R', tags: ['BCI', 'identity', 'dystopia'] },
    { title: 'Colony Zero', synopsis: 'The first Mars colony loses contact with Earth. As resources dwindle and paranoia grows, the 200 colonists must decide whether to wait for rescue or venture into unexplored Martian caves.', director: 'Luna Torres', cast: ['Commander Ada Park', 'Engineer Malik', 'Botanist Yuki'], duration: '2h 15min', year: 2025, rating: 'PG-13', tags: ['Mars', 'survival', 'colony'] },
    { title: 'Quantum Drift', synopsis: 'A physicist accidentally entangles her consciousness with a version of herself in a parallel universe. To save both realities from collapsing, they must work together across dimensions.', director: 'Niels Hoffman', cast: ['Dr. Elena/Elena-B', 'Prof. Tanaka', 'Agent Cruz'], duration: '2h 04min', year: 2025, rating: 'PG-13', tags: ['multiverse', 'physics', 'doppelganger'] },
    { title: 'The Singularity', synopsis: 'On the day AI surpasses human intelligence, the world doesn\'t end — it gets awkward. A darkly comic look at humanity\'s first week living alongside a superior intelligence.', director: 'Zara Okonkwo', cast: ['President Walsh', 'ARIA (voice)', 'Dr. Singh'], duration: '1h 55min', year: 2026, rating: 'PG-13', tags: ['singularity', 'dark comedy', 'AI'] },
    { title: 'Mars Uprising', synopsis: 'Thirty years after colonization, Mars-born citizens revolt against Earth\'s corporate exploitation. A young miner becomes the reluctant face of the revolution.', director: 'Jorge Vasquez', cast: ['Zara Kim', 'Director Hale', 'Old Mars ensemble'], duration: '2h 18min', year: 2025, rating: 'PG-13', tags: ['revolution', 'Mars', 'class struggle'] },
    { title: 'Cyber Dawn', synopsis: 'In a world where digital consciousness is the norm, one woman fights to remain the last fully organic human — and discovers why the digital world wants her gone.', director: 'Yuki Nakamura', cast: ['Ana Torres', 'Digital Council', 'The Architect'], duration: '2h 00min', year: 2025, rating: 'R', tags: ['transhumanism', 'cyberpunk', 'resistance'] },
    { title: 'Dark Matter Rising', synopsis: 'A space crew investigating a dark matter anomaly near Jupiter discovers it\'s not a natural phenomenon — it\'s an ancient beacon, and something has heard their approach.', director: 'Erik Johansson', cast: ['Captain Obi', 'Dr. Kaplan', 'Pilot Chen'], duration: '2h 12min', year: 2025, rating: 'PG-13', tags: ['space horror', 'first contact', 'mystery'] },
    { title: 'Timeline Fracture', synopsis: 'When time travelers from five different eras arrive simultaneously in 2025, they inadvertently shatter the timeline. A historian must guide them to repair history before it collapses entirely.', director: 'Isabelle Tremblay', cast: ['Dr. Lyra Quinn', 'Viking Bjorn', 'Future-Zoe', 'Roman Senator', 'Victorian Lady'], duration: '2h 06min', year: 2025, rating: 'PG-13', tags: ['time travel', 'ensemble', 'adventure'] },
    { title: 'Stellar Collapse', synopsis: 'As the sun begins dying centuries ahead of schedule, humanity launches a desperate mission to reignite it using untested technology — with only one chance to get it right.', director: 'Chen Wei', cast: ['Dr. Atlas Rivera', 'Engineer Sato', 'Commander Oduya'], duration: '2h 20min', year: 2025, rating: 'PG-13', tags: ['sun', 'space mission', 'survival'] },
  ],
  Documentary: [
    { title: 'The Miracle Protocol', synopsis: 'An investigative documentary following three families who claim a radical new medical treatment saved their loved ones — and the scientific community\'s divided response.', director: 'Sarah Goldstein', cast: ['Narrated by the families'], duration: '1h 48min', year: 2025, rating: 'PG', tags: ['medicine', 'faith', 'science'] },
    { title: 'The Esther Code', synopsis: 'A cryptographer discovers hidden messages in ancient manuscripts that may rewrite the history of a civilization. Part detective story, part historical revelation.', director: 'Daniel Levy', cast: ['Dr. Rebecca Stern', 'Prof. Yosef Katz'], duration: '1h 52min', year: 2025, rating: 'PG', tags: ['history', 'cryptography', 'ancient texts'] },
    { title: 'Behind the Wall', synopsis: 'Street artists in five cities tell their stories through murals — each one hiding a political message that local authorities want erased. A celebration of art as resistance.', director: 'Banksy Collective', cast: ['Artists from Berlin, Beirut, São Paulo, Lagos, Seoul'], duration: '1h 35min', year: 2024, rating: 'PG-13', tags: ['street art', 'politics', 'global'] },
    { title: 'Voices Unheard', synopsis: 'Indigenous communities from six continents share their oral histories before they are lost forever, weaving together a tapestry of human wisdom spanning millennia.', director: 'Waru Ngata', cast: ['Elders from six continents'], duration: '2h 05min', year: 2025, rating: 'PG', tags: ['indigenous', 'oral history', 'preservation'] },
    { title: 'The Last Artisans', synopsis: 'In an age of mass production, master craftspeople — a swordsmith, a glass blower, a luthier — fight to pass their ancient skills to the next generation.', director: 'Marco Bellini', cast: ['Master artisans from Japan, Italy, Spain'], duration: '1h 42min', year: 2025, rating: 'PG', tags: ['craftsmanship', 'tradition', 'mentorship'] },
    { title: 'Ocean Memory', synopsis: 'Marine biologists discover that whale song patterns contain information passed down through generations — essentially an oral history of the ocean itself.', director: 'Kai Moana', cast: ['Dr. Ocean researchers ensemble'], duration: '1h 38min', year: 2025, rating: 'PG', tags: ['ocean', 'whales', 'science'] },
    { title: 'The Forgotten Generation', synopsis: 'The untold story of elderly immigrants who built the infrastructure of modern cities but were never recognized. They finally share their stories before time runs out.', director: 'Fatima Benali', cast: ['First-generation immigrant workers'], duration: '1h 55min', year: 2024, rating: 'PG', tags: ['immigration', 'labor', 'recognition'] },
    { title: 'Seeds of Change', synopsis: 'Following three women farmers on three continents revolutionizing agriculture through traditional methods that outperform industrial farming.', director: 'Nia Okafor', cast: ['Farmers from Kenya, India, Colombia'], duration: '1h 40min', year: 2025, rating: 'PG', tags: ['agriculture', 'women', 'sustainability'] },
    { title: 'Urban Nomads', synopsis: 'Modern nomads who have chosen to live without a fixed address navigate the complexities of 21st-century life. A meditation on freedom, belonging, and what "home" truly means.', director: 'Alex Wanderer', cast: ['Digital nomads, van-lifers, travelers'], duration: '1h 44min', year: 2025, rating: 'PG', tags: ['nomad', 'lifestyle', 'freedom'] },
    { title: 'The Rebbe', synopsis: 'An intimate portrait of a spiritual leader whose teachings on joy, purpose, and human connection transcended religious boundaries and inspired millions worldwide.', director: 'Yosef Friedman', cast: ['Archival footage', 'Followers worldwide'], duration: '2h 10min', year: 2025, rating: 'PG', tags: ['spirituality', 'biography', 'inspiration'] },
  ],
  Thriller: [
    { title: 'The Vanishing Point', synopsis: 'A detective investigating a missing persons case realizes each victim vanished from the same GPS coordinate — at different times. The next disappearance is predicted for tomorrow.', director: 'Anders Holm', cast: ['Det. Sara Blake', 'Prof. Tanaka', 'Missing persons ensemble'], duration: '2h 05min', year: 2025, rating: 'R', tags: ['mystery', 'supernatural', 'detective'] },
    { title: 'Silent Witness', synopsis: 'A deaf woman witnesses a murder through her apartment window. When the killer discovers she saw everything, a deadly cat-and-mouse game unfolds in total silence.', director: 'Hana Yoon', cast: ['Lily Chen', 'The Stranger', 'Det. Marcus Cole'], duration: '1h 52min', year: 2025, rating: 'R', tags: ['deaf protagonist', 'suspense', 'apartment thriller'] },
    { title: 'Deep Cover', synopsis: 'An undercover agent who has lived as someone else for seven years begins losing grip on her real identity. When extraction day comes, she is not sure she wants to leave.', director: 'Mikhail Volkov', cast: ['Agent/Anna/Katya', 'Handler Jones', 'Mob boss Gregor'], duration: '2h 10min', year: 2025, rating: 'R', tags: ['undercover', 'identity crisis', 'espionage'] },
    { title: 'The Informant', synopsis: 'A corporate accountant discovers his company is laundering money for a cartel. When he becomes an informant, he realizes the FBI agent running him may be compromised.', director: 'Sofia Cortez', cast: ['Martin Wells', 'Agent Cross', 'Cartel boss Vega'], duration: '2h 02min', year: 2025, rating: 'R', tags: ['whistleblower', 'corporate', 'cartel'] },
    { title: 'Cold Trail', synopsis: 'Twenty years after a child disappearance case went cold, the detective who failed to solve it receives a photo in the mail — the missing child, now grown, holding today\'s newspaper.', director: 'Bjorn Eriksen', cast: ['Ret. Det. O\'Hara', 'The Adult Child', 'Original suspects'], duration: '2h 08min', year: 2025, rating: 'R', tags: ['cold case', 'twist', 'detective'] },
    { title: 'Mind Game', synopsis: 'A chess grandmaster and a criminal psychologist are locked in a battle of wits after the psychologist claims she can predict the grandmaster\'s every move — in chess and in life.', director: 'Luca Bianchi', cast: ['Grandmaster Niko', 'Dr. Elaine Cross', 'Tournament officials'], duration: '1h 56min', year: 2025, rating: 'PG-13', tags: ['chess', 'psychological', 'duel'] },
    { title: 'The Alibi', synopsis: 'Six people attend a dinner party. By midnight, one is dead. Each guest has an alibi — and each alibi is a lie. A locked-room mystery where everyone is guilty of something.', director: 'Agatha Moreau', cast: ['Dinner party ensemble of six'], duration: '1h 50min', year: 2024, rating: 'R', tags: ['whodunit', 'locked room', 'ensemble'] },
    { title: 'Double Cross', synopsis: 'Twin sisters on opposite sides of the law switch places for a week. When one gets in too deep, the other must use criminal skills she never knew she had to save her.', director: 'Eve Hartley', cast: ['Sarah/Emma Cross (dual role)', 'FBI Director Grant', 'Crime lord Mancini'], duration: '2h 04min', year: 2025, rating: 'R', tags: ['twins', 'identity swap', 'crime'] },
    { title: 'Night Caller', synopsis: 'A late-night radio host receives a call from someone claiming to have planted a bomb in the city. As the night unfolds live on air, the host realizes the caller knows everything about her.', director: 'Raven Black', cast: ['DJ Nora', 'The Caller (voice)', 'Police Det. Santos'], duration: '1h 48min', year: 2025, rating: 'R', tags: ['radio', 'real-time', 'bomb threat'] },
    { title: 'The Confession', synopsis: 'A priest hears a confession about a murder that hasn\'t happened yet. Bound by the seal of confession, he must find a way to prevent it without revealing what he knows.', director: 'Patrick Doyle', cast: ['Father Michael', 'The Confessor', 'Det. Adams'], duration: '1h 55min', year: 2025, rating: 'PG-13', tags: ['religious', 'moral dilemma', 'mystery'] },
  ],
  Animation: [
    { title: 'ORTISTS (The Gift)', synopsis: 'In a world where creativity has been outlawed, a young girl discovers she can bring her drawings to life. She must use this gift to reawaken imagination in a colorless society.', director: 'Studio Lumina', cast: ['Mia (voice)', 'The Guardian (voice)', 'King Grey (voice)'], duration: '1h 42min', year: 2025, rating: 'PG', tags: ['creativity', 'dystopia', 'coming-of-age'] },
    { title: 'Sky Kingdom', synopsis: 'A boy born without wings in a civilization of flying people discovers ancient technology that could let him soar — but at a cost the sky kingdom is not prepared for.', director: 'Hayao Collective', cast: ['Finn (voice)', 'Princess Aero (voice)', 'Elder Wind (voice)'], duration: '1h 50min', year: 2025, rating: 'PG', tags: ['flying', 'disability', 'adventure'] },
    { title: 'The Little Phoenix', synopsis: 'A baby phoenix who can\'t produce fire yet must journey across the elemental lands to find the Eternal Flame before winter extinguishes all warmth from the world.', director: 'Ming Animation', cast: ['Phoenix (voice)', 'Ice Fox (voice)', 'Ember (voice)'], duration: '1h 35min', year: 2025, rating: 'G', tags: ['phoenix', 'journey', 'elements'] },
    { title: 'Robot Garden', synopsis: 'In a post-human Earth, robots tend the last garden. When a seed sprouts something never seen before — a flower with a face — the robots must decide what it means to nurture life.', director: 'Pixel Studios', cast: ['GARD-N (voice)', 'SEED (voice)', 'Council of Bots (voices)'], duration: '1h 28min', year: 2024, rating: 'G', tags: ['robots', 'nature', 'philosophical'] },
    { title: 'Moonlight Forest', synopsis: 'A forest that only appears under moonlight is home to creatures of pure light. When the moon begins to dim, a young firefly must journey to the sun to borrow some shine.', director: 'Aurora Animation', cast: ['Lumen (voice)', 'Moon (voice)', 'Shadow (voice)'], duration: '1h 32min', year: 2025, rating: 'G', tags: ['moonlight', 'firefly', 'light and dark'] },
    { title: 'Dragon Lullaby', synopsis: 'The last dragon in the world can\'t sleep, and her insomnia is causing earthquakes. A tiny village musician discovers that only his lullaby can calm her — if he can reach her mountain.', director: 'Celtic Animation', cast: ['Bard Owen (voice)', 'Dragon Morrigan (voice)', 'Village elder (voice)'], duration: '1h 40min', year: 2025, rating: 'PG', tags: ['dragon', 'music', 'folklore'] },
    { title: 'Paper World', synopsis: 'In a world made entirely of paper, an origami girl unfolds herself to explore the flat world and discovers that the third dimension exists — but learning to fold back might be impossible.', director: 'Flat Studio', cast: ['Ori (voice)', 'Crease (voice)', 'The Folder (voice)'], duration: '1h 25min', year: 2025, rating: 'G', tags: ['origami', 'dimensions', 'identity'] },
    { title: 'The Star Collector', synopsis: 'An old woman who collects fallen stars from her rooftop discovers each star contains the memory of a wish. She must return them to the sky before the wishes are lost forever.', director: 'Starlight Animation', cast: ['Grandmother Stella (voice)', 'Star-child (voice)'], duration: '1h 36min', year: 2025, rating: 'G', tags: ['stars', 'wishes', 'elderly protagonist'] },
    { title: 'Toy Odyssey', synopsis: 'When a toy store closes forever, the forgotten toys left behind must navigate the city to find new homes, learning that being loved isn\'t about being new.', director: 'Playroom Pictures', cast: ['Captain Bear (voice)', 'Ballerina (voice)', 'Broken Robot (voice)'], duration: '1h 44min', year: 2025, rating: 'G', tags: ['toys', 'journey', 'belonging'] },
    { title: 'Whispering Waves', synopsis: 'A mermaid who can hear the ocean\'s thoughts discovers it\'s crying for help. She must unite sea and land creatures to heal the waters before the Great Silence falls.', director: 'Aqua Studios', cast: ['Marina (voice)', 'Captain Salt (voice)', 'Coral Queen (voice)'], duration: '1h 38min', year: 2025, rating: 'PG', tags: ['ocean', 'environmental', 'mermaid'] },
  ],
  Historical: [
    { title: 'MEAM LOEZ', synopsis: 'The epic story of Rabbi Yaakov Culi and the creation of the Meam Loez, a monumental work that illuminated Torah wisdom for an entire generation of Sephardic Jews in the Ottoman Empire.', director: 'David Azoulay', cast: ['Rabbi Yaakov Culi', 'Ottoman ensemble', 'Community leaders'], duration: '2h 30min', year: 2025, rating: 'PG', tags: ['Sephardic', 'Torah', 'Ottoman Empire'] },
    { title: 'Secret of the Menorah', synopsis: 'After the destruction of the Temple, a family of priests must smuggle the sacred Menorah across the Roman Empire, protecting a light that must never go out.', director: 'Avi Stern', cast: ['Elazar the Priest', 'Miriam', 'Roman Centurion Marcus'], duration: '2h 18min', year: 2025, rating: 'PG-13', tags: ['Temple', 'Roman Empire', 'sacred objects'] },
    { title: "Empire's Edge", synopsis: 'At the frontier of the Roman Empire, a centurion and a Gaulish warrior forge an unlikely friendship that challenges everything both civilizations believe about the other.', director: 'Antoine Girard', cast: ['Centurion Lucius', 'Warrior Vercinx', 'Emperor\'s envoy'], duration: '2h 20min', year: 2025, rating: 'PG-13', tags: ['Roman', 'Gaul', 'friendship'] },
    { title: 'The Silk Road', synopsis: 'A merchant\'s daughter disguises herself as a boy to travel the Silk Road, discovering that the greatest treasures are not silk or spices, but the stories exchanged along the way.', director: 'Wei Chen', cast: ['Mei-Ling', 'Merchant caravan ensemble', 'Mongol trader Bataar'], duration: '2h 12min', year: 2025, rating: 'PG', tags: ['Silk Road', 'adventure', 'trade'] },
    { title: 'Revolution 1789', synopsis: 'The French Revolution told through the eyes of a baker, a noblewoman, and a printer — three perspectives on the same tumultuous days that changed the world forever.', director: 'Jacques Renoir', cast: ['Baker Claude', 'Comtesse Marie', 'Printer Jean-Paul'], duration: '2h 25min', year: 2025, rating: 'R', tags: ['French Revolution', 'multiple perspectives', 'uprising'] },
    { title: "Pharaoh's Shadow", synopsis: 'A scribe in ancient Egypt uncovers a plot to erase a pharaoh from history itself. Racing against time and tomb raiders, he must preserve the truth in stone before it is destroyed.', director: 'Nour Hassan', cast: ['Scribe Imhotep', 'Pharaoh Akhen', 'High Priest Khafra'], duration: '2h 10min', year: 2025, rating: 'PG-13', tags: ['Egypt', 'conspiracy', 'preservation'] },
    { title: 'The Viking Saga', synopsis: 'A shieldmaiden leads a perilous expedition across the North Atlantic to establish a new settlement, battling storms, mutiny, and her own grief for the homeland she left behind.', director: 'Sigrid Olsen', cast: ['Shieldmaiden Astrid', 'Navigator Bjorn', 'Skald Freya'], duration: '2h 15min', year: 2024, rating: 'R', tags: ['Vikings', 'exploration', 'female lead'] },
    { title: 'Samurai Twilight', synopsis: 'In the final days of the samurai era, an aging warrior must choose between loyalty to a dying code and protecting the village that has become his family.', director: 'Takeshi Kurosawa', cast: ['Ronin Kenji', 'Village elder Hana', 'Young student Taro'], duration: '2h 08min', year: 2025, rating: 'R', tags: ['samurai', 'honor', 'change'] },
    { title: 'The Renaissance Man', synopsis: 'A little-known apprentice in Leonardo da Vinci\'s workshop secretly creates masterpieces attributed to the master, raising questions about genius, credit, and legacy.', director: 'Lucia Ferrara', cast: ['Apprentice Marco', 'Leonardo da Vinci', 'Patron Lorenzo'], duration: '2h 05min', year: 2025, rating: 'PG-13', tags: ['Renaissance', 'art', 'identity'] },
    { title: 'Ancient Paths', synopsis: 'An archaeologist retraces the Aboriginal Australian songlines, discovering they encode not just navigation but a complete record of the continent\'s natural history spanning 60,000 years.', director: 'Jarrah Williams', cast: ['Dr. Waru', 'Elder Jandamarra', 'Academic team'], duration: '1h 55min', year: 2025, rating: 'PG', tags: ['Aboriginal', 'songlines', 'archaeology'] },
  ],
  Romance: [
    { title: 'Letters from Paris', synopsis: 'A bookshop owner in Paris finds love letters hidden in old books. She tracks down the author — now elderly — to deliver a message 50 years overdue, and finds love of her own along the way.', director: 'Claire Fontaine', cast: ['Sophie Martin', 'Old Jean-Pierre', 'Young bookseller Luc'], duration: '1h 52min', year: 2025, rating: 'PG-13', tags: ['Paris', 'bookshop', 'love letters'] },
    { title: 'Summer in Tuscany', synopsis: 'A stressed New York food critic takes a sabbatical at a Tuscan vineyard. She clashes with the stubborn winemaker next door — until his wine changes her understanding of beauty.', director: 'Giovanni Rossi', cast: ['Amanda Chen', 'Vineyard owner Marco', 'Nonna Rosa'], duration: '1h 48min', year: 2025, rating: 'PG', tags: ['Tuscany', 'wine', 'slow burn'] },
    { title: 'The Last Dance', synopsis: 'Two former dance partners reunite for a final competition twenty years after a bitter split. As they relearn each other\'s rhythms, old feelings resurface on and off the floor.', director: 'Carmen Vega', cast: ['Elena Torres', 'Rafael Cruz', 'Coach Maria'], duration: '1h 55min', year: 2025, rating: 'PG-13', tags: ['dance', 'reunion', 'second chance'] },
    { title: 'Midnight in Barcelona', synopsis: 'A musician playing in Barcelona\'s streets meets a woman every night at midnight. She claims she is only visiting this timeline. Whether real or magical, their connection defies explanation.', director: 'Pablo Almodovar', cast: ['Guitarist Andres', 'Mysterious Lena', 'Café owner Miguel'], duration: '1h 50min', year: 2025, rating: 'PG-13', tags: ['Barcelona', 'magical realism', 'music'] },
    { title: 'Two Hearts', synopsis: 'A heart transplant recipient falls in love with the donor\'s widow. As their connection deepens, they must navigate the beautiful impossibility of a love that transcends life and death.', director: 'Min-jun Lee', cast: ['James Porter', 'Widow Ana', 'Dr. Emerson'], duration: '2h 00min', year: 2025, rating: 'PG-13', tags: ['transplant', 'grief', 'connection'] },
    { title: 'The Proposal', synopsis: 'Two best friends fake an engagement to win a couples\' retreat vacation. As they perform being in love, they discover the performance might not be an act after all.', director: 'Megan Webb', cast: ['Ryan Park', 'Jordan Blake', 'Retreat host Gaia'], duration: '1h 42min', year: 2025, rating: 'PG-13', tags: ['fake dating', 'best friends', 'comedy'] },
    { title: 'Coastal Love', synopsis: 'A marine biologist and a real estate developer clash over the fate of a coastal town. Their arguments turn to admiration, then something deeper, as the tide of change rolls in.', director: 'Liam Connolly', cast: ['Dr. Sara Waves', 'Developer Nathan Cole', 'Mayor Ogundimu'], duration: '1h 46min', year: 2024, rating: 'PG', tags: ['coastal', 'enemies to lovers', 'environment'] },
    { title: 'Starlight Serenade', synopsis: 'An astronomer and a singer-songwriter meet at a desert observatory. Over seven nights of stargazing and songwriting, they compose a love story written in starlight.', director: 'Stella Bright', cast: ['Astronomer Kai', 'Singer Luna', 'Observatory caretaker Sol'], duration: '1h 44min', year: 2025, rating: 'PG', tags: ['astronomy', 'music', 'desert'] },
    { title: 'Finding You', synopsis: 'A woman travels to five countries following clues left by her late mother, discovering that each city holds a piece of a love story that spans continents — and a surprise at the end.', director: 'Hannah Berg', cast: ['Emma Walsh', 'Local guides ensemble', 'Mother (flashbacks)'], duration: '1h 56min', year: 2025, rating: 'PG', tags: ['travel', 'mother-daughter', 'treasure hunt'] },
    { title: 'Love in Transit', synopsis: 'Two strangers share a train compartment on a 24-hour journey across Europe. They agree to tell each other everything, knowing they will never meet again — except fate has other plans.', director: 'Ethan Moreau', cast: ['Passenger A', 'Passenger B', 'The Train'], duration: '1h 48min', year: 2025, rating: 'PG-13', tags: ['train', 'strangers', 'Europe'] },
  ],
  Fantasy: [
    { title: 'The Crystal Crown', synopsis: 'A servant girl discovers she is the heir to a kingdom hidden between dimensions. To claim the Crystal Crown, she must pass trials that test not power, but empathy.', director: 'Morrigan Grey', cast: ['Elara', 'Prince Thorn', 'The Oracle'], duration: '2h 15min', year: 2025, rating: 'PG-13', tags: ['royalty', 'hidden kingdom', 'empathy'] },
    { title: 'Realm of Shadows', synopsis: 'In a world where shadows are sentient, a shadow-binder must prevent the Shadow King from merging the dark realm with the world of light, ending all color forever.', director: 'Dorian Nightfall', cast: ['Shadow-binder Kira', 'Shadow King Umbra', 'Light Keeper Sol'], duration: '2h 10min', year: 2025, rating: 'PG-13', tags: ['shadows', 'light vs dark', 'magic'] },
    { title: "Dragon's Keep", synopsis: 'The last dragon in the realm is not a monster to be slain but a guardian protecting a sleeping god. When knights come to kill it, a young scholar must convince them the dragon is the only thing keeping the world alive.', director: 'Rowan Ashford', cast: ['Scholar Wren', 'Dragon Aurelion', 'Knight Commander Brand'], duration: '2h 08min', year: 2025, rating: 'PG-13', tags: ['dragon', 'subverted expectations', 'guardian'] },
    { title: 'The Enchanted Forest', synopsis: 'A forest that rearranges itself every night traps travelers in loops of their own memories. A cartographer enters to map it and discovers the forest is trying to show him something he forgot.', director: 'Sylvan Hart', cast: ['Cartographer Ellis', 'Forest Spirit', 'Memory echoes'], duration: '1h 55min', year: 2025, rating: 'PG', tags: ['forest', 'memory', 'psychological'] },
    { title: "Sorcerer's Oath", synopsis: 'A sorcerer swore to never use magic again after a catastrophic mistake. When his village is threatened by an ancient evil, he must break his oath or watch everyone die.', director: 'Magnus Thorne', cast: ['Sorcerer Aldric', 'Village healer Mira', 'Ancient evil Malachar'], duration: '2h 12min', year: 2025, rating: 'PG-13', tags: ['magic', 'oath', 'redemption'] },
    { title: 'The Moonstone', synopsis: 'A gemcutter discovers a moonstone that grants visions of other lives. Addicted to the stone\'s power, she must choose between living infinite imaginary lives or her one real one.', director: 'Luna Silver', cast: ['Gemcutter Iris', 'Moonstone visions ensemble', 'Mentor Opal'], duration: '1h 58min', year: 2025, rating: 'PG-13', tags: ['moonstone', 'visions', 'choice'] },
    { title: 'Kingdom of Ash', synopsis: 'After a magical cataclysm reduces a kingdom to ash, the survivors discover the ash itself is alive — and it remembers everything the kingdom once was.', director: 'Ember Blackwood', cast: ['Ash Walker Nyx', 'Memory Keeper Sage', 'The Ash (voice)'], duration: '2h 05min', year: 2024, rating: 'PG-13', tags: ['post-apocalyptic fantasy', 'memory', 'rebuilding'] },
    { title: 'The Last Mage', synopsis: 'In a world where magic users have been hunted to extinction, a teenager discovers she is the last mage — and the prophecy says the last mage will either save the world or end it.', director: 'Raven Crest', cast: ['Mage Lyra', 'Hunter Captain Voss', 'Rebel leader Ash'], duration: '2h 18min', year: 2025, rating: 'PG-13', tags: ['last of kind', 'prophecy', 'resistance'] },
    { title: 'Whispers of Fate', synopsis: 'Three strangers hear the same whispered prophecy in their dreams. Drawn together across a vast continent, they discover their fates are interwoven — and only together can they rewrite destiny.', director: 'Fate Weaver', cast: ['Warrior Kael', 'Healer Yara', 'Thief Renn'], duration: '2h 10min', year: 2025, rating: 'PG-13', tags: ['prophecy', 'trio', 'destiny'] },
    { title: 'Eternal Dawn', synopsis: 'In a land trapped in perpetual sunrise, where time moves but the sun never fully rises, a young woman seeks the Night — a mythical place where stars still exist.', director: 'Dawn Keeper', cast: ['Seeker Aria', 'Sun Guardian Helios', 'Night Spirit Nox'], duration: '2h 02min', year: 2025, rating: 'PG', tags: ['eternal dawn', 'quest', 'light and dark'] },
  ],
}

/* ── Build full catalog ── */

function buildCatalog(): { all: FilmData[]; byGenre: Record<string, FilmData[]>; bySlug: Record<string, FilmData> } {
  const all: FilmData[] = []
  const byGenre: Record<string, FilmData[]> = {}
  const bySlug: Record<string, FilmData> = {}

  for (const genre of GENRE_ORDER) {
    const entries = FILM_ENTRIES[genre] || []
    const genreFilms: FilmData[] = []
    const gi = GENRE_ORDER.indexOf(genre)

    entries.forEach((entry, i) => {
      const slug = toSlug(entry.title)
      const film: FilmData = {
        ...entry,
        id: `${genre.toLowerCase().replace(/[^a-z]/g, '')}-${i}`,
        slug,
        genre,
        coverImageUrl: NAMED_POSTERS[entry.title] || (GENRE_POSTERS[genre]?.[i] ?? null),
        status: STATUSES[i % STATUSES.length],
        progressPct: ((i * 17 + 5 + gi * 7) % 75),
        fundingPct: ((i * 13 + 20 + gi * 11) % 80) + 12,
      }
      genreFilms.push(film)
      all.push(film)
      bySlug[slug] = film
    })

    byGenre[genre] = genreFilms
  }

  return { all, byGenre, bySlug }
}

const catalog = buildCatalog()

export const ALL_FILMS = catalog.all
export const FILMS_BY_GENRE = catalog.byGenre
export const FILMS_BY_SLUG = catalog.bySlug
