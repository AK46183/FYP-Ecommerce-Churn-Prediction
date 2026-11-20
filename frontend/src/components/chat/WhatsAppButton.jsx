import './WhatsAppButton.css'

// MINAYSH WhatsApp: 0332 8649439 (international format: 92 + number, shuru ka 0 hata kar)
const WHATSAPP_NUMBER = '923328649439'
const GREETING = "Hi MINAYSH! I'd like some help with "

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(GREETING)}`
  return (
    <a
      className="wa-float"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MINAYSH on WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        {/* chat bubble + phone handset */}
        <path
          d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.3 20.8l4.5-1.1A8.8 8.8 0 1 0 12 3.2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M9.3 8.1c.2-.4.5-.4.8-.4h.5c.2 0 .4 0 .6.4l.7 1.6c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.4 0 .5.5.9 1.3 1.7 2.2 2.2.2.1.4.1.5 0l.7-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.4.8-.6.4-1.3.6-2 .5-2.8-.4-5.2-2.8-5.6-5.6-.1-.7.1-1.4.4-1.9Z"
          fill="currentColor"
        />
      </svg>
      <span className="wa-float__tip">Chat on WhatsApp</span>
    </a>
  )
}
