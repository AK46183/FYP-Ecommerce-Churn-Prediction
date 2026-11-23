import PageHeader from '../../components/common/PageHeader.jsx'
import './ContentPage.css'

// wide: text se pehle poori chaurai wala hissa (maslan Our Brand ki story video)
export default function ContentPage({ title, subtitle, wide, children }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <section className="content-page">
        {wide && <div className="container content-page__wide">{wide}</div>}
        <div className="container content-page__body">{children}</div>
      </section>
    </>
  )
}
