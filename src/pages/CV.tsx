import { cv, cvPdf } from '../data/cv'
import { Seo } from '../components/Seo'
import './CV.css'

export default function CV() {
  return (
    <section>
      <Seo title="CV · Nikita Kolosov" />
      <div className="cv-head">
        <h1>CV</h1>
        {cvPdf && <a className="cv-pdf" href={cvPdf} download>Download PDF</a>}
      </div>
      {cv.map((section) => (
        <div key={section.heading} className="cv-section">
          <h2>{section.heading}</h2>
          {section.entries.map((e, i) => (
            <div key={i} className="cv-entry">
              <div className="cv-when">{e.when}</div>
              <div className="cv-what">
                <strong>{e.what}</strong>
                {e.where && <span className="cv-where"> · {e.where}</span>}
                {e.detail && <div className="cv-detail">{e.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}
