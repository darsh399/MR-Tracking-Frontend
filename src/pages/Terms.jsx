import './Privacy.css';

const Terms = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="page-content">
        <section>
          <h2>Acceptance of Terms</h2>
          <p>By accessing and using MediTrack Pro, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section>
          <h2>Use License</h2>
          <p>Permission is granted to temporarily use the services for personal, non-commercial transitory viewing only.</p>
        </section>

        <section>
          <h2>User Responsibilities</h2>
          <p>Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.</p>
        </section>

        <section>
          <h2>Service Availability</h2>
          <p>While we strive to provide continuous service, we do not guarantee that the service will be uninterrupted or error-free.</p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>In no event shall MediTrack Pro be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>For questions about these Terms, please contact us at legal@meditrackpro.com</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;