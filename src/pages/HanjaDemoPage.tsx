import { useState } from 'react'
import { Link } from 'react-router-dom'
import { hanjaDemo } from '../data/content'
import './InnerPages.css'

type Step = 'story' | 'meaning' | 'words' | 'done'

export function HanjaDemoPage() {
  const [step, setStep] = useState<Step>('story')
  const [meaningPick, setMeaningPick] = useState<string | null>(null)
  
  // Quiz items for matching derivatives
  // We mix true derivatives from hanjaDemo.derivatives and some distractor words
  const quizWords = [
    { word: '木材 (mok-jae)', gloss: 'Timber used for building', correct: true, origin: '木 (tree) + 材 (material)' },
    { word: '木曜日 (mok-yo-il)', gloss: 'Thursday', correct: true, origin: '木 (tree) + 曜日 (day of week)' },
    { word: '金曜日 (geum-yo-il)', gloss: 'Friday', correct: false, origin: '金 (gold/metal) + 曜日 (day of week)' },
    { word: '樹木 (su-mok)', gloss: 'Trees / Shrubbery', correct: true, origin: '樹 (standing tree) + 木 (tree)' },
    { word: '火曜日 (hwa-yo-il)', gloss: 'Tuesday', correct: false, origin: '火 (fire) + 曜日 (day of week)' },
    { word: '伐木 (beol-mok)', gloss: 'Lumbering / Logging', correct: true, origin: '伐 (cut down) + 木 (tree)' },
  ]

  const [selectedWords, setSelectedWords] = useState<Record<string, boolean>>({})
  const [checkedWords, setCheckedWords] = useState(false)

  const meaningChoices = [
    { label: 'Tree / Wood', correct: true },
    { label: 'Water / Flow', correct: false },
    { label: 'Fire / Heat', correct: false },
    { label: 'Gold / Metal', correct: false },
  ]

  const isMeaningCorrect = meaningPick === 'Tree / Wood'

  function toggleWord(word: string) {
    if (checkedWords) return
    setSelectedWords((prev) => ({
      ...prev,
      [word]: !prev[word],
    }))
  }

  // Calculate score based on selecting all correct ones and avoiding false ones
  const correctSelectionsCount = quizWords.filter(
    (w) => (w.correct && selectedWords[w.word]) || (!w.correct && !selectedWords[w.word])
  ).length

  return (
    <div className="shell page-hero lesson-shell reveal">
      <p className="section-label">Sample Lesson · Hanja Bridge</p>
      <h1>木 — Mnemonic Tree</h1>
      <p style={{ maxWidth: '36rem' }}>
        See how a single visual symbol expands into a vocabulary family. 
        Experience the Malmoa association method in action.
      </p>

      {/* Lesson Progress Bar */}
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

      {step === 'story' && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', margin: '2rem 0' }}>
            <div className="hanja-hero-glyph" style={{ fontSize: '7rem', color: 'var(--ink)', background: 'var(--paper-cool)', padding: '2rem 3rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', minWidth: '160px', textAlign: 'center', fontFamily: 'var(--font-display)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              木
              <span style={{ fontSize: '1rem', marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--teal)' }}>mok</span>
            </div>
            
            {/* Visual Tree Art Component */}
            <div style={{ width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)', borderRadius: '50%', border: '2px dashed var(--line)' }}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22V12" strokeWidth="2.5" />
                <path d="M12 12L7 9" strokeWidth="2" />
                <path d="M12 14L17 11" strokeWidth="2" />
                <path d="M12 8L4 5" />
                <path d="M12 8L20 5" />
                <path d="M12 12V4" />
                <path d="M8 22c0-2.5 1.5-3.5 4-3.5s4 1 4 3.5" />
              </svg>
            </div>
          </div>

          <blockquote style={{ background: 'color-mix(in srgb, var(--paper-cool) 35%, white)', borderLeft: '4px solid var(--teal)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius)', margin: '1.5rem 0', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.65 }}>
            "{hanjaDemo.story}"
          </blockquote>

          <div style={{ marginTop: '2rem' }}>
            <button type="button" className="btn btn-primary" onClick={() => setStep('meaning')}>
              Check My Meaning Memory →
            </button>
          </div>
        </div>
      )}

      {step === 'meaning' && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
            What is the core meaning of this symbol? <span style={{ color: 'var(--ember)' }}>木</span>
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
                  ? 'Excellent! You remembered correctly. 木 = Tree / Wood. The visual trunk image serves as the permanent meaning engine.'
                  : 'Oops! The correct meaning is "Tree / Wood". Remember the branches and roots shape.'}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '1.5rem' }}
                onClick={() => setStep('words')}
              >
                Go to Vocabulary Bridge →
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'words' && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
            Which words grow from the <span style={{ color: 'var(--teal)' }}>木</span> (Tree) root?
          </h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
            Select every Korean word that belongs to the "Tree / Wood" character family. Distractors are included.
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
                  ? 'Perfect! You successfully mapped the entire vocabulary family.'
                  : `You got ${correctSelectionsCount} of ${quizWords.length} correct. Notice how Hanja roots help you deconstruct Korean words!`}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '1.5rem' }}
                onClick={() => setStep('done')}
              >
                Complete Lesson →
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'done' && (
        <div className="success-panel" style={{ background: 'color-mix(in srgb, var(--paper-cool) 50%, white)', padding: '3rem 2rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', textAlign: 'center', animation: 'rise 0.4s ease both' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
          <h2>Hanja Bridge Unlocked!</h2>
          <p style={{ maxWidth: '34rem', margin: '0.75rem auto 2rem', color: 'var(--ink-soft)', fontSize: '1.08rem' }}>
            This is the exact power of the Malmoa visual-sticker learning system. 
            Once you learn a root shape, intermediate and advanced vocabulary becomes easily readable.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link className="btn btn-ember" to="/shop">
              Get the Core Workbooks
            </Link>
            <Link className="btn btn-secondary" to="/program">
              View Complete Path
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
