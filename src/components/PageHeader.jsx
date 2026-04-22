import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import './PageHeader.css';

const PageHeader = ({ title, showBack = true, backPath = -1 }) => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleBack = () => {
    if (typeof backPath === 'number') {
      navigate(backPath);
    } else {
      navigate(backPath);
    }
  };

  return (
    <div className="page-header">
      <div className="header-left">
        {showBack && (
          <button className="back-button" onClick={handleBack} aria-label="Go back">
            ← Back
          </button>
        )}
        <h1>{title}</h1>
      </div>
      <button 
        className="dark-mode-toggle" 
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default PageHeader;
