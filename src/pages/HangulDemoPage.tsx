import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { hangulStory } from '../data/content'
import './InnerPages.css'

type Step = 'story' | 'quiz' | 'done'

type QuizItem = {
  prompt: string
  answer: string
  choices: string[]
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
        prompt: `Which letter matches the cue “${item.cue}”?`,
        answer: item.char,
        choices: shuffle(hangulStory.map((h) => h.char)),
      })),
    [],
  )

  const current = quizzes[quizIndex]
  const progressDone =
    step === 'story' ? 1 : step === 'quiz' ? 1 + quizIndex + (selected ? 1 : 0) : 4

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
      <p className="section-label">Sample lesson · Hangul</p>
      <h1>Story consonants</h1>
      <p>
        Listen with your eyes: three shapes, three pictures, one short story.
        Then match each cue to its letter.
      </p>

      <div className="lesson-progress" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={n <= progressDone ? 'done' : undefined} />
        ))}
      </div>

      {step === 'story' && (
        <div className="story-panel">
          <div className="jamo-row">
            {hangulStory.map((item, i) => (
              <article
                key={item.char}
                className="jamo-card"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="glyph">{item.char}</div>
                <div className="cue">{item.cue}</div>
                <div className="sound">/{item.sound}/</div>
              </article>
            ))}
          </div>
          <div className="story-lines">
            {hangulStory.map((item) => (
              <p key={item.char}>
                <strong>{item.char}</strong> — {item.line}
              </p>
            ))}
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setStep('quiz')}>
            Start matching quiz
          </button>
        </div>
      )}

      {step === 'quiz' && current && (
        <div>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '0.35rem' }}>
            Question {quizIndex + 1} of {quizzes.length}
          </h2>
          <p style={{ color: 'var(--ink-soft)' }}>{current.prompt}</p>
          <div className="quiz-grid" role="group" aria-label="Answer choices">
            {current.choices.map((choice) => {
              let cls = 'quiz-option'
              if (selected) {
                if (choice === current.answer) cls += ' correct'
                else if (choice === selected) cls += ' wrong'
              }
              return (
                <button
                  key={choice}
                  type="button"
                  className={cls}
                  disabled={Boolean(selected)}
                  onClick={() => onChoose(choice)}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem' }}>
                    {choice}
                  </span>
                </button>
              )
            })}
          </div>
          {selected && (
            <>
              <p className={`feedback${selected === current.answer ? '' : ' bad'}`}>
                {selected === current.answer
                  ? 'Nice — that picture stuck.'
                  : `Not quite. The answer is ${current.answer}.`}
              </p>
              <button type="button" className="btn btn-primary" onClick={nextQuiz}>
                {quizIndex >= quizzes.length - 1 ? 'See results' : 'Next'}
              </button>
            </>
          )}
        </div>
      )}

      {step === 'done' && (
        <div className="success-panel">
          <h2>
            Score: {score} / {quizzes.length}
          </h2>
          <p>
            You just tasted Malmoa’s Hangul story method. Next, see how the same
            picture-and-story approach unlocks Hanja vocabulary.
          </p>
          <div className="hero-actions" style={{ marginTop: '1.25rem' }}>
            <Link className="btn btn-primary" to="/lesson/hanja-demo">
              Continue to Hanja demo
            </Link>
            <Link className="btn btn-secondary" to="/waitlist">
              Join early access
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
