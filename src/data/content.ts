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
    week: 'Week 1–2',
    title: 'Hangul Foundations',
    summary:
      'Consonants, vowels, syllable blocks, and batchim — learned through picture–story mnemonics so reading feels natural, not mechanical.',
    outcomes: [
      'Recognize and pronounce core jamo',
      'Assemble syllables into readable blocks',
      'Read short everyday words aloud',
    ],
  },
  {
    id: 'everyday',
    week: 'Week 3–4',
    title: 'Everyday Korean',
    summary:
      'High-frequency words and short sentences tied to story scenes — greetings, food, travel, and daily life.',
    outcomes: [
      'Build a starter spoken vocabulary',
      'Connect sound–shape–meaning in context',
      'Use phrases you can try the same day',
    ],
  },
  {
    id: 'hanja',
    week: 'Week 5–8',
    title: 'Hanja Bridge',
    summary:
      'The Malmoa picture–sticker–story method from our Wadiz textbook: characters as meaning engines that unlock Korean vocabulary families.',
    outcomes: [
      'Learn characters via visual stories',
      'Map one character to multiple Korean words',
      'Grow literacy beyond phonetic reading',
    ],
  },
  {
    id: 'fluency',
    week: 'Ongoing',
    title: 'Culture & Fluency',
    summary:
      'Short reading and discussion loops that strengthen vocabulary, thinking, and cultural fluency — the same literacy philosophy behind Malmoa.',
    outcomes: [
      'Read short texts with confidence',
      'Discuss meaning, not only memorize',
      'Stay in a sustainable learning rhythm',
    ],
  },
]

export const hangulStory = [
  {
    char: 'ㄱ',
    sound: 'g/k',
    cue: 'gun',
    line: 'The story starts with a gun pointed forward — that sharp angle is ㄱ.',
  },
  {
    char: 'ㄴ',
    sound: 'n',
    cue: 'nose',
    line: 'You smell something with your nose — the L-shaped bend is ㄴ.',
  },
  {
    char: 'ㅁ',
    sound: 'm',
    cue: 'mouth',
    line: 'Your mouth opens wide in surprise — the closed box shape is ㅁ.',
  },
]

export const hanjaDemo = {
  character: '木',
  reading: 'mok',
  meaning: 'tree / wood',
  story:
    'Imagine a trunk rising from the ground with branches stretching left and right. That silhouette is 木 — the root meaning “tree.”',
  derivatives: [
    { word: '나무', gloss: 'tree', correct: true },
    { word: '목요일', gloss: 'Thursday (tree day)', correct: true },
    { word: '금요일', gloss: 'Friday', correct: false },
  ],
  meaningChoices: [
    { label: 'tree / wood', correct: true },
    { label: 'water', correct: false },
    { label: 'fire', correct: false },
    { label: 'mountain', correct: false },
  ],
}

export const WAITLIST_KEY = 'malmoa-waitlist'
