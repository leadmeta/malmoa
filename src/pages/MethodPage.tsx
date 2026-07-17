import { Link } from 'react-router-dom'
import './InnerPages.css'

export function MethodPage() {
  return (
    <div className="shell page-hero reveal">
      <p className="section-label">Our Methodology</p>
      <h1>The Wadiz-Proven Mnemonic System</h1>
      <p style={{ maxWidth: '48rem', fontSize: '1.15rem', color: 'var(--ink-soft)' }}>
        Malmoa moves away from boring, repetitive rote memorization. We bind visual shape, phonetic sound, and root meaning together into a single, cohesive narrative. 
        This is the exact methodology that powered our successful crowdfunding campaigns on Wadiz, delivering high-speed vocabulary acquisition.
      </p>

      <div className="method-grid section" style={{ marginTop: '2rem' }}>
        <article className="method-card">
          <h2>01 · Visual association</h2>
          <p>
            Instead of abstract symbols, every character is introduced as a concrete image. 
            For example, the character <strong>木</strong> is introduced as a towering tree with roots and branches. 
            By visualizing before memorizing, the character forms a permanent anchor in your brain.
          </p>
        </article>
        <article className="method-card">
          <h2>02 · Mnemonic stories</h2>
          <p>
            A short, memorable English story connects the visual shape to the sound and meaning. 
            This narrative glue allows you to recall characters like a movie scene, rather than relying on flashcards. 
            Just reading the story once is often enough to commit the character to memory.
          </p>
        </article>
        <article className="method-card">
          <h2>03 · The interactive sticker loop</h2>
          <p>
            Active retrieval is the key to long-term memory. 
            In our physical workbooks, students use 170+ color-coded stickers to label Hanja roots. 
            On our web/app platform, this is simulated through interactive matching puzzles that turn passive understanding into active vocabulary recall.
          </p>
        </article>
        <article className="method-card">
          <h2>04 · Vocabulary explosion</h2>
          <p>
            Once a Hanja root is mastered, it becomes a multiplier. 
            Learning <strong>木 (mok)</strong> allows you to immediately understand words like <em>Mok-jae</em> (timber), <em>Mok-yo-il</em> (Thursday), and <em>Beol-mok</em> (logging). 
            You will start decoding complex, multi-syllable Korean words on sight without a dictionary.
          </p>
        </article>
      </div>

      <section className="section textbook-details">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>
          What is in the Malmoa Mnemonic Kit?
        </h2>
        <p className="lede" style={{ marginBottom: '2rem' }}>
          Our physical workbook package, funded 2 times by hundreds of enthusiastic backers, is built for tactile, active learning.
        </p>

        {/* Real Wadiz Textbook Image Asset */}
        <div style={{ marginBottom: '2.5rem', maxWidth: '640px' }}>
          <img
            src="/wadiz-assets/asset1.jpg"
            alt="Malmoa Mnemonic Textbook & Stickers Kit"
            style={{ width: '100%', height: 'auto', borderRadius: '24px', border: '1px solid var(--line)', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'color-mix(in srgb, var(--paper-cool) 40%, white)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>4 Core Workbooks</h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)' }}>
              Step-by-step guidance from basic Hangul sounds to complex business and academic terminology, structured over 12 weeks.
            </p>
          </div>
          <div style={{ background: 'color-mix(in srgb, var(--paper-cool) 40%, white)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>170 Mnemonic Stickers</h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)' }}>
              Colorful, high-quality stickers containing the visual associations to be matched directly onto the workbook pages.
            </p>
          </div>
          <div style={{ background: 'color-mix(in srgb, var(--paper-cool) 40%, white)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Exclusive bookmarks & PDFs</h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)' }}>
              Quick-reference study bookmarks and complementary PDF files featuring dictionary charts and flashcard materials.
            </p>
          </div>
        </div>
      </section>

      <blockquote className="quote-band" style={{ marginTop: '3rem' }}>
        <p>
          “Our mission since 2020 has been to break down barriers to intermediate Korean. By teaching the visual origin of words, we help learners build a lasting connection with the language and culture.”
        </p>
        <cite>Malmoa Core Development Team · Wadiz Campaigns</cite>
      </blockquote>

      <div className="hero-actions" style={{ marginTop: '3rem', paddingBottom: '3rem' }}>
        <Link className="btn btn-primary" to="/lesson/hanja-demo">
          Try Interactive Hanja Demo
        </Link>
        <Link className="btn btn-secondary" to="/shop">
          Visit the Store
        </Link>
      </div>
    </div>
  )
}
