import { Link } from 'react-router-dom'
import './InnerPages.css'

export function MethodPage() {
  return (
    <div className="shell page-hero reveal">
      <p className="section-label">Method</p>
      <h1>Pictures, stickers, and stories</h1>
      <p>
        Malmoa improves on dry drill-based materials. We bind shape, sound, and
        meaning inside a memorable scene — the same approach that powered our
        Wadiz Hanja campaign, now extended to Hangul foundations for global
        learners.
      </p>

      <div className="method-grid section">
        <article>
          <h2>01 · Visual anchor</h2>
          <p>
            Every letter or character gets a concrete image: a gun for ㄱ, a
            nose for ㄴ, a tree trunk for 木. You see before you memorize.
          </p>
        </article>
        <article>
          <h2>02 · Narrative glue</h2>
          <p>
            A short story sequences the images so recall is cinematic, not a
            flashcard stack. Listening once is often enough to lock the set.
          </p>
        </article>
        <article>
          <h2>03 · Sticker / practice loop</h2>
          <p>
            Physical stickers in the textbook and on-screen matching in our
            demos force active retrieval — the step that turns “I get it” into
            “I own it.”
          </p>
        </article>
        <article>
          <h2>04 · Literacy arc</h2>
          <p>
            Hangul gets you reading Korean phonetically. Hanja opens families of
            words and deeper literacy — vocabulary, nuance, and cultural
            reading power.
          </p>
        </article>
      </div>

      <blockquote className="quote-band">
        <p>
          “Helping more foreigners learn Korean more effectively and quickly —
          and enjoy Korean culture better.”
        </p>
        <cite>Malmoa maker story · Wadiz 2025</cite>
      </blockquote>

      <div className="hero-actions" style={{ marginTop: '2rem' }}>
        <Link className="btn btn-primary" to="/lesson/hanja-demo">
          Try the Hanja demo
        </Link>
        <Link className="btn btn-secondary" to="/program">
          See the full path
        </Link>
      </div>
    </div>
  )
}
