import { Link } from 'react-router-dom'
import { ShieldCheck, Database, Sparkles, Lock, Camera, UserCheck } from 'lucide-react'
import { InfoPage, InfoHighlight, InfoPanel, Checklist } from './InfoKit.jsx'

export default function PrivacyPolicy() {
  return (
    <InfoPage title="Privacy Policy" subtitle="What we collect, why we collect it, and how we keep it safe." updated="November 2026">
      <InfoHighlight icon={ShieldCheck} title="Your data stays yours">
        We collect only what we need to deliver your orders and make shopping better for you, and we never sell your personal data to anyone.
      </InfoHighlight>

      <div className="info-grid">
        <InfoPanel icon={Database} title="What we collect">
          <Checklist
            items={[
              'Account details: your name, email and password.',
              'Order details: your phone number, delivery address and the products you buy.',
              'How you shop on our site, such as products you view and add to your bag.',
              'Messages you send us through Contact Us, the Help Bot or the Skincare Assistant.',
            ]}
          />
        </InfoPanel>

        <InfoPanel icon={Sparkles} title="How we use it">
          <Checklist
            items={[
              'To process, deliver and update you about your orders.',
              'To answer your questions and complaints.',
              'To suggest products and send offers we think you will like.',
              'To keep our website safe and working well.',
            ]}
          />
        </InfoPanel>

        <InfoPanel icon={Lock} title="How we protect it">
          <Checklist
            items={[
              'Passwords are stored encrypted. Nobody at MINAYSH can read them.',
              'Phone numbers and addresses are stored encrypted in our database.',
              'The website and our databases use secure (HTTPS / TLS) connections.',
              'We never ask for card numbers, OTP or PIN codes.',
            ]}
          />
        </InfoPanel>

        <InfoPanel icon={Camera} title="Chats and skin photos">
          <Checklist
            items={[
              'Skin scan photos are analysed by an AI service and are never saved by MINAYSH.',
              'Chat messages are saved to improve our service and are deleted automatically after 180 days.',
              'Numbers that look like card or CNIC numbers are hidden before a chat is saved.',
            ]}
          />
        </InfoPanel>
      </div>

      <InfoPanel icon={UserCheck} title="Your choices">
        <p>
          You can update your name, phone number and addresses any time in <Link to="/account">My Account</Link>. To ask us to delete your
          chats or your account, or if you have any question about your data, write to us on the <Link to="/contact">Contact Us</Link> page.
        </p>
      </InfoPanel>
    </InfoPage>
  )
}
