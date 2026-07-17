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
      'Bridge the gap between sounds and deep meaning. Using Malmoa’s Wadiz-proven method, learn 120 core 1st & 2nd grade Hanja characters via rich illustrations and 어원모아 (Origin Mnemonic) stories.',
    outcomes: [
      'Understand the visual origins of core Hanja characters',
      'Associate characters with their primary meanings and Korean sounds',
      'Recognize key root characters in intermediate vocabulary',
    ],
  },
  {
    id: 'vocabulary',
    week: 'Stage 3',
    title: 'Subject-wise Hanja Vocabulary',
    summary:
      'Expand your vocabulary exponentially. Master 37 subject areas and 1,840 essential Hanja-based Korean words using our fast direct-reading (직독직해) methodology.',
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

export const hanjaList: HanjaCharacter[] = [
  {
    character: '木',
    reading: 'mok (목)',
    meaning: 'tree / wood',
    story:
      'Visualize a tree trunk rising from the earth, with branches stretching out wide to the left and right, and roots anchoring it firmly below. The character 木 is a direct sketch of this shape, locking the meaning "tree" or "wood" in your memory.',
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
  },
  {
    character: '調',
    reading: 'jo (조)',
    meaning: 'harmonize / tune / rate',
    story:
      'Visualize speaking (言) to align opinions, combined with a cycle (周) representing circulation or completeness. In Korean vocabulary, 調 acts as a root meaning to coordinate, adjust, or harmonize.',
    derivatives: [
      {
        hanja: '色調',
        hangul: '색조 (saek-jo)',
        english: 'Color Tone / Hue',
        explanation: '色 (color) + 調 (harmony/tone) = The overall harmony or tone of colors.',
      },
      {
        hanja: '步調',
        hangul: '보조 (bo-jo)',
        english: 'Pace / Matching Steps',
        explanation: '步 (step) + 調 (rate/harmony) = Keeping pace or matching step speed.',
      },
      {
        hanja: '語調',
        hangul: '어조 (eo-jo)',
        english: 'Tone of Voice',
        explanation: '語 (speech) + 調 (tune/tone) = The tone, pitch, or manner in speech.',
      },
      {
        hanja: '高調',
        hangul: '고조 (go-jo)',
        english: 'Intensification / Climax',
        explanation: '高 (high) + 調 (tone/rate) = Elevating the tone, mood, or energy to a high level.',
      },
    ],
  },
]

export const WAITLIST_KEY = 'malmoa-waitlist'
export const BOARD_KEY = 'malmoa-board'
export const ORDERS_KEY = 'malmoa-orders'
