import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('Thank you! Your message has been submitted. We will respond shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
          ← Back
        </button>
      </div>
      <section className="page-header contact-header">
        <h1>Contact us</h1>
        <p>Have a question about the platform, company setup, or your account? Send us a message.</p>
      </section>

      <div className="contact-grid">
        <div className="contact-info-card">
          <h2>Reach out anytime</h2>
          <p>Our support team is here to help with admin setup, employee onboarding, and visit tracking.</p>
          <div className="contact-detail">
            <strong>Email</strong>
            <span>support@mrvisittracker.com</span>
          </div>
          <div className="contact-detail">
            <strong>Phone</strong>
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="contact-detail">
            <strong>Office</strong>
            <span>123 Healthcare Avenue, Suite 400</span>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {status && <div className="success-message">{status}</div>}
          <label>
            Full name
            <input name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" />
          </label>
          <label>
            Email address
            <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Your email" />
          </label>
          <label>
            Subject
            <input name="subject" value={formData.subject} onChange={handleChange} required placeholder="Subject" />
          </label>
          <label>
            Message
            <textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Write your message" />
          </label>
          <button type="submit" className="primary-button">Send message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
