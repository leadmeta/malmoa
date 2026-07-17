export type CurriculumStage = {
  id: string
  week: string
  title: string
  summary: string
  outcomes: string[]
}

export const curriculum: CurriculumStage[] = [
  {
    id: 'hangul',
    week: 'Stage 1',
    title: 'Hangul Foundations & Word Play',
    summary:
      'Learn the Korean alphabet (jamo) through intuitive visual story cues. Move from raw letters to combining syllables and reading everyday starter words naturally.',
    outcomes: [
      'Recognize and pronounce all 24 basic Korean letters',
      'Assemble consonants and vowels into syllable blocks',
      'Read and write 100+ high-frequency everyday Korean words',
    ],
  },
  {
    id: 'association',
    week: 'Stage 2',
    title: 'Hanja Bridge - Visual Association',
    summary:
      'Bridge the gap between sounds and deep meaning. Using Malmoa’s Wadiz-proven method, learn 150 core Hanja characters via rich illustrations and memorable stories.',
    outcomes: [
      'Understand the visual origins of core Hanja characters',
      'Associate characters with their primary meanings and Korean sounds',
      'Recognize key root characters in intermediate vocabulary',
    ],
  },
  {
    id: 'vocabulary',
    week: 'Stage 3',
    title: 'Contextual Hanja Vocabulary',
    summary:
      'Expand your vocabulary exponentially. Master 12 subject areas and 660 critical Hanja-based Korean words using our fast direct-reading methodology.',
    outcomes: [
      'Deconstruct complex Korean words to figure out meanings instantly',
      'Grow your vocabulary from 500 words to over 3,000 words in 12 weeks',
      'Understand academic, media, and professional terminology',
    ],
  },
  {
    id: 'literacy',
    week: 'Stage 4',
    title: 'Advanced Korean Literacy & Live Coaching',
    summary:
      'Solidify your skills with real reading, discussion loops, and 1:1 live feedback. Reach a level where you can read articles, books, and express thoughts fluently.',
    outcomes: [
      'Read short news pieces and storybooks without translator help',
      'Write sentences using advanced hanja-derived vocabulary',
      'Receive personal milestone feedback from native coaches',
    ],
  },
]

export const hangulStory = [
  {
    char: 'ㄱ',
    sound: 'g/k',
    cue: 'Gun',
    line: 'Imagine a sharp angle resembling a gun pointed forward. This shape represents the sound "g" as in "gun" (ㄱ).',
    example: '가방 (ga-bang / Bag)',
  },
  {
    char: 'ㄴ',
    sound: 'n',
    cue: 'Nose',
    line: 'Look at the side profile of a nose sniffing downward. This L-shaped corner represents the "n" sound (ㄴ).',
    example: '나무 (na-mu / Tree)',
  },
  {
    char: 'ㅁ',
    sound: 'm',
    cue: 'Mouth',
    line: 'Imagine a mouth wide open, forming a perfect box shape. This square shape represents the "m" sound (ㅁ).',
    example: '머리 (meo-ri / Head)',
  },
]

export type DerivativeWord = {
  hanja: string
  hangul: string
  english: string
  explanation: string
}

export type HanjaCharacter = {
  character: string
  reading: string
  meaning: string
  story: string
  derivatives: DerivativeWord[]
}

export const hanjaDemo: HanjaCharacter = {
  character: '木',
  reading: 'mok (목)',
  meaning: 'tree / wood',
  story:
    'Visualize a tree trunk rising from the earth, with branches stretching out wide to the left and right, and roots anchoring it firmly below. The character 木 is a direct sketch of this majestic shape, locking the meaning "tree" or "wood" in your memory.',
  derivatives: [
    {
      hanja: '木材',
      hangul: '목재 (mok-jae)',
      english: 'Wood / Timber',
      explanation: '木 (tree) + 材 (material) = Timber used for construction.',
    },
    {
      hanja: '木曜日',
      hangul: '목요일 (mok-yo-il)',
      english: 'Thursday',
      explanation: '木 (tree/planet Jupiter) + 曜日 (day of the week) = Thursday.',
    },
    {
      hanja: '樹木',
      hangul: '수목 (su-mok)',
      english: 'Trees / Shrubbery',
      explanation: '樹 (standing tree) + 木 (tree) = Forest trees or green vegetation.',
    },
    {
      hanja: '伐木',
      hangul: '벌목 (beol-mok)',
      english: 'Lumbering / Logging',
      explanation: '伐 (cut down) + 木 (tree) = Felling trees or logging timber.',
    },
  ],
}

export const WAITLIST_KEY = 'malmoa-waitlist'
export const BOARD_KEY = 'malmoa-board'
export const ORDERS_KEY = 'malmoa-orders'
