import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <p>Project starter</p>
          <h1>Build an admin and normal user flow in one clean app.</h1>
          <p>
            This starter project is designed for a real web app experience: separate admin
            and user roles, login/signup flows, profile management, and a polished landing page.
          </p>
          <div className="hero-buttons">
            <Link className="button primary" to="/signup">
              Create account
            </Link>
            <Link className="button outline" to="/login">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-media">
          <img src={heroImage} alt="App flow dashboard" />
        </div>
      </section>

      <section className="feature-row">
        <article className="feature-card">
          <span>Admin</span>
          <h3>Admin control</h3>
          <p>
            Build the admin area to manage users, view reports, and control app settings.
          </p>
        </article>

        <article className="feature-card">
          <span>User</span>
          <h3>Normal user flow</h3>
          <p>
            Create a standard user dashboard with profile editing, secure access, and easy navigation.
          </p>
        </article>

        <article className="feature-card">
          <span>Ready</span>
          <h3>API integration ready</h3>
          <p>
            All pages are set up to accept API wiring later, so you can focus on backend integration next.
          </p>
        </article>
      </section>

      <section className="flow-section">
        <h2>Project flow for your next build</h2>
        <div className="flow-grid">
          <article className="flow-card">
            <strong>1</strong>
            <h3>Design the roles</h3>
            <p>
              Start with role selection on signup so admin users and normal users are created correctly.
            </p>
          </article>

          <article className="flow-card">
            <strong>2</strong>
            <h3>Wire authentication</h3>
            <p>
              Add login and signup API calls, then secure routes for logged-in users only.
            </p>
          </article>

          <article className="flow-card">
            <strong>3</strong>
            <h3>Build dashboards</h3>
            <p>
              Create separate experiences for admins and regular users, and connect profile updates.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Home;
