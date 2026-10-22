import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ChevronRight } from 'lucide-react'
import { primaryNav, megaMenu } from '../../data/navigation.js'
import './MobileMenu.css'

export default function MobileMenu({ open, onClose }) {
  const [openKey, setOpenKey] = useState(null)
  const [openSubLabel, setOpenSubLabel] = useState(null)

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open)
    return () => document.body.classList.remove('no-scroll')
  }, [open])

  function toggleTop(key) {
    setOpenKey((prev) => (prev === key ? null : key))
    setOpenSubLabel(null)
  }

  function toggleSub(label) {
    setOpenSubLabel((prev) => (prev === label ? null : label))
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mobile-menu"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <div className="mobile-menu__header">
            <img src="/images/minaysh-logo.png" alt="MINAYSH" />
            <button onClick={onClose} aria-label="Close menu">
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          <div className="mobile-menu__body">
            {primaryNav.map((item) => {
              const columns = megaMenu[item.key]
              const isOpen = openKey === item.key
              return (
                <div key={item.key} className="mobile-menu__accordion">
                  <button
                    className="mobile-menu__accordion-trigger"
                    onClick={() => (columns ? toggleTop(item.key) : onClose())}
                  >
                    {columns ? (
                      <Link to={item.path} onClick={onClose}>
                        {item.label}
                      </Link>
                    ) : (
                      <Link to={item.path} onClick={onClose}>
                        {item.label}
                      </Link>
                    )}
                    {columns && (
                      <span
                        onClick={(e) => {
                          e.preventDefault()
                          toggleTop(item.key)
                        }}
                      >
                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && columns && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="mobile-menu__submenu"
                      >
                        {columns.map((col) => (
                          <div key={col.label} className="mobile-menu__sub-accordion">
                            <button onClick={() => toggleSub(col.label)}>
                              {col.label}
                              {openSubLabel === col.label ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              )}
                            </button>
                            <AnimatePresence>
                              {openSubLabel === col.label && (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {col.items.map((sub) => (
                                    <li key={sub.path}>
                                      <Link to={sub.path} onClick={onClose}>
                                        {sub.label}
                                      </Link>
                                    </li>
                                  ))}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
      {open && <motion.div className="mobile-menu__backdrop" onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} />}
    </AnimatePresence>
  )
}
