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
export const RANK_KEY = 'malmoa-ranking'

export type Ranker = {
  name: string
  xp: number
  badge: string
}

export const SEED_RANKERS: Ranker[] = [
  { name: 'Sarah Connor', xp: 1250, badge: 'Hanja Legend 🏆' },
  { name: 'Kenji Sato', xp: 980, badge: 'Sticker Master 🎨' },
  { name: 'Alex Johnson', xp: 820, badge: 'Hangul Pro 🎖️' },
  { name: 'Tanaka Yua', xp: 750, badge: 'Active Learner ✏️' },
  { name: 'David Miller', xp: 540, badge: 'Explorer 🚶' },
]

export type NewsVocab = {
  word: string
  reading: string
  meaning: string
  story: string
}

export type NewsArticle = {
  id: string
  title: string
  date: string
  koreanText: string
  englishTranslation: string
  vocabList: NewsVocab[]
  quizzes: {
    question: string
    choices: string[]
    answer: string
  }[]
}

export const newsArticles: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Celebrate Hangul Day: Visual Literacy Festivals Open Across Korea',
    date: '2026-10-09',
    koreanText: '한글날을 맞이하여 서울 곳곳에서 문해력 축제가 열렸습니다. 참가자들은 딱딱하게 외우는 기존의 한자 교육에서 벗어나, 그림과 스티커를 사용해 단어를 재미있게 익혔습니다. 특히 어린이들은 조화(調和)와 수목(樹木) 같은 어려운 어휘의 한자 뿌리를 카드 게임으로 학습하며 깊은 관심(關心)을 보였습니다.',
    englishTranslation: 'In celebration of Hangul Day, literacy festivals were held across Seoul. Participants broke away from traditional, rigid Hanja memorization and enjoyed learning words using pictures and stickers. Children in particular showed deep interest as they learned the Hanja roots of difficult vocabulary like "Harmony" and "Trees" through card games.',
    vocabList: [
      {
        word: '調和',
        reading: '조화 (jo-hwa / Harmony)',
        meaning: 'harmony / balance',
        story: '調 (harmonize/tune) + 和 (peace/together) = Combining different elements peacefully in perfect harmony.'
      },
      {
        word: '樹木',
        reading: '수목 (su-mok / Trees)',
        meaning: 'trees / forest plants',
        story: '樹 (standing tree) + 木 (tree) = Vegetation of standing forest trees.'
      }
    ],
    quizzes: [
      {
        question: 'What does the word "調和" (조화) mean in Korean?',
        choices: ['Conflict / War', 'Harmony / Balance', 'Silence / Quiet', 'Speed / Velocity'],
        answer: 'Harmony / Balance'
      },
      {
        question: 'Which Hanja character represents "tree/wood"?',
        choices: ['水 (su)', '火 (hwa)', '木 (mok)', '金 (geum)'],
        answer: '木 (mok)'
      }
    ]
  },
  {
    id: 'news-2',
    title: 'Green City Project: Restoring Forests with Standing Trees (樹木)',
    date: '2026-07-15',
    koreanText: '한국 정부가 도시 온난화를 막기 위해 친환경 숲 조성 사업을 확대합니다. 이번 프로젝트의 핵심은 다양한 수목(樹木)을 도심 공원에 심어 녹지 비율을 높이는 것입니다. 이 사업으로 가공되지 않은 목재(木재) 자원의 국산화 비율을 높이고 시민들에게 휴식처를 제공할 계획입니다.',
    englishTranslation: 'The Korean government is expanding eco-friendly forest creation projects to combat urban warming. The core of this project is planting various standing trees (樹木) in urban parks to increase the ratio of green space. The project plans to increase the localization rate of raw timber (木材) resources and provide resting areas for citizens.',
    vocabList: [
      {
        word: '樹木',
        reading: '수목 (su-mok / Trees)',
        meaning: 'standing forest trees',
        story: '樹 (standing tree) + 木 (tree) = Trees growing in a green park.'
      },
      {
        word: '木材',
        reading: '목재 (mok-jae / Timber)',
        meaning: 'wood / construction material',
        story: '木 (tree) + 材 (material) = Raw wood materials used for buildings and paper.'
      }
    ],
    quizzes: [
      {
        question: 'What is the meaning of "목재" (木材) in construction?',
        choices: ['Iron / Steel', 'Water pipe', 'Timber / Wood material', 'Concrete blocks'],
        answer: 'Timber / Wood material'
      }
    ]
  },
  {
    id: 'news-3',
    title: 'Korean Debate Championship: Tones of Voice (語調) and Harmonious Arguments',
    date: '2026-06-20',
    koreanText: '서울에서 열린 한국어 토론 대회 결승전에서 토론자들의 논리적인 주장만큼이나 어조(語調) 조절이 큰 주목을 받았습니다. 상대방을 설득하기 위해 목소리 높낮이를 고르고(調) 차분하게 하여 논쟁을 조화롭게 이끌어가는 태도가 최종 점수에 결정적인 영향을 미쳤습니다.',
    englishTranslation: 'In the finals of the Korean Debate Championship held in Seoul, the control of the tone of voice (語調) received as much attention as the logical arguments of the debaters. The attitude of coordinating the voice pitch calmly to convince opponents and leading the debate harmoniously had a decisive impact on the final score.',
    vocabList: [
      {
        word: '語調',
        reading: '어조 (eo-jo / Tone)',
        meaning: 'tone of voice',
        story: '語 (speech) + 調 (tune/tone) = The pitch, emotion, or tone embedded within speech.'
      }
    ],
    quizzes: [
      {
        question: 'Which Hanja character inside "어조 (語調)" represents "tune, harmonizing, or adjusting"?',
        choices: ['語 (eo)', '調 (jo)', '和 (hwa)', '心 (sim)'],
        answer: '調 (jo)'
      }
    ]
  }
]
