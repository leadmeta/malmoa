import { useState, useEffect } from 'react'
import { coachingTeachers, RANK_KEY, type Ranker } from '../data/content'
import './InnerPages.css'

type OrderItem = {
  id: string
  item: string
  buyer: string
  status: string
  date: string
}

type CoachingOrder = {
  id: string
  student: string
  teacherId: string // assigned teacher
  status: string
  date: string
}

type LocalUser = {
  name: string
  xp: number
  tier: 'Beginner' | 'Intermediate' | 'Advanced'
}

export function AdminPage() {
  const [users, setUsers] = useState<LocalUser[]>([])
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [coachingOrders, setCoachingOrders] = useState<CoachingOrder[]>([])

  // Load Admin Data from LocalStorage safely
  const loadAdminData = () => {
    // 1. Load users from rankings safely
    const savedRank = localStorage.getItem(RANK_KEY)
    let tempUsers: LocalUser[] = []
    if (savedRank) {
      try {
        const parsed = JSON.parse(savedRank)
        if (Array.isArray(parsed)) {
          tempUsers = parsed.map((p: Ranker) => {
            let t: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner'
            if ((p.xp || 0) > 800) t = 'Advanced'
            else if ((p.xp || 0) > 400) t = 'Intermediate'
            return {
              name: p.name || 'Anonymous Student',
              xp: p.xp || 0,
              tier: t
            }
          })
        }
      } catch {
        // Ignore
      }
    }
    
    // Also include current user safely
    const savedProfile = localStorage.getItem('malmoa-user-profile')
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        if (parsed && parsed.name) {
          const exists = tempUsers.some((u) => u.name.toLowerCase() === parsed.name.toLowerCase())
          if (!exists) {
            tempUsers.push({
              name: parsed.name,
              xp: parsed.xp || 0,
              tier: parsed.tier || 'Beginner'
            })
          }
        }
      } catch {
        // Ignore
      }
    }
    setUsers(tempUsers)

    // 2. Load textbook orders safely
    const savedOrders = localStorage.getItem('malmoa-orders')
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders)
        if (Array.isArray(parsed)) {
          setOrders(parsed)
        } else {
          setOrders([])
        }
      } catch {
        setOrders([])
      }
    }

    // 3. Load coaching requests safely
    const savedCoaching = localStorage.getItem('malmoa-coaching-orders')
    if (savedCoaching) {
      try {
        const parsed = JSON.parse(savedCoaching)
        if (Array.isArray(parsed)) {
          setCoachingOrders(parsed)
        } else {
          setCoachingOrders([])
        }
      } catch {
        setCoachingOrders([])
      }
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  // Update user license tier safely
  const handleUpdateUserTier = (name: string, nextTier: 'Beginner' | 'Intermediate' | 'Advanced') => {
    // Update local state
    setUsers((prev) => prev.map((u) => u.name === name ? { ...u, tier: nextTier } : u))

    // If it is the current user, update profile safely
    const savedProfile = localStorage.getItem('malmoa-user-profile')
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        if (parsed && parsed.name === name) {
          parsed.tier = nextTier
          localStorage.setItem('malmoa-user-profile', JSON.stringify(parsed))
        }
      } catch {
        // Ignore
      }
    }
    alert(`Success: ${name}'s learning status updated to: ${nextTier}`)
  }

  // Update shipping status of textbook safely
  const handleUpdateShipping = (orderId: string, nextStatus: string) => {
    const updated = orders.map((o) => o.id === orderId ? { ...o, status: nextStatus } : o)
    setOrders(updated)
    localStorage.setItem('malmoa-orders', JSON.stringify(updated))
  }

  // Match coaching teacher safely
  const handleAssignTeacher = (coachingId: string, teacherId: string) => {
    const updated = coachingOrders.map((c) => {
      if (c.id === coachingId) {
        return {
          ...c,
          teacherId: teacherId,
          status: 'Teacher Matched'
        }
      }
      return c
    })
    setCoachingOrders(updated)
    localStorage.setItem('malmoa-coaching-orders', JSON.stringify(updated))
    alert(`Tutor assigned successfully! Student notified.`)
  }

  // --- 1:1 Live Mock Chat Sandbox ---
  const [chatSelectedOrder, setChatSelectedOrder] = useState<CoachingOrder | null>(null)
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'System', text: 'Select an active matched coaching order above to launch lesson chat.' }
  ])
  const [chatInput, setChatInput] = useState('')

  const handleStartChat = (order: CoachingOrder) => {
    if (!order.teacherId || order.teacherId === 'unassigned') {
      alert('Please assign a coaching teacher first before starting the chat!')
      return
    }
    const teacher = coachingTeachers.find((t) => t.id === order.teacherId)
    setChatSelectedOrder(order)
    setChatMessages([
      { sender: 'System', text: `1:1 Lesson Chat Connected with Tutor: ${teacher?.name || 'Tutor'}` },
      { sender: teacher?.name || 'Tutor', text: `안녕하세요 ${order.student || 'Student'}! I looked at your Hangul writing sheets. Let me know if you need handwriting coaching!` }
    ])
  }

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || !chatSelectedOrder) return

    const studentName = chatSelectedOrder.student || 'Student'
    const teacher = coachingTeachers.find((t) => t.id === chatSelectedOrder.teacherId)
    const tutorName = teacher?.name || 'Tutor'

    const newMsgs = [...chatMessages, { sender: studentName, text: chatInput.trim() }]
    setChatMessages(newMsgs)
    setChatInput('')

    // Simulated automated teacher reply logic
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: tutorName, text: `Excellent work! Your strokes look incredibly well-balanced. Keep up the Mnemonic practice! 👍` }
      ])
    }, 1500)
  }

  return (
    <div className="shell page-hero reveal" style={{ paddingBottom: '4rem' }}>
      <p className="section-label">Management Desk</p>
      <h1>Administrator Control Panel</h1>
      <p style={{ maxWidth: '42rem', color: 'var(--ink-soft)' }}>
        Manage registered students, process book shipping packages, assign certified native teachers to coaching requests, and monitor classroom chat rooms.
      </p>

      {/* Grid containing Member Management & Logistics */}
      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginTop: '2rem' }}>
        
        {/* Panel 1: Student Database */}
        <div className="admin-card" style={{ background: 'white', padding: '2rem', border: '1px solid var(--line)', borderRadius: '24px' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold' }}>👥 Student Membership Database</h3>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.2rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0' }}>Student</th>
                <th style={{ padding: '0.75rem 0' }}>Score</th>
                <th style={{ padding: '0.75rem 0' }}>Course Tier</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.name} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '0.75rem 0' }}><strong>{u.name || 'Unknown'}</strong></td>
                  <td style={{ padding: '0.75rem 0' }}>{u.xp || 0} XP</td>
                  <td style={{ padding: '0.75rem 0' }}>
                    <select
                      value={u.tier || 'Beginner'}
                      onChange={(e) => handleUpdateUserTier(u.name, e.target.value as any)}
                      style={{ padding: '0.2rem 0.5rem', border: '1px solid var(--line)', borderRadius: '6px' }}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel 2: Textbook Shipments */}
        <div className="admin-card" style={{ background: 'white', padding: '2rem', border: '1px solid var(--line)', borderRadius: '24px' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 'bold' }}>📦 Printed Textbook Shipping Queue</h3>
          {orders.length === 0 ? (
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', marginTop: '1.5rem' }}>No textbook package orders placed yet.</p>
          ) : (
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.2rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0' }}>Recipient</th>
                  <th style={{ padding: '0.75rem 0' }}>Item</th>
                  <th style={{ padding: '0.75rem 0' }}>Logistics Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.75rem 0' }}>{o.buyer || 'Unknown'}</td>
                    <td style={{ padding: '0.75rem 0' }}><span style={{ fontSize: '0.8rem' }}>{(o.item || 'No Item Description').slice(0, 15)}...</span></td>
                    <td style={{ padding: '0.75rem 0' }}>
                      <select
                        value={o.status || 'Processing'}
                        onChange={(e) => handleUpdateShipping(o.id, e.target.value)}
                        style={{ padding: '0.2rem 0.5rem', border: '1px solid var(--line)', borderRadius: '6px' }}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Shipped">Shipped</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Section 2: Tutor Matchmaker Panel */}
      <div style={{ marginTop: '2.5rem', background: 'white', padding: '2rem', border: '1px solid var(--line)', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>👩‍🏫 Native Tutor Matchmaking Queue</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
          Assign certified tutors from our pool to coaching orders to activate student 1:1 chats.
        </p>

        {coachingOrders.length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>No tutor coaching sessions ordered yet.</p>
        ) : (
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0' }}>Student</th>
                <th style={{ padding: '0.75rem 0' }}>Request Date</th>
                <th style={{ padding: '0.75rem 0' }}>Assigned Tutor</th>
                <th style={{ padding: '0.75rem 0' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {coachingOrders.map((c) => {
                const matchedTeacher = coachingTeachers.find((t) => t.id === c.teacherId)
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.75rem 0' }}><strong>{c.student || 'Unknown'}</strong></td>
                    <td style={{ padding: '0.75rem 0' }}>{c.date || '-'}</td>
                    <td style={{ padding: '0.75rem 0' }}>
                      {(!c.teacherId || c.teacherId === 'unassigned') ? (
                        <select
                          defaultValue="unassigned"
                          onChange={(e) => handleAssignTeacher(c.id, e.target.value)}
                          style={{ padding: '0.35rem 0.75rem', border: '1px solid var(--line)', borderRadius: '8px' }}
                        >
                          <option value="unassigned" disabled>-- Choose Teacher --</option>
                          {coachingTeachers.map((t) => (
                            <option key={t.id} value={t.id}>{t.name} (Rating: {t.rating})</option>
                          ))}
                        </select>
                      ) : (
                        <span>{matchedTeacher?.name} ({matchedTeacher?.specialty})</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 0' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                        disabled={!c.teacherId || c.teacherId === 'unassigned'}
                        onClick={() => handleStartChat(c)}
                      >
                        💬 Chatroom
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Section 3: Live Coaching Chat sandbox simulator */}
      {chatSelectedOrder && (
        <div style={{ marginTop: '2.5rem', background: '#0f172a', padding: '2.5rem 2rem', border: '2px solid var(--teal)', borderRadius: '24px', color: 'white', animation: 'rise 0.4s ease both' }}>
          <h3 style={{ margin: '0 0 0.25rem 0', color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 'bold' }}>
            💬 1:1 Live Lesson Chat Simulator
          </h3>
          <p style={{ margin: '0 0 1.5rem 0', color: '#94a3b8', fontSize: '0.88rem' }}>
            Interactive classroom sandbox showing teacher/student message flow for: <strong>{chatSelectedOrder.student}</strong>
          </p>

          {/* Chat Bubble Container */}
          <div style={{ background: '#020617', borderRadius: '16px', padding: '1.5rem', minHeight: '200px', maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #1e293b' }}>
            {chatMessages.map((msg, i) => {
              const isTutor = msg.sender !== chatSelectedOrder.student && msg.sender !== 'System'
              const isSystem = msg.sender === 'System'

              let bubbleBg = '#1e293b'
              let align = 'flex-start'
              let textColor = 'white'

              if (isSystem) {
                bubbleBg = 'transparent'
                align = 'center'
                textColor = '#64748b'
              } else if (!isTutor) {
                // Student bubble
                bubbleBg = 'var(--teal-deep)'
                align = 'flex-end'
              }

              return (
                <div key={i} style={{ alignSelf: align, maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  {!isSystem && (
                    <span style={{ fontSize: '0.72rem', color: '#64748b', alignSelf: !isTutor ? 'flex-end' : 'flex-start' }}>
                      {msg.sender}
                    </span>
                  )}
                  <div style={{ background: bubbleBg, padding: '0.65rem 1rem', borderRadius: '12px', fontSize: '0.9rem', color: textColor, border: isSystem ? 'none' : '1px solid #1e293b' }}>
                    {msg.text}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Input message form */}
          <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <input
              type="text"
              placeholder="Send message to teacher..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #1e293b', borderRadius: '12px', background: '#020617', color: 'white' }}
            />
            <button type="submit" className="edu-btn-3d" style={{ padding: '0.75rem 2rem', fontSize: '0.9rem', borderRadius: '12px' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
