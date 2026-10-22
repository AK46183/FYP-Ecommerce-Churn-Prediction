import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { primaryNav, megaMenu } from '../../data/navigation.js'
import MegaMenuPanel from './MegaMenuPanel.jsx'
import './CategoryNav.css'

const CLOSE_DELAY = 150

export default function CategoryNav() {
  const [activeKey, setActiveKey] = useState(null)
  const closeTimer = useRef(null)

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    cancelClose()

    closeTimer.current = setTimeout(() => {
      setActiveKey(null)
    }, CLOSE_DELAY)
  }, [cancelClose])

  function handleEnter(key) {
    cancelClose()
    setActiveKey(key)
  }

  return (
    <nav
      className="category-nav"
      onMouseLeave={scheduleClose}
      aria-label="Product categories"
    >
      <div className="container category-nav__inner">
        <ul className="category-nav__list">

          {primaryNav.map((item) => (
            <li
              key={item.key}
              className={`category-nav__item ${
                activeKey === item.key ? 'is-active' : ''
              }`}
              onMouseEnter={() => handleEnter(item.key)}
            >
              <Link
                to={item.path}
                className="category-nav__link"
              >
                {item.label}
              </Link>

              {/* Dropdown opens under this exact nav item */}
              {activeKey === item.key && megaMenu[item.key] && (
                <MegaMenuPanel
                  columns={megaMenu[item.key]}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                  onNavigate={() => setActiveKey(null)}
                />
              )}
            </li>
          ))}

        </ul>
      </div>
    </nav>
  )
}