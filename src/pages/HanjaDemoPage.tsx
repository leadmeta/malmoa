import { useState } from 'react'
import { Link } from 'react-router-dom'
import { hanjaList, type HanjaCharacter } from '../data/content'
import './InnerPages.css'

type Step = 'select' | 'story' | 'meaning' | 'words' | 'done'

export function HanjaDemoPage() {
  const [step, setStep] = useState<Step>('select')
  const [selectedHanja, setSelectedHanja] = useState<HanjaCharacter | null>(null)
  const [meaningPick, setMeaningPick] = useState<string | null>(null)
  const [selectedWords, setSelectedWords] = useState<Record<string, boolean>>({})
  const [checkedWords, setCheckedWords] = useState(false)

  // Initialize and select a character
  const handleSelectHanja = (character: HanjaCharacter) => {
    setSelectedHanja(character)
    setStep('story')
    setMeaningPick(null)
    setSelectedWords({})
    setCheckedWords(false)
  }

  // Meaning choices generator
  const getMeaningChoices = (character: HanjaCharacter) => {
    if (character.character === '木') {
      return [
        { label: 'Tree / Wood', correct: true },
        { label: 'Water / Flow', correct: false },
        { label: 'Fire / Heat', correct: false },
        { label: 'Gold / Metal', correct: false },
      ]
    } else {
      return [
        { label: 'Harmonize / Tune / Rate', correct: true },
        { label: 'Mountain / Peak', correct: false },
        { label: 'River / Stream', correct: false },
        { label: 'Person / Human', correct: false },
      ]
    }
  }

  // Vocabulary quiz items generator
  // We mix true derivatives and some distractor words
  const getQuizWords = (character: HanjaCharacter) => {
    if (character.character === '木') {
      return [
        { word: '木材 (mok-jae)', gloss: 'Timber used for building', correct: true, origin: '木 (tree) + 材 (material)' },
        { word: '木曜日 (mok-yo-il)', gloss: 'Thursday', correct: true, origin: '木 (tree) + 曜日 (day of week)' },
        { word: '金曜日 (geum-yo-il)', gloss: 'Friday', correct: false, origin: '金 (gold/metal) + 曜日 (day of week)' },
        { word: '樹木 (su-mok)', gloss: 'Trees / Shrubbery', correct: true, origin: '樹 (standing tree) + 木 (tree)' },
        { word: '火曜日 (hwa-yo-il)', gloss: 'Tuesday', correct: false, origin: '火 (fire) + 曜日 (day of week)' },
        { word: '伐木 (beol-mok)', gloss: 'Lumbering / Logging', correct: true, origin: '伐 (cut down) + 木 (tree)' },
      ]
    } else {
      return [
        { word: '色調 (saek-jo)', gloss: 'Color Tone / Hue', correct: true, origin: '色 (color) + 調 (harmony/tone)' },
        { word: '步調 (bo-jo)', gloss: 'Pace / Matching Steps', correct: true, origin: '步 (step) + 調 (rate/harmony)' },
        { word: '語調 (eo-jo)', gloss: 'Tone of voice', correct: true, origin: '語 (speech) + 調 (tune/tone)' },
        { word: '高調 (go-jo)', gloss: 'Intensification / Climax', correct: true, origin: '高 (high) + 調 (tone/rate)' },
        { word: '水質 (su-jil)', gloss: 'Water Quality', correct: false, origin: '水 (water) + 質 (quality)' },
        { word: '火山 (hwa-san)', gloss: 'Volcano', correct: false, origin: '火 (fire) + 山 (mountain)' },
      ]
    }
  }

  const quizWords = selectedHanja ? getQuizWords(selectedHanja) : []
  const meaningChoices = selectedHanja ? getMeaningChoices(selectedHanja) : []
  const isMeaningCorrect = selectedHanja?.character === '木' 
    ? meaningPick === 'Tree / Wood'
    : meaningPick === 'Harmonize / Tune / Rate'

  function toggleWord(word: string) {
    if (checkedWords) return
    setSelectedWords((prev) => ({
      ...prev,
      [word]: !prev[word],
    }))
  }

  const correctSelectionsCount = quizWords.filter(
    (w) => (w.correct && selectedWords[w.word]) || (!w.correct && !selectedWords[w.word])
  ).length

  return (
    <div className="shell page-hero lesson-shell reveal" style={{ paddingBottom: '4rem' }}>
      <p className="section-label">Sample Lesson · Hanja Bridge</p>
      <h1>Hanja Visual Association</h1>
      <p style={{ maxWidth: '38rem' }}>
        Experience the patented Malmoa system. 
        Select a character below to see how its visual mnemonic unlocks real intermediate Korean words.
      </p>

      {/* Select Step */}
      {step === 'select' && (
        <div style={{ marginTop: '2.5rem', animation: 'rise 0.4s ease both' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '1.5rem' }}>
            Choose a Mnemonic Card to Begin:
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {hanjaList.map((item) => (
              <div
                key={item.character}
                onClick={() => handleSelectHanja(item)}
                style={{
                  background: 'white',
                  border: '1px solid var(--line)',
                  padding: '2.5rem 2rem',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.22s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                }}
                className="board-post-card"
              >
                <div style={{ fontSize: '5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', color: 'var(--ink)', marginBottom: '0.5rem', lineHeight: 1 }}>
                  {item.character}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--teal)', marginBottom: '0.25rem' }}>
                  {item.reading}
                </div>
                <div style={{ fontSize: '1rem', color: 'var(--ink-soft)', textTransform: 'capitalize' }}>
                  Core Meaning: {item.meaning}
                </div>
                <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--ember)' }}>
                  Start Mnemonic Study →
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Progress Bar */}
      {step !== 'select' && (
        <div className="lesson-progress" aria-hidden="true" style={{ display: 'flex', gap: '0.5rem', margin: '1.5rem 0 2rem' }}>
          {['story', 'meaning', 'words', 'done'].map((s, i) => {
            const steps = ['story', 'meaning', 'words', 'done']
            const currentIdx = steps.indexOf(step)
            let barBg = 'rgba(0,0,0,0.1)'
            if (currentIdx > i) barBg = 'var(--teal)'
            else if (currentIdx === i) barBg = 'var(--ember)'
            return (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '6px',
                  background: barBg,
                  borderRadius: '99px',
                  transition: 'background 0.3s ease',
                }}
              />
            )
          })}
        </div>
      )}

      {/* Story Mnemonic Step */}
      {step === 'story' && selectedHanja && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'center', margin: '2rem 0' }}>
            <div className="hanja-hero-glyph" style={{ fontSize: '7.5rem', color: 'var(--ink)', background: 'var(--paper-cool)', padding: '2rem 3rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', minWidth: '180px', textAlign: 'center', fontFamily: 'var(--font-display)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {selectedHanja.character}
              <span style={{ fontSize: '1rem', marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--teal)' }}>{selectedHanja.reading}</span>
            </div>
            
            {/* Dynamic Visual Art Component based on character */}
            <div style={{ width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)', borderRadius: '50%', border: '2px dashed var(--line)' }}>
              {selectedHanja.character === '木' ? (
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22V12" strokeWidth="2.5" />
                  <path d="M12 12L7 9" strokeWidth="2" />
                  <path d="M12 14L17 11" strokeWidth="2" />
                  <path d="M12 8L4 5" />
                  <path d="M12 8L20 5" />
                  <path d="M12 12V4" />
                  <path d="M8 22c0-2.5 1.5-3.5 4-3.5s4 1 4 3.5" />
                </svg>
              ) : (
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {/* speech bubble (言) + circulation cycle (周) concept */}
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" />
                  <path d="M8 10h8" />
                  <path d="M8 14h6" />
                  <path d="M12 7h.01" />
                </svg>
              )}
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--teal-deep)', margin: '0 0 0.5rem 0', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span>📖</span> 어원모아 (Origin Mnemonic Story)
          </h3>
          <blockquote style={{ background: 'color-mix(in srgb, var(--paper-cool) 35%, white)', borderLeft: '4px solid var(--teal)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius)', margin: '0 0 2rem 0', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.65 }}>
            "{selectedHanja.story}"
          </blockquote>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" className="btn btn-primary" onClick={() => setStep('meaning')}>
              Test My Meaning Memory →
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setStep('select')}>
              Choose Another Character
            </button>
          </div>
        </div>
      )}

      {/* Meaning Quiz Step */}
      {step === 'meaning' && selectedHanja && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
            What is the core meaning of the symbol <span style={{ color: 'var(--ember)' }}>{selectedHanja.character}</span>?
          </h2>
          
          <div className="quiz-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '2rem 0' }}>
            {meaningChoices.map((choice) => {
              let btnBg = 'var(--paper-cool)'
              let btnBorder = '1px solid var(--line)'
              let btnColor = 'var(--ink)'
              
              if (meaningPick) {
                if (choice.correct) {
                  btnBg = 'color-mix(in srgb, var(--teal) 15%, white)'
                  btnBorder = '2px solid var(--teal)'
                  btnColor = 'var(--teal-deep)'
                } else if (choice.label === meaningPick) {
                  btnBg = 'color-mix(in srgb, var(--ember) 15%, white)'
                  btnBorder = '2px solid var(--ember)'
                  btnColor = 'var(--ember)'
                } else {
                  btnBg = 'transparent'
                  btnColor = 'rgba(0,0,0,0.3)'
                }
              }

              return (
                <button
                  key={choice.label}
                  type="button"
                  disabled={Boolean(meaningPick)}
                  onClick={() => setMeaningPick(choice.label)}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius)',
                    fontSize: '1.15rem',
                    fontWeight: 'bold',
                    background: btnBg,
                    border: btnBorder,
                    color: btnColor,
                    cursor: meaningPick ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {choice.label}
                </button>
              )
            })}
          </div>

          {meaningPick && (
            <div style={{ animation: 'rise 0.3s ease both', marginTop: '1.5rem' }}>
              <p className={`feedback ${isMeaningCorrect ? 'good' : 'bad'}`} style={{ fontSize: '1.1rem', fontWeight: 600, color: isMeaningCorrect ? 'var(--teal-deep)' : 'var(--ember)', background: isMeaningCorrect ? 'color-mix(in srgb, var(--teal) 10%, white)' : 'color-mix(in srgb, var(--ember) 10%, white)', padding: '1rem 1.25rem', borderRadius: 'var(--radius)', border: '1px solid transparent', borderColor: isMeaningCorrect ? 'var(--teal)' : 'var(--ember)' }}>
                {isMeaningCorrect
                  ? `Correct! The primary meaning of ${selectedHanja.character} is indeed "${selectedHanja.meaning}". Under our direct-reading system, this serves as your semantic anchor.`
                  : `Not quite! The correct core meaning of ${selectedHanja.character} is "${selectedHanja.meaning}". Remember the visual mnemonic cue.`}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '1.5rem' }}
                onClick={() => setStep('words')}
              >
                Go to Vocabulary Bridge (어휘 의미망) →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Vocabulary Derivatives Quiz Step */}
      {step === 'words' && selectedHanja && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
            Which words belong to the <span style={{ color: 'var(--teal)' }}>{selectedHanja.character} ({selectedHanja.reading.split(' ')[0]})</span> family?
          </h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
            This is the 어휘 의미망 (Meaning Network). Identify every intermediate Korean word derived from this root character.
          </p>

          <div className="quiz-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', margin: '2rem 0' }}>
            {quizWords.map((item) => {
              const isSelected = selectedWords[item.word] === true
              let border = '1px solid var(--line)'
              let bg = 'white'
              let textColor = 'var(--ink)'

              if (checkedWords) {
                if (item.correct && isSelected) {
                  bg = 'color-mix(in srgb, var(--teal) 15%, white)'
                  border = '2px solid var(--teal)'
                  textColor = 'var(--teal-deep)'
                } else if (item.correct && !isSelected) {
                  bg = 'color-mix(in srgb, var(--teal) 5%, white)'
                  border = '2px dashed var(--teal)'
                  textColor = 'var(--teal-deep)'
                } else if (!item.correct && isSelected) {
                  bg = 'color-mix(in srgb, var(--ember) 15%, white)'
                  border = '2px solid var(--ember)'
                  textColor = 'var(--ember)'
                } else {
                  bg = 'transparent'
                  textColor = 'rgba(0,0,0,0.3)'
                }
              } else if (isSelected) {
                bg = 'var(--paper-cool)'
                border = '2px solid var(--ink)'
              }

              return (
                <button
                  key={item.word}
                  type="button"
                  disabled={checkedWords}
                  onClick={() => toggleWord(item.word)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius)',
                    background: bg,
                    border: border,
                    color: textColor,
                    cursor: checkedWords ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <span style={{ fontSize: '1.35rem', fontWeight: 'bold' }}>{item.word}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{item.gloss}</span>
                  {checkedWords && (
                    <span style={{ fontSize: '0.82rem', marginTop: '0.5rem', fontStyle: 'italic', opacity: 0.9 }}>
                      {item.correct ? `✓ Mapped: ${item.origin}` : `✗ Distractor: ${item.origin}`}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {!checkedWords ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCheckedWords(true)}
              disabled={Object.values(selectedWords).filter(Boolean).length === 0}
            >
              Verify My Selection
            </button>
          ) : (
            <div style={{ animation: 'rise 0.3s ease both' }}>
              <p className="feedback good" style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius)', background: 'color-mix(in srgb, var(--teal) 10%, white)', border: '1px solid var(--teal)', color: 'var(--teal-deep)', fontSize: '1.1rem', fontWeight: 600 }}>
                {correctSelectionsCount === quizWords.length
                  ? `Perfect! You successfully recognized all correct ${selectedHanja.character} derivatives.`
                  : `You matched ${correctSelectionsCount} out of ${quizWords.length} correctly. Observe how deconstructing the Korean sound to the root character unlocks the definition.`}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '1.5rem' }}
                onClick={() => setStep('done')}
              >
                Go to Lesson Summary →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Done Step */}
      {step === 'done' && selectedHanja && (
        <div className="success-panel" style={{ background: 'color-mix(in srgb, var(--paper-cool) 50%, white)', padding: '3rem 2rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', textAlign: 'center', animation: 'rise 0.4s ease both' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
          <h2>Hanja Bridge Unlocked: {selectedHanja.character} ({selectedHanja.reading.split(' ')[0]})</h2>
          <p style={{ maxWidth: '34rem', margin: '0.75rem auto 2rem', color: 'var(--ink-soft)', fontSize: '1.08rem' }}>
            By studying Hanja root characters via visual-sticker association, intermediate and advanced Korean words (representing over 70% of the dictionary) become completely readable without mechanical memorization.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={() => setStep('select')}>
              Try Another Character
            </button>
            <Link className="btn btn-ember" to="/shop">
              Get the core Mnemonic Workbooks
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
