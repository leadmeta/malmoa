import { useState, useEffect } from 'react'
import { BOARD_KEY } from '../data/content'
import './InnerPages.css'

export type Comment = {
  id: string
  author: string
  content: string
  createdAt: string
}

export type Post = {
  id: string
  category: 'Notice' | 'Q&A' | 'Study Tips' | 'Success Stories'
  title: string
  author: string
  content: string
  createdAt: string
  comments: Comment[]
  password?: string // for deletion verification
}

const DEFAULT_POSTS: Post[] = [
  {
    id: 'notice-welcome',
    category: 'Notice',
    title: 'Welcome to the Malmoa Global Community!',
    author: 'Malmoa Head Coach',
    content: 'We are thrilled to welcome you to the Malmoa online platform! Use this space to ask questions about Hanja character roots, share your study tips, and post your milestone success stories. Happy learning!',
    createdAt: '2026-07-17 10:00 AM',
    comments: [
      { id: 'c-1', author: 'Liam', content: 'So excited to be here! The Hanja demo is mind-blowing.', createdAt: '2026-07-17 10:15 AM' }
    ]
  },
  {
    id: 'post-sticker-tip',
    category: 'Study Tips',
    title: 'How I memorized 30 characters in 3 days using stickers',
    author: 'Sarah Jenkins',
    content: 'The physical sticker workbook is a game changer! I pasted the visual Hanja stickers on my kitchen cabinet and bathroom mirror. Every time I grabbed a cup or brushed my teeth, I associated the symbol with the English story. Try it out!',
    createdAt: '2026-07-16 02:40 PM',
    comments: [
      { id: 'c-2', author: 'Elena', content: 'Wow, putting them on the mirror is a genius idea. Trying this today!', createdAt: '2026-07-16 03:00 PM' }
    ]
  },
  {
    id: 'post-qa-water',
    category: 'Q&A',
    title: 'Is there a difference in pronunciation between 木 and 水 in compounds?',
    author: 'Hiroshi T.',
    content: 'Hi everyone! In the demo, I saw 木 is read as "mok" (목). When combined in a word like 수목 (su-mok), does the pronunciation shift at all depending on the preceding letters, or is it always rigid?',
    createdAt: '2026-07-15 11:20 AM',
    comments: [
      { id: 'c-3', author: 'Coach Ji-won', content: 'Excellent question Hiroshi! The pronunciation of 木 (목) remains "mok". However, when pronouncing 수목 (su-mok) in fast speech, the liaison or sound flow is very natural because of the simple vowel-consonant structure. Keep up the good work!', createdAt: '2026-07-15 01:10 PM' }
    ]
  }
]

export function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  
  // Write Mode
  const [isWriting, setIsWriting] = useState(false)
  
  // Form states
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<Post['category']>('Q&A')
  const [password, setPassword] = useState('')

  // Comment state
  const [commentAuthor, setCommentAuthor] = useState('')
  const [commentContent, setCommentContent] = useState('')

  // Load posts
  useEffect(() => {
    const saved = localStorage.getItem(BOARD_KEY)
    if (saved) {
      try {
        setPosts(JSON.parse(saved))
      } catch {
        setPosts(DEFAULT_POSTS)
      }
    } else {
      localStorage.setItem(BOARD_KEY, JSON.stringify(DEFAULT_POSTS))
      setPosts(DEFAULT_POSTS)
    }
  }, [])

  // Save helper
  const savePosts = (updated: Post[]) => {
    setPosts(updated)
    localStorage.setItem(BOARD_KEY, JSON.stringify(updated))
  }

  // Filtered posts
  const filteredPosts = posts.filter(p => {
    if (activeCategory === 'All') return true
    return p.category === activeCategory
  })

  // Submit Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !author || !content) return

    const newPost: Post = {
      id: 'post-' + Date.now(),
      category,
      title,
      author,
      content,
      createdAt: new Date().toLocaleString('en-US', { hour12: true }),
      comments: [],
      password
    }

    const updated = [newPost, ...posts]
    savePosts(updated)
    
    // Reset Form
    setTitle('')
    setAuthor('')
    setContent('')
    setCategory('Q&A')
    setPassword('')
    setIsWriting(false)
  }

  // Delete Post
  const handleDeletePost = (id: string, pass: string) => {
    const postToDelete = posts.find(p => p.id === id)
    if (!postToDelete) return

    if (postToDelete.password && postToDelete.password !== pass) {
      alert('Incorrect password!')
      return
    }

    if (window.confirm('Are you sure you want to delete this post?')) {
      const updated = posts.filter(p => p.id !== id)
      savePosts(updated)
      setSelectedPost(null)
    }
  }

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPost || !commentAuthor || !commentContent) return

    const newComment: Comment = {
      id: 'c-' + Date.now(),
      author: commentAuthor,
      content: commentContent,
      createdAt: new Date().toLocaleString('en-US', { hour12: true })
    }

    const updated = posts.map(p => {
      if (p.id === selectedPost.id) {
        const newPost = { ...p, comments: [...p.comments, newComment] }
        setSelectedPost(newPost) // update detailed view
        return newPost
      }
      return p
    })

    savePosts(updated)
    setCommentAuthor('')
    setCommentContent('')
  }

  return (
    <div className="shell page-hero reveal" style={{ paddingBottom: '4rem' }}>
      <p className="section-label">Community Board</p>
      <h1>Global Student Forum</h1>
      <p style={{ maxWidth: '42rem', marginBottom: '2.5rem' }}>
        Have a question about a character? Found a fun mnemonic story? 
        Share your journey and study tip hacks with students from around the world.
      </p>

      {/* Category Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--line)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Notice', 'Q&A', 'Study Tips', 'Success Stories'].map(cat => (
            <button
              key={cat}
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setActiveCategory(cat)
                setSelectedPost(null)
              }}
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.88rem',
                border: activeCategory === cat ? '2px solid var(--teal)' : '1px solid var(--line)',
                background: activeCategory === cat ? 'color-mix(in srgb, var(--teal) 10%, white)' : 'transparent',
                color: activeCategory === cat ? 'var(--teal-deep)' : 'var(--ink-soft)',
                transform: 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        {!isWriting && !selectedPost && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsWriting(true)}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
          >
            + Create New Post
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedPost ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        
        {/* LEFT COLUMN: List or Write Form */}
        <div style={{ display: isWriting ? 'block' : 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isWriting ? (
            <form onSubmit={handleCreatePost} style={{ background: 'color-mix(in srgb, var(--paper-cool) 35%, white)', padding: '2rem 1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'rise 0.3s ease both' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: 0 }}>Create a New Post</h2>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Post['category'])}
                    style={{ padding: '0.6rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'white' }}
                  >
                    <option value="Q&A">Q&A (Questions)</option>
                    <option value="Study Tips">Study Tips (Mnemonic Hacks)</option>
                    <option value="Success Stories">Success Stories (Milestones)</option>
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Your Name</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g., Sarah J."
                    style={{ padding: '0.6rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your topic"
                  style={{ padding: '0.6rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Content</label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your questions, feedback or tips in detail..."
                  style={{ padding: '0.6rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: '240px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Password (for deleting later)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="4-digit pin or password"
                  style={{ padding: '0.6rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}>
                  Post It
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsWriting(false)} style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredPosts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--line)', borderRadius: 'var(--radius)', color: 'var(--ink-soft)' }}>
                  No posts found in this category. Be the first to ask or share!
                </div>
              ) : (
                filteredPosts.map(post => (
                  <article
                    key={post.id}
                    onClick={() => {
                      setSelectedPost(post)
                      setIsWriting(false)
                    }}
                    style={{
                      background: selectedPost?.id === post.id ? 'color-mix(in srgb, var(--paper-cool) 35%, white)' : 'white',
                      border: selectedPost?.id === post.id ? '2px solid var(--teal)' : '1px solid var(--line)',
                      padding: '1.25rem 1.5rem',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    }}
                    className="board-post-card"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 'bold', textTransform: 'uppercase', color: post.category === 'Notice' ? 'var(--ember)' : 'var(--teal)', background: post.category === 'Notice' ? 'color-mix(in srgb, var(--ember) 10%, white)' : 'color-mix(in srgb, var(--teal) 10%, white)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                        {post.category}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>{post.createdAt}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.15rem', margin: '0 0 0.5rem 0', color: 'var(--ink)' }}>
                      {post.title}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                      <span>By <strong>{post.author}</strong></span>
                      <span>💬 {post.comments.length} Comment{post.comments.length !== 1 ? 's' : ''}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Selected Post Details */}
        {selectedPost && (
          <div style={{ animation: 'rise 0.3s ease both', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'color-mix(in srgb, var(--paper-cool) 20%, white)', padding: '2rem 1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', alignSelf: 'start', position: 'sticky', top: 'calc(var(--nav-h) + 1rem)' }}>
            
            {/* Header Details */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--teal)', background: 'color-mix(in srgb, var(--teal) 10%, white)', padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
                  {selectedPost.category}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer', opacity: 0.6 }}
                >
                  ✕
                </button>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', margin: '0.75rem 0 0.5rem 0' }}>
                {selectedPost.title}
              </h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--ink-soft)', borderBottom: '1px solid var(--line)', paddingBottom: '0.75rem' }}>
                <span>Posted by <strong>{selectedPost.author}</strong></span>
                <span>{selectedPost.createdAt}</span>
              </div>
            </div>

            {/* Post Content */}
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65, fontSize: '1.02rem', color: 'var(--ink-soft)' }}>
              {selectedPost.content}
            </p>

            {/* Delete button (if password exists) */}
            {selectedPost.password && (
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    const pin = prompt('Enter post password to delete:')
                    if (pin !== null) handleDeletePost(selectedPost.id, pin)
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid color-mix(in srgb, var(--ember) 35%, transparent)',
                    color: 'var(--ember)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  🗑 Delete My Post
                </button>
              </div>
            )}

            {/* Comment Section */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>
                Comments ({selectedPost.comments.length})
              </h4>
              
              {/* Comment List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {selectedPost.comments.length === 0 ? (
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', fontStyle: 'italic', margin: 0 }}>
                    No comments yet. Write a friendly response!
                  </p>
                ) : (
                  selectedPost.comments.map(c => (
                    <div key={c.id} style={{ background: 'white', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', fontSize: '0.92rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.82rem', color: 'var(--teal-deep)', marginBottom: '0.2rem' }}>
                        <span>{c.author}</span>
                        <span style={{ fontWeight: 'normal', color: 'var(--ink-soft)' }}>{c.createdAt}</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{c.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  required
                  placeholder="Your nickname"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  style={{ padding: '0.45rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}
                />
                <textarea
                  required
                  rows={2}
                  placeholder="Write a comment..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  style={{ padding: '0.45rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', fontSize: '0.9rem', resize: 'vertical' }}
                />
                <button type="submit" className="btn btn-secondary" style={{ padding: '0.45rem', fontSize: '0.85rem', transform: 'none' }}>
                  Submit Comment
                </button>
              </form>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
