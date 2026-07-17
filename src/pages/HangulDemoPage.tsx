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

export function HangulDemoPage() {
  const [step, setStep] = useState<Step>('story')
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)

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
    if (choice === current.answer) setScore((s) => s + 1)
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
    <div className="shell page-hero lesson-shell reveal">
      <p className="section-label">Sample Lesson · Hangul Foundations</p>
      <h1>Story Consonants</h1>
      <p style={{ maxWidth: '36rem' }}>
        Learn Hangul letters via visual mnemonics. Connect the shape of the letter to a concrete English cue, then test your memory!
      </p>

      {/* Progress Bar */}
      <div className="lesson-progress" aria-hidden="true" style={{ display: 'flex', gap: '0.5rem', margin: '1.5rem 0 2rem' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              height: '6px',
              background: n <= progressDone ? 'var(--teal)' : 'rgba(0,0,0,0.1)',
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
                className="jamo-card"
                style={{
                  animationDelay: `${i * 90}ms`,
                  background: 'color-mix(in srgb, var(--paper-cool) 35%, white)',
                  border: '1px solid var(--line)',
                  padding: '2rem 1.5rem',
                  borderRadius: 'var(--radius)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div className="glyph" style={{ fontSize: '4.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                  {item.char}
                </div>
                <div className="cue" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--ember)' }}>
                  Mnemonic: {item.cue}
                </div>
                <div className="sound" style={{ fontSize: '1rem', color: 'var(--ink-soft)' }}>
                  Sound: /{item.sound}/
                </div>
                <div className="example" style={{ fontSize: '0.85rem', color: 'var(--teal-deep)', background: 'white', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px dashed var(--line)', marginTop: '0.5rem' }}>
                  e.g., {item.example}
                </div>
              </article>
            ))}
          </div>

          <div className="story-lines" style={{ background: 'color-mix(in srgb, var(--paper-cool) 15%, var(--paper))', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {hangulStory.map((item) => (
              <p key={item.char} style={{ fontSize: '1.05rem', margin: 0 }}>
                <strong style={{ fontSize: '1.25rem', color: 'var(--teal)' }}>{item.char}</strong> — {item.line}
              </p>
            ))}
          </div>

          <button type="button" className="btn btn-primary" onClick={() => setStep('quiz')}>
            Start Consonant Matching Quiz
          </button>
        </div>
      )}

      {step === 'quiz' && current && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.35rem', fontFamily: 'var(--font-display)' }}>
            Consonant Quiz: Question {quizIndex + 1} of {quizzes.length}
          </h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '2rem', fontSize: '1.1rem' }}>{current.prompt}</p>

          <div className="quiz-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', margin: '2rem 0' }}>
            {current.choices.map((choice) => {
              let bg = 'white'
              let border = '1px solid var(--line)'
              let textColor = 'var(--ink)'

              if (selected) {
                if (choice === current.answer) {
                  bg = 'color-mix(in srgb, var(--teal) 15%, white)'
                  border = '2px solid var(--teal)'
                  textColor = 'var(--teal-deep)'
                } else if (choice === selected) {
                  bg = 'color-mix(in srgb, var(--ember) 15%, white)'
                  border = '2px solid var(--ember)'
                  textColor = 'var(--ember)'
                } else {
                  bg = 'transparent'
                  textColor = 'rgba(0,0,0,0.3)'
                }
              }

              return (
                <button
                  key={choice}
                  type="button"
                  disabled={Boolean(selected)}
                  onClick={() => onChoose(choice)}
                  style={{
                    padding: '2rem 1rem',
                    borderRadius: 'var(--radius)',
                    background: bg,
                    border: border,
                    color: textColor,
                    cursor: selected ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 'bold' }}>
                    {choice}
                  </span>
                </button>
              )
            })}
          </div>

          {selected && (
            <div style={{ animation: 'rise 0.3s ease both' }}>
              <p className={`feedback ${selected === current.answer ? 'good' : 'bad'}`} style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius)', fontSize: '1.1rem', fontWeight: 600, background: selected === current.answer ? 'color-mix(in srgb, var(--teal) 10%, white)' : 'color-mix(in srgb, var(--ember) 10%, white)', border: '1px solid transparent', borderColor: selected === current.answer ? 'var(--teal)' : 'var(--ember)', color: selected === current.answer ? 'var(--teal-deep)' : 'var(--ember)' }}>
                {selected === current.answer
                  ? `Correct! The visual memory cue for "${current.cue}" successfully locked the letter "${current.answer}".`
                  : `Not quite. The correct letter matching the "${current.cue}" cue is "${current.answer}".`}
              </p>
              <button type="button" className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={nextQuiz}>
                {quizIndex >= quizzes.length - 1 ? 'Show Quiz Results →' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'done' && (
        <div className="success-panel" style={{ background: 'color-mix(in srgb, var(--paper-cool) 50%, white)', padding: '3rem 2rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', textAlign: 'center', animation: 'rise 0.4s ease both' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h2>Hangul Mnemonic Quiz Completed!</h2>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--teal-deep)', margin: '1rem 0' }}>
            Your Score: {score} / {quizzes.length}
          </h3>
          <p style={{ maxWidth: '34rem', margin: '0.75rem auto 2rem', color: 'var(--ink-soft)', fontSize: '1.08rem' }}>
            Excellent job! You have completed the basic consonant association test. 
            Now, let's step onto the Hanja Bridge to see how root shapes multiply your Korean vocabulary.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link className="btn btn-primary" to="/lesson/hanja-demo">
              Continue to Hanja Bridge Demo →
            </Link>
            <Link className="btn btn-secondary" to="/waitlist">
              Book Free Consultation
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
