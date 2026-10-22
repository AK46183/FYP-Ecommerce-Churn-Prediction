import { useParams, Link } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'
import './AccountPages.css'

export default function OrderDetails() {
  const { orderId } = useParams()

  return (
    <>
      <PageHeader title={`Order ${orderId}`} subtitle="Placed on Aug 28, 2026" />
      <section className="account-page">
        <div className="container">
          <div className="account-card">
            <h2>Status: Delivered</h2>
            <p style={{ color: 'var(--color-charcoal-soft)', marginBottom: '1.5rem' }}>
              Delivered on Sep 2, 2026 to your saved home address.
            </p>
            <div className="orders-list">
              <div className="order-row">
                <div>
                  <p className="order-row__id">Radiance Renewal Serum</p>
                  <p className="order-row__meta">Qty 1</p>
                </div>
                <span className="order-row__status">PKR 4,200</span>
              </div>
              <div className="order-row">
                <div>
                  <p className="order-row__id">Velvet Matte Lipstick — Rosewood</p>
                  <p className="order-row__meta">Qty 1</p>
                </div>
                <span className="order-row__status">PKR 1,800</span>
              </div>
            </div>
            <Link to="/account/orders" style={{ display: 'inline-block', marginTop: '1.5rem', fontSize: '0.82rem', textDecoration: 'underline' }}>
              Back to Orders
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
