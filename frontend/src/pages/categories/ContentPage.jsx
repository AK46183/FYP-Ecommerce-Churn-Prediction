import PageHeader from '../../components/common/PageHeader.jsx'
import './ContentPage.css'

export default function ContentPage({ title, subtitle, children }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <section className="content-page">
        <div className="container content-page__body">{children}</div>
      </section>
    </>
  )
}
