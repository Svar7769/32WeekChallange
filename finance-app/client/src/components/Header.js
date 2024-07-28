// Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChartBar, FaCog, FaUser } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const menuItems = [
    {
      icon: <FaHome />,
      label: 'Home',
      items: [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/transactions', label: 'Transactions' },
        { to: '/budget-setup', label: 'Budget Setup' },
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
      label: 'Account',
      items: [
        { to: '/login', label: 'Login' },
        { to: '/register', label: 'Register' },
      ],
    },
  ];

  return (
    <header className="header">
      <div className="logo">FinanceTracker</div>
      <nav className="nav">
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
                      <Link to={subItem.to} onClick={() => setActiveDropdown(null)}>
                        {subItem.label}
                      </Link>
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
