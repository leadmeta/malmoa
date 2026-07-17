import { useState, useEffect } from 'react'
import { ORDERS_KEY } from '../data/content'
import './InnerPages.css'

export type Order = {
  id: string
  productName: string
  price: string
  customerName: string
  customerEmail: string
  shippingAddress: string
  createdAt: string
}

export function ShopPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; price: string } | null>(null)
  
  // Checkout Modal State
  const [showCheckout, setShowCheckout] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form input states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  // Load order history
  useEffect(() => {
    const saved = localStorage.getItem(ORDERS_KEY)
    if (saved) {
      try {
        setOrders(JSON.parse(saved))
      } catch {
        setOrders([])
      }
    }
  }, [])

  const handleOpenCheckout = (product: { name: string; price: string }) => {
    setSelectedProduct(product)
    setShowCheckout(true)
    setIsSuccess(false)
    setIsProcessing(false)
  }

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !address || !cardNumber) return

    setIsProcessing(true)

    // Simulate Payment Processing (Stripe/PayPal style)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)

      const newOrder: Order = {
        id: 'ord-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        productName: selectedProduct?.name || 'Mnemonic Kit',
        price: selectedProduct?.price || '$0.00',
        customerName: name,
        customerEmail: email,
        shippingAddress: `${address}, ${city}, ${zipCode}, ${country}`,
        createdAt: new Date().toLocaleString('en-US'),
      }

      const updated = [newOrder, ...orders]
      setOrders(updated)
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updated))

      // Clear Form
      setName('')
      setEmail('')
      setAddress('')
      setCity('')
      setCountry('')
      setZipCode('')
      setCardNumber('')
      setCardExpiry('')
      setCardCvc('')
    }, 2500)
  }

  return (
    <div className="shell page-hero reveal" style={{ paddingBottom: '4rem' }}>
      <p className="section-label">Official Store</p>
      <h1>Get the Malmoa Kits</h1>
      <p style={{ maxWidth: '44rem', marginBottom: '3rem' }}>
        Purchase our visual workbook package and unlock interactive coaching. 
        Start multiplying your Korean vocabulary today. Global shipping available.
      </p>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Product 1 */}
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', position: 'relative' }}>
          <div>
            <div style={{ display: 'inline-block', background: 'color-mix(in srgb, var(--teal) 12%, white)', color: 'var(--teal-deep)', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase' }}>
              Wadiz Bestseller
            </div>
            <div style={{ margin: '0.5rem 0 1.25rem 0' }}>
              <img
                src="/wadiz-assets/asset1.jpg"
                alt="Wadiz Mnemonic Workbook Package"
                style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--line)' }}
              />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', margin: '0 0 0.5rem 0' }}>
              Mnemonic Workbook Package
            </h3>
            <p style={{ fontSize: '1.85rem', fontWeight: 'bold', color: 'var(--ink)', margin: '0.5rem 0 1.25rem 0' }}>
              $79.00 <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--ink-soft)' }}>USD / One-time</span>
            </p>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Get our complete physical learning kit shipped worldwide. Built for hands-on tactile mapping.
            </p>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.92rem', marginBottom: '2rem' }}>
              <li><strong>4 core workbooks</strong> (12-week literacy timeline)</li>
              <li><strong>170 Mnemonic stickers</strong> (visual mapping icons)</li>
              <li>Exclusive bookmarks & quick-sheets</li>
              <li>PDF dictionary charts download</li>
              <li>Lifetime community forum access</li>
            </ul>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleOpenCheckout({ name: 'Mnemonic Workbook Package', price: '$79.00' })}
            style={{ width: '100%', padding: '0.8rem' }}
          >
            Order Textbook Package
          </button>
        </div>

        {/* Product 2 */}
        <div style={{ background: 'white', border: '2px solid var(--teal)', borderRadius: 'var(--radius)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 25px color-mix(in srgb, var(--teal) 8%, transparent)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-14px', right: '2rem', background: 'var(--ember)', color: 'white', padding: '0.25rem 0.85rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Recommended
          </div>
          <div>
            <div style={{ display: 'inline-block', background: 'color-mix(in srgb, var(--ember) 12%, white)', color: 'var(--ember)', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase' }}>
              Best Value Bundle
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', margin: '0 0 0.5rem 0' }}>
              1:1 Mnemonic Coaching Bundle
            </h3>
            <p style={{ fontSize: '1.85rem', fontWeight: 'bold', color: 'var(--teal-deep)', margin: '0.5rem 0 1.25rem 0' }}>
              $149.00 <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--ink-soft)' }}>USD / 4 Weeks</span>
            </p>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Get the entire textbook package plus customized 1:1 coaching with a certified native tutor.
            </p>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.92rem', marginBottom: '2rem' }}>
              <li><strong>Everything in the Textbook Package</strong> ($79 value)</li>
              <li><strong>2x weekly live Zoom sessions</strong> (40-min / 1:1)</li>
              <li>Direct chat channel feedback from your tutor</li>
              <li>Customized homework & syllabus speed adjustment</li>
              <li>Graduation certification & report card</li>
            </ul>
          </div>
          <button
            type="button"
            className="btn btn-ember"
            onClick={() => handleOpenCheckout({ name: '1:1 Mnemonic Coaching Bundle', price: '$149.00' })}
            style={{ width: '100%', padding: '0.8rem' }}
          >
            Order Coaching Bundle
          </button>
        </div>

      </div>

      {/* Order History Panel */}
      {orders.length > 0 && (
        <section style={{ marginTop: '4rem', animation: 'rise 0.4s ease both' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '1rem' }}>Your Local Order History</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: 'color-mix(in srgb, var(--paper-cool) 30%, white)', border: '1px solid var(--line)', padding: '1rem 1.5rem', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--ink)' }}>{order.productName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: '0.2rem' }}>
                    ID: {order.id} | Name: {order.customerName} ({order.customerEmail}) | Address: {order.shippingAddress}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--teal-deep)', fontSize: '1.1rem' }}>{order.price}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>{order.createdAt}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'var(--paper)', width: 'min(100%, 550px)', borderRadius: 'var(--radius)', border: '1px solid var(--line)', padding: '2rem', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            
            <button
              type="button"
              onClick={() => setShowCheckout(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.6 }}
            >
              ✕
            </button>

            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', animation: 'rise 0.3s ease both' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Payment Successful!</h2>
                <p style={{ color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
                  Thank you for ordering the <strong>{selectedProduct?.name}</strong>. A confirmation email and study onboarding materials have been sent to your email.
                </p>
                <button type="button" className="btn btn-primary" onClick={() => setShowCheckout(false)}>
                  Close Checkout
                </button>
              </div>
            ) : (
              <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <p style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--teal)' }}>Checkout Summary</p>
                  <h3 style={{ margin: '0.2rem 0 0.5rem 0', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>{selectedProduct?.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderBottom: '1px solid var(--line)', paddingBottom: '0.75rem', fontSize: '1.2rem' }}>
                    <span>Total Cost:</span>
                    <span style={{ color: 'var(--teal-deep)' }}>{selectedProduct?.price} USD</span>
                  </div>
                </div>

                {isProcessing ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--line)', borderTopColor: 'var(--teal)', borderRadius: '50%', margin: '0 auto 1.5rem auto', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ fontWeight: 'bold', color: 'var(--ink-soft)' }}>Connecting to Stripe secure gateway...</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: '0.5rem' }}>Please do not refresh or close this window.</p>
                  </div>
                ) : (
                  <>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', borderBottom: '1px solid var(--line)', paddingBottom: '0.35rem' }}>1. Shipping Details</h4>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Full Name</label>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Liam Neeson" style={{ padding: '0.55rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'white' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Email Address</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="liam@example.com" style={{ padding: '0.55rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'white' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Street Address</label>
                      <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Hanja Lane" style={{ padding: '0.55rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="City / State" style={{ flex: 1, minWidth: '110px', padding: '0.55rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'white' }} />
                      <input type="text" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="Zip/Postal" style={{ width: '100px', padding: '0.55rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'white' }} />
                      <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" style={{ flex: 1, minWidth: '110px', padding: '0.55rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'white' }} />
                    </div>

                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', borderBottom: '1px solid var(--line)', paddingBottom: '0.35rem' }}>2. Payment Card</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Card Number</label>
                      <input type="text" required value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" maxLength={19} style={{ padding: '0.55rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Expiry Date</label>
                        <input type="text" required value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} style={{ padding: '0.55rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'white' }} />
                      </div>
                      <div style={{ width: '100px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>CVC</label>
                        <input type="password" required value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} placeholder="***" maxLength={3} style={{ padding: '0.55rem', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'white' }} />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-ember" style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      🔒 Pay {selectedProduct?.price} USD securely
                    </button>
                  </>
                )}
              </form>
            )}

          </div>
        </div>
      )}

      {/* Inline styles for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
