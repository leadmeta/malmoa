import { useState } from 'react'
import { Link } from 'react-router-dom'
import { hanjaDemo } from '../data/content'
import './InnerPages.css'

type Step = 'story' | 'meaning' | 'words' | 'done'

export function HanjaDemoPage() {
  const [step, setStep] = useState<Step>('story')
  const [meaningPick, setMeaningPick] = useState<string | null>(null)
  const [wordPicks, setWordPicks] = useState<Record<string, boolean | null>>({})
  const [wordDone, setWordDone] = useState(false)

  const meaningCorrect =
    meaningPick !== null &&
    hanjaDemo.meaningChoices.find((c) => c.label === meaningPick)?.correct

  function toggleWord(word: string) {
    if (wordDone) return
    setWordPicks((prev) => ({ ...prev, [word]: !prev[word] }))
  }

  function checkWords() {
    setWordDone(true)
  }

  const wordScore = hanjaDemo.derivatives.filter((d) => {
    const picked = wordPicks[d.word] === true
    return d.correct === picked
  }).length

  return (
    <div className="shell page-hero lesson-shell reveal">
      <p className="section-label">Sample lesson · Hanja</p>
      <h1>木 — the tree character</h1>
      <p>
        One picture. One story. Then meaning and the Korean words that grow from
        it — the Malmoa Hanja bridge from our Wadiz textbook method.
      </p>

      <div className="lesson-progress" aria-hidden="true">
        {['story', 'meaning', 'words', 'done'].map((s, i) => (
          <span
            key={s}
            className={
              ['story', 'meaning', 'words', 'done'].indexOf(step) >= i ? 'done' : undefined
            }
          />
        ))}
      </div>

      {step === 'story' && (
        <div>
          <div className="hanja-hero-glyph" aria-hidden="true">
            {hanjaDemo.character}
          </div>
          <p className="hanja-story">{hanjaDemo.story}</p>
          <p style={{ marginBottom: '1.25rem' }}>
            Reading: <strong>{hanjaDemo.reading}</strong>
          </p>
          <button type="button" className="btn btn-primary" onClick={() => setStep('meaning')}>
            Check the meaning
          </button>
        </div>
      )}

      {step === 'meaning' && (
        <div>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '0.5rem' }}>
            What does {hanjaDemo.character} mean?
          </h2>
          <div className="quiz-grid" role="group" aria-label="Meaning choices">
            {hanjaDemo.meaningChoices.map((choice) => {
              let cls = 'quiz-option'
              if (meaningPick) {
                if (choice.correct) cls += ' correct'
                else if (choice.label === meaningPick) cls += ' wrong'
              }
              return (
                <button
                  key={choice.label}
                  type="button"
                  className={cls}
                  disabled={Boolean(meaningPick)}
                  onClick={() => setMeaningPick(choice.label)}
                >
                  {choice.label}
                </button>
              )
            })}
          </div>
          {meaningPick && (
            <>
              <p className={`feedback${meaningCorrect ? '' : ' bad'}`}>
                {meaningCorrect
                  ? 'Yes — tree / wood. That trunk image is the meaning engine.'
                  : `The meaning is ${hanjaDemo.meaning}.`}
              </p>
              <button type="button" className="btn btn-primary" onClick={() => setStep('words')}>
                Find related Korean words
              </button>
            </>
          )}
        </div>
      )}

      {step === 'words' && (
        <div>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '0.5rem' }}>
            Which words grow from 木?
          </h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '0.75rem' }}>
            Select every word that belongs to this character family.
          </p>
          <div className="quiz-grid">
            {hanjaDemo.derivatives.map((item) => {
              const picked = wordPicks[item.word] === true
              let cls = 'quiz-option'
              if (wordDone) {
                if (item.correct && picked) cls += ' correct'
                else if (item.correct && !picked) cls += ' wrong'
                else if (!item.correct && picked) cls += ' wrong'
              } else if (picked) {
                cls += ' correct'
              }
              return (
                <button
                  key={item.word}
                  type="button"
                  className={cls}
                  disabled={wordDone}
                  onClick={() => toggleWord(item.word)}
                  aria-pressed={picked}
                >
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                    {item.word}
                  </strong>
                  <span style={{ display: 'block', color: 'var(--ink-soft)', marginTop: '0.2rem' }}>
                    {item.gloss}
                  </span>
                </button>
              )
            })}
          </div>
          {!wordDone ? (
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
              onClick={checkWords}
            >
              Check answers
            </button>
          ) : (
            <>
              <p className="feedback">
                {wordScore === hanjaDemo.derivatives.length
                  ? 'Perfect — you mapped the family.'
                  : `You got ${wordScore} of ${hanjaDemo.derivatives.length} judgments right.`}
              </p>
              <button type="button" className="btn btn-primary" onClick={() => setStep('done')}>
                Finish lesson
              </button>
            </>
          )}
        </div>
      )}

      {step === 'done' && (
        <div className="success-panel">
          <h2>Hanja bridge unlocked</h2>
          <p>
            This is how Malmoa turns one character into a vocabulary cluster.
            Join early access for the full Hangul → Hanja pilot path.
          </p>
          <div className="hero-actions" style={{ marginTop: '1.25rem' }}>
            <Link className="btn btn-ember" to="/waitlist">
              Request early access
            </Link>
            <Link className="btn btn-secondary" to="/program">
              View curriculum
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
