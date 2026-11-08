import { tipsTrends } from '../../data/tipsTrends.js'
import './AdminPages.css'

export default function AdminTipsTrends() {
  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1>Tips &amp; Trends Content</h1>
          <p>Manage the four homepage Tips &amp; Trends cards and their videos</p>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Card</th>
              <th>Poster Image</th>
              <th>Hover Video</th>
              <th>Destination</th>
            </tr>
          </thead>
          <tbody>
            {tipsTrends.map((tip) => (
              <tr key={tip.key}>
                <td>{tip.title}</td>
                <td>{tip.poster}</td>
                <td>{tip.video}</td>
                <td>{tip.path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
