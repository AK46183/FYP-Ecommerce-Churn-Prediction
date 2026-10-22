import './AdminPages.css'

const promotions = [
  { name: 'Autumn Glow — 20% Off Skin Care', active: true, ends: 'Sep 30, 2026' },
  { name: 'Buy 2 Get 1 Free — Lipsticks', active: true, ends: 'Oct 5, 2026' },
  { name: 'Welcome Offer — First Order', active: false, ends: '—' },
]

export default function AdminPromotions() {
  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Promotions</h1>
          <p>Manage active and scheduled promotions</p>
        </div>
        <button className="admin-page__action-btn">+ New Promotion</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Promotion</th>
              <th>Ends</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.name}>
                <td>{promo.name}</td>
                <td>{promo.ends}</td>
                <td>
                  <span className={`admin-badge admin-badge--${promo.active ? 'success' : 'pending'}`}>
                    {promo.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
