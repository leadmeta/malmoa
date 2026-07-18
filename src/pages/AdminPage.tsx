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

  // Load Admin Data from LocalStorage
  const loadAdminData = () => {
    // 1. Load users from rankings
    const savedRank = localStorage.getItem(RANK_KEY)
    let tempUsers: LocalUser[] = []
    if (savedRank) {
      try {
        const parsed: Ranker[] = JSON.parse(savedRank)
        tempUsers = parsed.map((p) => {
          let t: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner'
          if (p.xp > 800) t = 'Advanced'
          else if (p.xp > 400) t = 'Intermediate'
          return {
            name: p.name,
            xp: p.xp,
            tier: t
          }
        })
      } catch {
        // Ignore
      }
    }
    
    // Also include current user
    const savedProfile = localStorage.getItem('malmoa-user-profile')
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        const exists = tempUsers.some((u) => u.name.toLowerCase() === parsed.name.toLowerCase())
        if (!exists) {
          tempUsers.push({
            name: parsed.name,
            xp: parsed.xp,
            tier: parsed.tier || 'Beginner'
          })
        }
      } catch {
        // Ignore
      }
    }
    setUsers(tempUsers)

    // 2. Load textbook orders
    const savedOrders = localStorage.getItem('malmoa-orders')
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch {
        setOrders([])
      }
    }

    // 3. Load coaching requests
    const savedCoaching = localStorage.getItem('malmoa-coaching-orders')
    if (savedCoaching) {
      try {
        setCoachingOrders(JSON.parse(savedCoaching))
      } catch {
        setCoachingOrders([])
      }
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  // Update user license tier
  const handleUpdateUserTier = (name: string, nextTier: 'Beginner' | 'Intermediate' | 'Advanced') => {
    // Update local state
    setUsers((prev) => prev.map((u) => u.name === name ? { ...u, tier: nextTier } : u))

    // If it is the current user, update profile
    const savedProfile = localStorage.getItem('malmoa-user-profile')
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        if (parsed.name === name) {
          parsed.tier = nextTier
          localStorage.setItem('malmoa-user-profile', JSON.stringify(parsed))
        }
      } catch {
        // Ignore
      }
    }
    alert(`Success: ${name}'s learning status updated to: ${nextTier}`)
  }

  // Update shipping status of textbook
  const handleUpdateShipping = (orderId: string, nextStatus: string) => {
    const updated = orders.map((o) => o.id === orderId ? { ...o, status: nextStatus } : o)
    setOrders(updated)
    localStorage.setItem('malmoa-orders', JSON.stringify(updated))
  }

  // Match coaching teacher
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
    if (order.teacherId === 'unassigned') {
      alert('Please assign a coaching teacher first before starting the chat!')
      return
    }
    const teacher = coachingTeachers.find((t) => t.id === order.teacherId)
    setChatSelectedOrder(order)
    setChatMessages([
      { sender: 'System', text: `1:1 Lesson Chat Connected with Tutor: ${teacher?.name}` },
      { sender: teacher?.name || 'Tutor', text: `안녕하세요 ${order.student}! I looked at your Hangul writing sheets. Let me know if you need handwriting coaching!` }
    ])
  }

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || !chatSelectedOrder) return

    const studentName = chatSelectedOrder.student
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
      <div className="admin-grid">
        
        {/* Panel 1: Student Database */}
        <div className="admin-card">
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>👥 Student Membership Database</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Score</th>
                <th>Course Tier</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.name}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.xp} XP</td>
                  <td>
                    <select
                      value={u.tier}
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
        <div className="admin-card">
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>📦 Printed Textbook Shipping Queue</h3>
          {orders.length === 0 ? (
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', marginTop: '1.5rem' }}>No textbook package orders placed yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Item</th>
                  <th>Logistics Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.buyer}</td>
                    <td><span style={{ fontSize: '0.8rem' }}>{o.item.slice(0, 15)}...</span></td>
                    <td>
                      <select
                        value={o.status}
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
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.5rem' }}>👩‍🏫 Native Tutor Matchmaking Queue</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
          Assign certified tutors from our pool to coaching orders to activate student 1:1 chats.
        </p>

        {coachingOrders.length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>No tutor coaching sessions ordered yet.</p>
        ) : (
          <table className="admin-table" style={{ fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Request Date</th>
                <th>Assigned Tutor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {coachingOrders.map((c) => {
                const matchedTeacher = coachingTeachers.find((t) => t.id === c.teacherId)
                return (
                  <tr key={c.id}>
                    <td><strong>{c.student}</strong></td>
                    <td>{c.date}</td>
                    <td>
                      {c.teacherId === 'unassigned' ? (
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
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                        disabled={c.teacherId === 'unassigned'}
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
        <div style={{ marginTop: '2.5rem', background: '#1a2332', padding: '2rem', border: '2px solid var(--teal)', borderRadius: '24px', color: 'white', animation: 'rise 0.4s ease both' }}>
          <h3 style={{ margin: '0 0 0.25rem 0', color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.35rem' }}>
            💬 1:1 Live Lesson Chat Simulator
          </h3>
          <p style={{ margin: '0 0 1.5rem 0', color: '#a0aab8', fontSize: '0.85rem' }}>
            Interactive classroom sandbox showing teacher/student message flow for: <strong>{chatSelectedOrder.student}</strong>
          </p>

          {/* Chat Bubble Container */}
          <div style={{ background: '#0e1621', borderRadius: '16px', padding: '1.5rem', minHeight: '200px', maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #233143' }}>
            {chatMessages.map((msg, i) => {
              const isTutor = msg.sender !== chatSelectedOrder.student && msg.sender !== 'System'
              const isSystem = msg.sender === 'System'

              let bubbleBg = '#182533'
              let align = 'flex-start'
              let textColor = 'white'

              if (isSystem) {
                bubbleBg = 'transparent'
                align = 'center'
                textColor = '#708499'
              } else if (!isTutor) {
                // Student bubble
                bubbleBg = 'var(--teal-deep)'
                align = 'flex-end'
              }

              return (
                <div key={i} style={{ alignSelf: align, maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  {!isSystem && (
                    <span style={{ fontSize: '0.72rem', color: '#708499', alignSelf: !isTutor ? 'flex-end' : 'flex-start' }}>
                      {msg.sender}
                    </span>
                  )}
                  <div style={{ background: bubbleBg, padding: '0.65rem 1rem', borderRadius: '12px', fontSize: '0.9rem', color: textColor, border: isSystem ? 'none' : '1px solid #233143' }}>
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
              style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #233143', borderRadius: '12px', background: '#0e1621', color: 'white' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
