import { useContext } from 'react';
import { FaBookmark, FaHome, FaLock, FaMoon, FaSun } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { ThemeContext } from '../contexts';

const Navbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      <div className='navbar-container'>
        <div className='navbar-brand'>
          <h1 className='nav-header'>Contest Tracker</h1>
        </div>
        <div className='navbar-links'>
          <Link to='/' className='nav-link'>
            <FaHome /> Home
          </Link>
          <Link to='/bookmarks' className='nav-link'>
            <FaBookmark /> Bookmarks
          </Link>
          <Link to='/admin' className='nav-link'>
            <FaLock /> Admin
          </Link>
          <button onClick={toggleTheme} className='theme-toggle'>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
