import { useState } from 'react'
import ContentPage from './ContentPage.jsx'

export default function ContactUs() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <ContentPage title="Contact Us" subtitle="We'd love to hear from you.">
      {sent ? (
        <p>Thank you for reaching out — our team will respond within 1-2 business days.</p>
      ) : (
        <form className="content-page__form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Your name" required />
          <input type="email" placeholder="Your email" required />
          <textarea placeholder="How can we help?" required />
          <button type="submit">Send Message</button>
        </form>
      )}
    </ContentPage>
  )
}
