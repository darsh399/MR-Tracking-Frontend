import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="page-hero about-hero">
        <div>
          <p className="eyebrow">About MR Visit Tracker</p>
          <h1>Transform field visits into a modern SAAS workflow.</h1>
          <p>
            MR Visit Tracker is a lightweight SaaS-style solution for medical representatives and company admins.
            It helps teams capture visit details, validate location data, manage employee access, and keep admin
            controls within the same company boundary.
          </p>
          <Link className="button primary" to="/contact">
            Get in touch
          </Link>
        </div>
      </section>

      <section className="about-section">
        <div className="about-card">
          <h2>What our product does</h2>
          <p>
            This application helps sales and field teams track doctor visits, store visit locations,
            and simplify admin oversight. Admins can define companies, manage their own employees,
            and keep user access scoped to their organization.
          </p>
        </div>

        <div className="about-grid">
          <article>
            <h3>Company-centric access</h3>
            <p>
              Admins can register with a company name and invite or approve MR employees belonging to the same company.
            </p>
          </article>
          <article>
            <h3>Visit and location tracking</h3>
            <p>
              MR users can log doctor visits while capturing their current geolocation, then review visit history with map preview.
            </p>
          </article>
          <article>
            <h3>Role-based user experience</h3>
            <p>
              Navigation and dashboard views adapt automatically to logged-out users, MR users, and company admins.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default About;
