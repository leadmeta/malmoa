import { useState } from 'react'
import { HangulDemoPage } from './HangulDemoPage'
import { HanjaDemoPage } from './HanjaDemoPage'
import './InnerPages.css'

type DemoTab = 'hangul' | 'hanja'

export function DemoHubPage() {
  const [activeTab, setActiveTab] = useState<DemoTab>('hangul')

  return (
    <div className="shell reveal" style={{ paddingBottom: '4rem', marginTop: '1.5rem' }}>
      {/* Sub tabs selector: Positioned immediately below header navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1px', marginBottom: '2rem', overflowX: 'auto' }}>
        {(['hangul', 'hanja'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab ? 'white' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid var(--teal)' : '3px solid transparent',
              color: activeTab === tab ? 'var(--teal-deep)' : 'var(--ink-soft)',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontSize: '0.85rem'
            }}
          >
            {tab === 'hangul' && '🧠 Hangul Consonant Game'}
            {tab === 'hanja' && '✨ Hanja Mnemonic Bridge'}
          </button>
        ))}
      </div>

      {/* Render selected demo zone component */}
      <div style={{ animation: 'rise 0.4s ease both' }}>
        {activeTab === 'hangul' && <HangulDemoPage />}
        {activeTab === 'hanja' && <HanjaDemoPage />}
      </div>
    </div>
  )
}
