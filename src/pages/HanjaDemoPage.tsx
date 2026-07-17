import { useState } from 'react'
import { Link } from 'react-router-dom'
import { hanjaList, type HanjaCharacter } from '../data/content'
import './InnerPages.css'

type Step = 'select' | 'story' | 'meaning' | 'words' | 'done'

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

export function HanjaDemoPage() {
  const [step, setStep] = useState<Step>('select')
  const [selectedHanja, setSelectedHanja] = useState<HanjaCharacter | null>(null)
  const [meaningPick, setMeaningPick] = useState<string | null>(null)
  
  // Game animation triggers
  const [showConfetti, setShowConfetti] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  // Vocabulary quiz items generator
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
        { word: '高調 (go-jo)', gloss: 'Intensification / Climax', correct: true, origin: 'High (高) + Tone (調)' },
        { word: '水質 (su-jil)', gloss: 'Water Quality', correct: false, origin: '水 (water) + 質 (quality)' },
        { word: '火山 (hwa-san)', gloss: 'Volcano', correct: false, origin: '火 (fire) + 山 (mountain)' },
      ]
    }
  }

  const quizWords = selectedHanja ? getQuizWords(selectedHanja) : []
  
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

  const [selectedWords, setSelectedWords] = useState<Record<string, boolean>>({})
  const [checkedWords, setCheckedWords] = useState(false)

  const meaningChoices = selectedHanja ? getMeaningChoices(selectedHanja) : []
  const isMeaningCorrect = selectedHanja?.character === '木' 
    ? meaningPick === 'Tree / Wood'
    : meaningPick === 'Harmonize / Tune / Rate'

  const handleSelectHanja = (character: HanjaCharacter) => {
    setSelectedHanja(character)
    setStep('story')
    setMeaningPick(null)
    setSelectedWords({})
    setCheckedWords(false)
    setShowConfetti(false)
  }

  const handleMeaningPick = (label: string, correct: boolean) => {
    setMeaningPick(label)
    if (correct) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2500)
    } else {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  function toggleWord(word: string) {
    if (checkedWords) return
    setSelectedWords((prev) => ({
      ...prev,
      [word]: !prev[word],
    }))
  }

  const handleVerifyWords = () => {
    setCheckedWords(true)
    const allCorrectSelected = quizWords.every(
      (w) => (w.correct && selectedWords[w.word]) || (!w.correct && !selectedWords[w.word])
    )
    if (allCorrectSelected) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2500)
    } else {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  const correctSelectionsCount = quizWords.filter(
    (w) => (w.correct && selectedWords[w.word]) || (!w.correct && !selectedWords[w.word])
  ).length

  return (
    <div className={`shell page-hero lesson-shell reveal ${isShaking ? 'shake' : ''}`} style={{ paddingBottom: '4rem', position: 'relative' }}>
      {showConfetti && <ConfettiEffect />}

      <p className="section-label">🎮 Gamified Demo · Hanja Bridge</p>
      <h1>Play & Learn Hanja</h1>
      <p style={{ maxWidth: '38rem' }}>
        Unlock character secrets like a native game. 
        Select a visual card below and watch the 어휘 의미망 (Vocabulary Network) solve itself!
      </p>

      {/* Select Step */}
      {step === 'select' && (
        <div style={{ marginTop: '2.5rem', animation: 'rise 0.4s ease both' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            Tap a Mnemonic Sticker to Begin:
          </h3>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {hanjaList.map((item) => (
              <div
                key={item.character}
                onClick={() => handleSelectHanja(item)}
                style={{
                  background: 'white',
                  border: '2px solid var(--line)',
                  padding: '2.5rem 2rem',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  width: '260px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.03)',
                }}
                className="board-post-card"
              >
                <div style={{ fontSize: '5.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', color: 'var(--ink)', marginBottom: '0.2rem', lineHeight: 1 }}>
                  {item.character}
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--teal)', marginBottom: '0.25rem', letterSpacing: '0.04em' }}>
                  {item.reading}
                </div>
                <div style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', background: 'color-mix(in srgb, var(--paper-cool) 45%, white)', padding: '0.35rem 0.5rem', borderRadius: '999px', display: 'inline-block' }}>
                  Meaning: {item.meaning}
                </div>
                <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--ember)' }} className="btn-pulse">
                  Unseal Card ➔
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Progress Bar */}
      {step !== 'select' && (
        <div className="lesson-progress" aria-hidden="true" style={{ display: 'flex', gap: '0.5rem', margin: '1.5rem 0 2.5rem' }}>
          {['story', 'meaning', 'words', 'done'].map((s, i) => {
            const steps = ['story', 'meaning', 'words', 'done']
            const currentIdx = steps.indexOf(step)
            let barBg = 'rgba(0,0,0,0.08)'
            if (currentIdx > i) barBg = 'var(--teal)'
            else if (currentIdx === i) barBg = 'var(--ember)'
            return (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '8px',
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
        <div style={{ animation: 'rise 0.4s ease both', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', alignItems: 'center', margin: '2rem 0' }}>
            <div className="hanja-hero-glyph" style={{ fontSize: '8rem', color: 'var(--ink)', background: 'color-mix(in srgb, var(--paper-cool) 70%, white)', padding: '2rem 3rem', borderRadius: '32px', border: '3px solid var(--teal)', minWidth: '180px', textAlign: 'center', fontFamily: 'var(--font-display)', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 10px 25px rgba(13,115,119,0.1)' }}>
              {selectedHanja.character}
              <span style={{ fontSize: '1.15rem', marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--teal)' }}>{selectedHanja.reading}</span>
            </div>
            
            {/* Dynamic Mnemonic Image Asset from Wadiz Campaign */}
            <div>
              <img
                src={selectedHanja.character === '木' ? '/hanja_tree_mnemonic.png' : '/hanja_tune_mnemonic.png'}
                alt={`${selectedHanja.character} visual mnemonic`}
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '24px',
                  objectFit: 'cover',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  border: '3px solid white',
                }}
              />
            </div>
          </div>

          <div style={{ maxWidth: '42rem', margin: '0 auto', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--teal-deep)', margin: '0 0 0.5rem 0', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span>💬</span> Coach Ji-won's Secret Story:
            </h3>
            <blockquote style={{ background: 'white', borderLeft: '5px solid var(--teal)', padding: '1.5rem', borderRadius: '16px', margin: '0 0 2rem 0', fontSize: '1.15rem', fontStyle: 'italic', lineHeight: 1.7, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              "{selectedHanja.story}"
            </blockquote>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button type="button" className="btn btn-primary btn-pulse" style={{ padding: '0.8rem 2rem' }} onClick={() => setStep('meaning')}>
              Reveal the Meaning Quiz! ➔
            </button>
            <button type="button" className="btn btn-secondary" style={{ padding: '0.8rem 1.5rem' }} onClick={() => setStep('select')}>
              Back to Selection
            </button>
          </div>
        </div>
      )}

      {/* Meaning Quiz Step */}
      {step === 'meaning' && selectedHanja && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>❓</span> Quick Check: What does <span style={{ color: 'var(--ember)' }}>{selectedHanja.character}</span> represent?
          </h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '2rem' }}>Choose the correct meaning based on the mnemonic story you just read.</p>
          
          <div className="quiz-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', margin: '2rem 0' }}>
            {meaningChoices.map((choice) => {
              let btnBg = 'white'
              let btnBorder = '2px solid var(--line)'
              let btnColor = 'var(--ink)'
              let shadow = '0 4px 10px rgba(0,0,0,0.01)'
              
              if (meaningPick) {
                if (choice.correct) {
                  btnBg = 'color-mix(in srgb, var(--teal) 12%, white)'
                  btnBorder = '2px solid var(--teal)'
                  btnColor = 'var(--teal-deep)'
                  shadow = '0 4px 12px color-mix(in srgb, var(--teal) 15%, transparent)'
                } else if (choice.label === meaningPick) {
                  btnBg = 'color-mix(in srgb, var(--ember) 12%, white)'
                  btnBorder = '2px solid var(--ember)'
                  btnColor = 'var(--ember)'
                  shadow = 'none'
                } else {
                  btnBg = 'transparent'
                  btnColor = 'rgba(0,0,0,0.25)'
                  btnBorder = '1px solid var(--line)'
                  shadow = 'none'
                }
              }

              return (
                <button
                  key={choice.label}
                  type="button"
                  disabled={Boolean(meaningPick)}
                  onClick={() => handleMeaningPick(choice.label, choice.correct)}
                  style={{
                    padding: '1.75rem 1.25rem',
                    borderRadius: '20px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    background: btnBg,
                    border: btnBorder,
                    color: btnColor,
                    boxShadow: shadow,
                    cursor: meaningPick ? 'default' : 'pointer',
                    transition: 'all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  }}
                  className={!meaningPick ? 'board-post-card' : ''}
                >
                  {choice.label}
                </button>
              )
            })}
          </div>

          {meaningPick && (
            <div style={{ animation: 'rise 0.3s ease both', marginTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'start', background: isMeaningCorrect ? 'color-mix(in srgb, var(--teal) 8%, white)' : 'color-mix(in srgb, var(--ember) 8%, white)', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid', borderColor: isMeaningCorrect ? 'var(--teal)' : 'var(--ember)' }}>
                <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{isMeaningCorrect ? '🎉' : '💡'}</span>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontWeight: 'bold', color: isMeaningCorrect ? 'var(--teal-deep)' : 'var(--ember)' }}>
                    {isMeaningCorrect ? 'Correct! Awesome Memory!' : 'Not quite. Let\'s remember the cue!'}
                  </h4>
                  <p style={{ margin: 0, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                    {isMeaningCorrect
                      ? `"${meaningPick}" is the root meaning. That picture-story maps directly to this character, making it a permanent semantic anchor in your brain.`
                      : `The correct core meaning of ${selectedHanja.character} is "${selectedHanja.meaning}". Remember the branches and roots cue!`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-pulse"
                style={{ marginTop: '2rem', padding: '0.8rem 2rem' }}
                onClick={() => setStep('words')}
              >
                Assemble Mnemonic Stickers! ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* Vocabulary Matching Step */}
      {step === 'words' && selectedHanja && (
        <div style={{ animation: 'rise 0.4s ease both' }}>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🧩</span> Sticker Puzzle: Tap to Stick!
          </h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
            Select every word below that stems from the **{selectedHanja.character} ({selectedHanja.reading.split(' ')[0]})** family. Correct matches will lock into the meaning grid.
          </p>

          <div className="quiz-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', margin: '2rem 0' }}>
            {quizWords.map((item) => {
              const isSelected = selectedWords[item.word] === true
              let border = '2px solid var(--line)'
              let bg = 'white'
              let textColor = 'var(--ink)'
              let cardClass = ''

              if (checkedWords) {
                if (item.correct && isSelected) {
                  bg = 'color-mix(in srgb, var(--teal) 12%, white)'
                  border = '2px solid var(--teal)'
                  textColor = 'var(--teal-deep)'
                  cardClass = 'sticker-glow'
                } else if (item.correct && !isSelected) {
                  bg = 'color-mix(in srgb, var(--teal) 5%, white)'
                  border = '2px dashed var(--teal)'
                  textColor = 'var(--teal-deep)'
                } else if (!item.correct && isSelected) {
                  bg = 'color-mix(in srgb, var(--ember) 12%, white)'
                  border = '2px solid var(--ember)'
                  textColor = 'var(--ember)'
                } else {
                  bg = 'transparent'
                  textColor = 'rgba(0,0,0,0.25)'
                  border = '1px solid var(--line)'
                }
              } else if (isSelected) {
                bg = 'var(--paper-cool)'
                border = '2px solid var(--teal)'
                textColor = 'var(--teal-deep)'
                cardClass = 'sticker-glow'
              }

              return (
                <button
                  key={item.word}
                  type="button"
                  disabled={checkedWords}
                  onClick={() => toggleWord(item.word)}
                  style={{
                    padding: '1.5rem 1.25rem',
                    borderRadius: '24px',
                    background: bg,
                    border: border,
                    color: textColor,
                    cursor: checkedWords ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
                  }}
                  className={`${cardClass} ${!checkedWords ? 'board-post-card' : ''}`}
                >
                  <span style={{ fontSize: '1.4rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    {item.word}
                    {isSelected && <span style={{ fontSize: '1rem' }}>📌</span>}
                  </span>
                  <span style={{ fontSize: '0.98rem', fontWeight: 500 }}>{item.gloss}</span>
                  {checkedWords && (
                    <span style={{ fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic', opacity: 0.9, background: item.correct ? 'color-mix(in srgb, var(--teal) 10%, white)' : 'color-mix(in srgb, var(--ember) 10%, white)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                      {item.correct ? `✓ 어원: ${item.origin}` : `✗ Distractor: ${item.origin}`}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {!checkedWords ? (
            <button
              type="button"
              className="btn btn-primary btn-pulse"
              style={{ padding: '0.8rem 2.5rem' }}
              onClick={handleVerifyWords}
              disabled={Object.values(selectedWords).filter(Boolean).length === 0}
            >
              Verify Mnemonic Stickers
            </button>
          ) : (
            <div style={{ animation: 'rise 0.3s ease both', marginTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'start', background: correctSelectionsCount === quizWords.length ? 'color-mix(in srgb, var(--teal) 8%, white)' : 'color-mix(in srgb, var(--ember) 8%, white)', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid', borderColor: correctSelectionsCount === quizWords.length ? 'var(--teal)' : 'var(--ember)' }}>
                <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{correctSelectionsCount === quizWords.length ? '🏆' : '✏️'}</span>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontWeight: 'bold', color: correctSelectionsCount === quizWords.length ? 'var(--teal-deep)' : 'var(--ember)' }}>
                    {correctSelectionsCount === quizWords.length ? 'Perfect Score!' : 'Stickers Evaluated!'}
                  </h4>
                  <p style={{ margin: 0, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                    {correctSelectionsCount === quizWords.length
                      ? `Excellent! You successfully mapped the complete vocabulary structure. You can now decode these 4 advanced words without a dictionary.`
                      : `You correctly aligned ${correctSelectionsCount} out of ${quizWords.length}. Compare the roots to see how Hanja unlocks word meanings.`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-pulse"
                style={{ marginTop: '2rem', padding: '0.8rem 2rem' }}
                onClick={() => setStep('done')}
              >
                Claim Mnemonic Badge ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* Done Step */}
      {step === 'done' && selectedHanja && (
        <div className="success-panel" style={{ background: 'white', padding: '3.5rem 2rem', borderRadius: '32px', border: '2px solid var(--line)', textAlign: 'center', animation: 'rise 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div className="badge-spin" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', background: 'radial-gradient(circle, var(--ember-soft), var(--ember))', borderRadius: '50%', color: 'white', fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem', boxShadow: '0 8px 20px rgba(196,92,38,0.3)', border: '4px solid white' }}>
            🎖️
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--ink)' }}>
            Mnemonic Master Unlocked!
          </h2>
          <p style={{ maxWidth: '34rem', margin: '0.85rem auto 2.2rem auto', color: 'var(--ink-soft)', fontSize: '1.08rem', lineHeight: 1.65 }}>
            Congratulations! You have completed the <strong>{selectedHanja.character} ({selectedHanja.reading.split(' ')[0]})</strong> interactive course. 
            This tactile sticker method is why 2x Wadiz crowdfunding campaigns were highly successful.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" style={{ padding: '0.8rem 1.5rem' }} onClick={() => setStep('select')}>
              ★ Try Other Character
            </button>
            <Link className="btn btn-ember btn-pulse" style={{ padding: '0.8rem 2rem' }} to="/shop">
              Get Physical Workbook Kit
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
