import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './MegaMenuPanel.css'

export default function MegaMenuPanel({
  columns,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}) {
  const [activeIndex, setActiveIndex] = useState(null)

  // Jab top category change ho to second menu close ho jaye
  useEffect(() => {
    setActiveIndex(null)
  }, [columns])

  const activeColumn =
    activeIndex !== null ? columns[activeIndex] : null

  return (
    <div
      className="kiko-menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* FIRST LEVEL MENU */}
      <div className="kiko-menu__level1">
        {columns.map((column, index) => (
          <Link
            key={column.label}
            to={column.path}
            className={`kiko-menu__level1-item ${
              activeIndex === index ? 'is-active' : ''
            }`}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={onNavigate}
          >
            {column.label}
          </Link>
        ))}
      </div>

      {/* SECOND LEVEL MENU */}
      {activeColumn && (
        <div
          className="kiko-menu__level2"
          style={{
            top: `${activeIndex * 42}px`,
          }}
        >
          {activeColumn.items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="kiko-menu__level2-item"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}