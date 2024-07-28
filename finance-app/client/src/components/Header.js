// Header.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaChartBar, FaCog, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import './Header.css';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    {
      icon: <FaHome />,
      label: 'Home',
      items: [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/transactions', label: 'Transactions' },
        { to: '/budget', label: 'Budget' },
        { to: '/financial-goals', label: 'Financial Goals' },
      ],
    },
    {
      icon: <FaChartBar />,
      label: 'Analytics',
      items: [
        { to: '/reports', label: 'Reports' },
        { to: '/analytics-dashboard', label: 'Analytics Dashboard' },
        { to: '/financial-calendar', label: 'Financial Calendar' },
      ],
    },
    {
      icon: <FaCog />,
      label: 'Settings',
      items: [
        { to: '/category-management', label: 'Categories' },
        { to: '/profile-settings', label: 'Profile Settings' },
        { to: '/bill-reminders', label: 'Bill Reminders' },
        { to: '/export-import', label: 'Export/Import' },
      ],
    },
    {
      icon: <FaUser />,
      label: user ? user.name : 'Account',
      items: user
        ? [
            { to: '/profile', label: 'Profile' },
            { label: 'Logout', onClick: handleLogout, icon: <FaSignOutAlt /> },
          ]
        : [
            { to: '/login', label: 'Login' },
            { to: '/register', label: 'Register' },
          ],
    },
  ];

  return (
    <header className="header">
      <div className="logo">FinanceTracker</div>
      <button className="hamburger" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      <nav className={`nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="nav-list">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <button className="nav-button" onClick={() => toggleDropdown(index)}>
                {item.icon}
                <span className="nav-label">{item.label}</span>
              </button>
              {activeDropdown === index && (
                <ul className="dropdown">
                  {item.items.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      {subItem.to ? (
                        <Link to={subItem.to} onClick={() => setActiveDropdown(null)}>
                          {subItem.icon && subItem.icon}
                          {subItem.label}
                        </Link>
                      ) : (
                        <button onClick={subItem.onClick}>
                          {subItem.icon && subItem.icon}
                          {subItem.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
