import { useState, useEffect } from 'react'
import { newsArticles, RANK_KEY, type NewsArticle, type Ranker } from '../data/content'
import './InnerPages.css'

export function NewsPage() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle>(newsArticles[0])
  const [activeVocab, setActiveVocab] = useState<{ word: string; reading: string; meaning: string; story: string } | null>(null)
  
  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [submittedQuiz, setSubmittedQuiz] = useState(false)
  const [completedArticles, setCompletedArticles] = useState<Record<string, boolean>>({})
  const [xpEarned, setXpEarned] = useState(0)

  useEffect(() => {
    // Load completed quizzes
    const saved = localStorage.getItem('malmoa-completed-news')
    if (saved) {
      try {
        setCompletedArticles(JSON.parse(saved))
      } catch {
        // Ignore
      }
    }
  }, [])

  const handleArticleSelect = (article: NewsArticle) => {
    setSelectedArticle(article)
    setActiveVocab(null)
    setQuizAnswers({})
    setSubmittedQuiz(false)
    setXpEarned(0)
  }

  const handleVocabClick = (word: string) => {
    const found = selectedArticle.vocabList.find((v) => v.word === word)
    if (found) {
      setActiveVocab(found)
    }
  }

  const handleQuizAnswer = (qIdx: number, choice: string) => {
    if (submittedQuiz) return
    setQuizAnswers((prev) => ({
      ...prev,
      [qIdx]: choice,
    }))
  }

  const handleSubmitQuiz = () => {
    if (submittedQuiz) return
    setSubmittedQuiz(true)

    // Calculate score
    let correctCount = 0
    selectedArticle.quizzes.forEach((quiz, idx) => {
      if (quizAnswers[idx] === quiz.answer) {
        correctCount++
      }
    })

    const earned = correctCount * 50 // 50 XP per correct answer
    setXpEarned(earned)

    if (earned > 0 && !completedArticles[selectedArticle.id]) {
      // Save completed status
      const updatedCompleted = { ...completedArticles, [selectedArticle.id]: true }
      setCompletedArticles(updatedCompleted)
      localStorage.setItem('malmoa-completed-news', JSON.stringify(updatedCompleted))

      // Update User XP in profile
      const savedUser = localStorage.getItem('malmoa-user-profile')
      let userProfile = { name: 'Anonymous Student', xp: 100 }
      if (savedUser) {
        try {
          userProfile = JSON.parse(savedUser)
        } catch {
          // Ignore
        }
      }
      userProfile.xp += earned
      localStorage.setItem('malmoa-user-profile', JSON.stringify(userProfile))

      // Update Rankings
      const savedRankings = localStorage.getItem(RANK_KEY)
      if (savedRankings) {
        try {
          const list: Ranker[] = JSON.parse(savedRankings)
          const userIdx = list.findIndex((r) => r.name.toLowerCase() === userProfile.name.toLowerCase())
          if (userIdx !== -1) {
            list[userIdx].xp = userProfile.xp
          } else {
            list.push({
              name: userProfile.name,
              xp: userProfile.xp,
              badge: 'You 👑',
            })
          }
          list.sort((a, b) => b.xp - a.xp)
          localStorage.setItem(RANK_KEY, JSON.stringify(list))
        } catch {
          // Ignore
        }
      }
    }
  }

  // Helper to split text by Hanja vocabulary words so we can render them clickable
  const renderInteractiveText = (text: string, vocabList: { word: string }[]) => {
    const words = vocabList.map((v) => v.word)
    if (words.length === 0) return <span>{text}</span>

    const regex = new RegExp(`(${words.join('|')})`, 'g')
    const parts = text.split(regex)

    return parts.map((part, idx) => {
      if (words.includes(part)) {
        return (
          <span
            key={idx}
            className="vocab-highlight"
            onClick={() => handleVocabClick(part)}
            title="Click to reveal Hanja Mnemonic story"
          >
            {part}
          </span>
        )
      }
      return <span key={idx}>{part}</span>
    })
  }

  return (
    <div className="shell page-hero reveal" style={{ paddingBottom: '4rem' }}>
      <p className="section-label">Read & Learn</p>
      <h1>Korean News Vocab Bridge</h1>
      <p style={{ maxWidth: '44rem', color: 'var(--ink-soft)' }}>
        Read real-world news articles. Click on any highlighted <strong>Hanja word</strong> to instantly decode its pictorial roots and story mnemonic. Solve the quiz at the end to claim your XP!
      </p>

      {/* Grid of news list and detailed view */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 0.35fr) 1fr', gap: '2.5rem', marginTop: '2rem' }}>
        
        {/* Left Side: Article List */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {newsArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => handleArticleSelect(article)}
              style={{
                padding: '1.25rem',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                background: selectedArticle.id === article.id ? 'white' : 'transparent',
                borderColor: selectedArticle.id === article.id ? 'var(--teal)' : 'var(--line)',
                boxShadow: selectedArticle.id === article.id ? '0 4px 15px rgba(0,0,0,0.02)' : 'none',
                transition: 'all 0.2s ease',
              }}
              className="board-post-card"
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', display: 'block', marginBottom: '0.25rem' }}>
                {article.date}
              </span>
              <strong style={{ fontSize: '0.98rem', display: 'block', lineHeight: 1.4 }}>
                {article.title}
              </strong>
              {completedArticles[article.id] && (
                <span style={{ fontSize: '0.75rem', background: 'color-mix(in srgb, var(--teal) 10%, white)', color: 'var(--teal-deep)', padding: '0.15rem 0.5rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.5rem', fontWeight: 'bold' }}>
                  ✓ XP Claimed
                </span>
              )}
            </div>
          ))}
        </aside>

        {/* Right Side: Detailed Article Reader */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <article style={{ background: 'white', border: '1px solid var(--line)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Published: {selectedArticle.date}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '0.5rem 0 1.5rem 0' }}>{selectedArticle.title}</h2>

            {/* Vocab Details Tooltip (Absolute overlay on click) */}
            {activeVocab && (
              <div style={{ background: 'color-mix(in srgb, var(--teal) 8%, white)', border: '2px solid var(--teal)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', position: 'relative', animation: 'rise 0.3s ease both' }}>
                <button
                  type="button"
                  onClick={() => setActiveVocab(null)}
                  style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                >
                  ×
                </button>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>{activeVocab.word}</span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--teal-deep)', fontWeight: 'bold' }}>{activeVocab.reading}</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Core Meaning: {activeVocab.meaning}</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{activeVocab.story}"
                </p>
              </div>
            )}

            {/* Interactive Korean Text */}
            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: 'var(--teal-deep)' }}>Korean Text (Tap highlighted words to study):</h4>
            <div className="news-korean-text" style={{ marginBottom: '1.5rem' }}>
              {renderInteractiveText(selectedArticle.koreanText, selectedArticle.vocabList)}
            </div>

            {/* English Translation */}
            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: 'var(--ink-soft)' }}>English Translation:</h4>
            <div style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--ink-soft)', fontStyle: 'italic', padding: '1rem 1.5rem', borderLeft: '3px solid var(--line)', background: 'var(--paper-cool)', borderRadius: 'var(--radius)' }}>
              {selectedArticle.englishTranslation}
            </div>
          </article>

          {/* Comprehension Quiz Section */}
          <section style={{ background: 'white', border: '1px solid var(--line)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '0.5rem' }}>📰 Comprehension Check</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Test your understanding of the Hanja 어원 (roots) discussed in the article to claim your XP reward.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {selectedArticle.quizzes.map((quiz, qIdx) => (
                <div key={qIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', margin: 0 }}>
                    Q{qIdx + 1}: {quiz.question}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {quiz.choices.map((choice) => {
                      const isChosen = quizAnswers[qIdx] === choice
                      let bg = 'white'
                      let border = '1px solid var(--line)'

                      if (submittedQuiz) {
                        if (choice === quiz.answer) {
                          bg = 'color-mix(in srgb, var(--teal) 15%, white)'
                          border = '2px solid var(--teal)'
                        } else if (isChosen) {
                          bg = 'color-mix(in srgb, var(--ember) 15%, white)'
                          border = '2px solid var(--ember)'
                        }
                      } else if (isChosen) {
                        bg = 'var(--paper-cool)'
                        border = '2px solid var(--teal)'
                      }

                      return (
                        <button
                          key={choice}
                          type="button"
                          disabled={submittedQuiz}
                          onClick={() => handleQuizAnswer(qIdx, choice)}
                          style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius)',
                            textAlign: 'left',
                            background: bg,
                            border: border,
                            cursor: submittedQuiz ? 'default' : 'pointer',
                            fontSize: '0.95rem',
                          }}
                        >
                          {choice}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!submittedQuiz ? (
              <button
                type="button"
                className="btn btn-primary btn-pulse"
                style={{ marginTop: '2rem', padding: '0.8rem 2.5rem' }}
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length < selectedArticle.quizzes.length}
              >
                Submit Answers
              </button>
            ) : (
              <div style={{ marginTop: '2rem', animation: 'rise 0.3s ease both' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start', background: 'color-mix(in srgb, var(--teal) 8%, white)', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid var(--teal)' }}>
                  <span style={{ fontSize: '1.8rem' }}>🎖️</span>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontWeight: 'bold', color: 'var(--teal-deep)' }}>
                      Quiz Graded: +{xpEarned} XP
                    </h4>
                    <p style={{ margin: 0, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                      {xpEarned > 0
                        ? `Congratulations! You received ${xpEarned} XP points. Your profile and global rankings have been updated.`
                        : `All answers evaluated. Register a nickname in the Rankings page to claim points.`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
