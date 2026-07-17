import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { hangulStory } from '../data/content'
import './InnerPages.css'

type Step = 'story' | 'quiz' | 'done'

type QuizItem = {
  prompt: string
  answer: string
  choices: string[]
  cue: string
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Confetti Particle Generator Component
function ConfettiEffect() {
  const pieces = Array.from({ length: 25 })
  const colors = ['#0d7377', '#c45c26', '#e8a07a', '#f7f2e8', '#095456']
  
  return (
    <div className="confetti-container">
      {pieces.map((_, i) => {
        const left = Math.random() * 100
        const delay = Math.random() * 2
        const duration = 1.5 + Math.random() * 2
        const size = 6 + Math.random() * 8
        const color = colors[Math.floor(Math.random() * colors.length)]
        
        return (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              width: `${size}px`,
              height: `${size}px`,
              background: color,
            }}
          />
        )
      })}
    </div>
  )
}

export function HangulDemoPage() {
  const [step, setStep] = useState<Step>('story')
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)

  // Game animation triggers
  const [showConfetti, setShowConfetti] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  const quizzes: QuizItem[] = useMemo(
    () =>
      hangulStory.map((item) => ({
        prompt: `Which Korean letter represents the visual cue of a "${item.cue}"?`,
        answer: item.char,
        choices: shuffle(hangulStory.map((h) => h.char)),
        cue: item.cue,
      })),
    [],
  )

  const current = quizzes[quizIndex]
  const progressDone =
    step === 'story' ? 1 : step === 'quiz' ? 1 + quizIndex + (selected ? 1 : 0) : 5

  function onChoose(choice: string) {
    if (selected) return
    setSelected(choice)
    if (choice === current.answer) {
      setScore((s) => s + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    } else {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  function nextQuiz() {
    if (quizIndex >= quizzes.length - 1) {
      setStep('done')
      return
    }
    setQuizIndex((i) => i + 1)
    setSelected(null)
  }

  return (
    <div className={`shell page-hero lesson-shell reveal ${isShaking ? 'shake' : ''}`} style={{ paddingBottom: '4rem', position: 'relative' }}>
      {showConfetti && <ConfettiEffect />}

      <p className="section-label">🎮 Gamified Demo · Hangul Foundations</p>
      <h1>Hangul Mnemonic Play</h1>
      <p style={{ maxWidth: '36rem' }}>
        Learn letter shapes through visual associations. Connect consonants to familiar pictures, then test your intuition!
      </p>

      {/* Progress Bar */}
      <div className="lesson-progress" aria-hidden="true" style={{ display: 'flex', gap: '0.5rem', margin: '1.5rem 0 2.5rem' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              height: '8px',
              background: n <= progressDone ? 'var(--teal)' : 'rgba(0,0,0,0.08)',
              borderRadius: '99px',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>

      {step === 'story' && (
        <div className="story-panel" style={{ animation: 'rise 0.4s ease both' }}>
          <div className="jamo-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {hangulStory.map((item, i) => (
              <article
                key={item.char}
                className="jamo-card board-post-card"
                style={{
                  animationDelay: `${i * 90}ms`,
                  background: 'white',
                  border: '2px solid var(--line)',
                  padding: '2rem 1.5rem',
                  borderRadius: '24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.02)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <div className="glyph" style={{ fontSize: '4.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                  {item.char}
                </div>
                <div className="cue" style={{ fontWeight: 'bold', fontSize: '1.15rem', color: 'var(--ember)' }}>
                  {item.cue}
                </div>
                <div className="sound" style={{ fontSize: '0.92rem', color: 'var(--ink-soft)' }}>
                  Sound: /{item.sound}/
                </div>
                <div className="example" style={{ fontSize: '0.85rem', color: 'var(--teal-deep)', background: 'color-mix(in srgb, var(--paper-cool) 45%, white)', padding: '0.35rem 0.5rem', borderRadius: '8px', border: '1px dashed var(--line)', marginTop: '0.5rem' }}>
                  e.g., {item.example}
                </div>
              </article>
            ))}
          </div>

          <div style={{ maxWidth: '42rem', margin: '0 auto', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--teal-deep)', margin: '0 0 0.5rem 0', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span>📖</span> Mnemonic Associations:
            </h3>
            <div className="story-lines" style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--line)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              {hangulStory.map((item) => (
                <p key={item.char} style={{ fontSize: '1.05rem', margin: 0, paddingLeft: '0.85rem', borderLeft: '3px solid var(--teal)', color: 'var(--ink-soft)' }}>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--teal-deep)' }}>{item.char}</strong> — {item.line}
                </p>
              ))}
            </div>
          </div>

          <button type="button" className="btn btn-primary btn-pulse" style={{ padding: '0.8rem 2rem' }} onClick={() => setStep('quiz')}>
            Start Matching Game ➔
          </button>
        </div>
      )}

      {step === 'quiz' && current && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem', fontFamily: 'var(--font-display)' }}>
            Consonant Game: Question {quizIndex + 1} of {quizzes.length}
          </h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '2rem', fontSize: '1.1rem' }}>{current.prompt}</p>

          <div className="quiz-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', margin: '2rem 0' }}>
            {current.choices.map((choice) => {
              let bg = 'white'
              let border = '2px solid var(--line)'
              let textColor = 'var(--ink)'
              let shadow = '0 4px 10px rgba(0,0,0,0.01)'

              if (selected) {
                if (choice === current.answer) {
                  bg = 'color-mix(in srgb, var(--teal) 12%, white)'
                  border = '2px solid var(--teal)'
                  textColor = 'var(--teal-deep)'
                  shadow = '0 4px 12px color-mix(in srgb, var(--teal) 15%, transparent)'
                } else if (choice === selected) {
                  bg = 'color-mix(in srgb, var(--ember) 12%, white)'
                  border = '2px solid var(--ember)'
                  textColor = 'var(--ember)'
                  shadow = 'none'
                } else {
                  bg = 'transparent'
                  textColor = 'rgba(0,0,0,0.25)'
                  border = '1px solid var(--line)'
                  shadow = 'none'
                }
              }

              return (
                <button
                  key={choice}
                  type="button"
                  disabled={Boolean(selected)}
                  onClick={() => onChoose(choice)}
                  style={{
                    padding: '2.5rem 1rem',
                    borderRadius: '24px',
                    background: bg,
                    border: border,
                    color: textColor,
                    boxShadow: shadow,
                    cursor: selected ? 'default' : 'pointer',
                    transition: 'all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  }}
                  className={!selected ? 'board-post-card' : ''}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 'bold' }}>
                    {choice}
                  </span>
                </button>
              )
            })}
          </div>

          {selected && (
            <div style={{ animation: 'rise 0.3s ease both', marginTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'start', background: selected === current.answer ? 'color-mix(in srgb, var(--teal) 8%, white)' : 'color-mix(in srgb, var(--ember) 8%, white)', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid', borderColor: selected === current.answer ? 'var(--teal)' : 'var(--ember)' }}>
                <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{selected === current.answer ? '🎉' : '💡'}</span>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontWeight: 'bold', color: selected === current.answer ? 'var(--teal-deep)' : 'var(--ember)' }}>
                    {selected === current.answer ? 'Excellent Match!' : 'Oops, Check the Association!'}
                  </h4>
                  <p style={{ margin: 0, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                    {selected === current.answer
                      ? `Nice! The visual cue for "${current.cue}" successfully retrieved the letter "${current.answer}".`
                      : `Not quite. The correct letter representing the "${current.cue}" cue is "${current.answer}".`}
                  </p>
                </div>
              </div>
              <button type="button" className="btn btn-primary btn-pulse" style={{ marginTop: '2rem', padding: '0.8rem 2rem' }} onClick={nextQuiz}>
                {quizIndex >= quizzes.length - 1 ? 'Unlock Final Results ➔' : 'Next Consonant ➔'}
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'done' && (
        <div className="success-panel" style={{ background: 'white', padding: '3.5rem 2rem', borderRadius: '32px', border: '2px solid var(--line)', textAlign: 'center', animation: 'rise 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div className="badge-spin" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', background: 'radial-gradient(circle, var(--paper-cool), var(--teal))', borderRadius: '50%', color: 'white', fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem', boxShadow: '0 8px 20px rgba(13,115,119,0.3)', border: '4px solid white' }}>
            🎓
          </div>
          <h2>Hangul Explorer Medal Unlocked!</h2>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--teal-deep)', margin: '1rem 0' }}>
            Final Mnemonic Score: {score} / {quizzes.length}
          </h3>
          <p style={{ maxWidth: '34rem', margin: '0.85rem auto 2.2rem auto', color: 'var(--ink-soft)', fontSize: '1.08rem', lineHeight: 1.65 }}>
            Splendid! You have successfully completed the basic consonant matching test. 
            Now, let's step onto the Hanja Bridge to see how root shapes multiply your Korean vocabulary.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="btn btn-primary btn-pulse" style={{ padding: '0.8rem 2rem' }} to="/lesson/hanja-demo">
              Proceed to Hanja Bridge Demo ➔
            </Link>
            <Link className="btn btn-secondary" style={{ padding: '0.8rem 1.5rem' }} to="/waitlist">
              Book Free Consultation
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
