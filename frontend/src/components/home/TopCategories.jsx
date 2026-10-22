import { Link } from 'react-router-dom'
import { topCategories } from '../../data/categories.js'
import './TopCategories.css'

export default function TopCategories() {
  return (
    <section className="top-categories">
      <div className="container">
        <h2 className="top-categories__heading">TOP CATEGORIES</h2>

        <div className="top-categories__row">
          {topCategories.map((cat) => (
            <Link
              to={cat.path}
              key={cat.key}
              className="top-categories__item"
            >
              <div className="top-categories__visual">

                {/* Flower/decor only where provided */}
                {cat.decor ? (
                  <img
                    src={cat.decor}
                    alt=""
                    className="top-categories__decor"
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className="top-categories__shape"
                    style={{ background: cat.shapeColor }}
                    aria-hidden="true"
                  />
                )}

                <img
                  src={cat.image}
                  alt={cat.label}
                  className="top-categories__image"
                />

              </div>

              <span className="top-categories__label">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}