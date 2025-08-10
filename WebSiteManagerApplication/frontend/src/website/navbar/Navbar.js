import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import logowhite from '../../images/logo-white.png';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

const Navbar = ({ sectionOrder = [], customSections = [], sectionVisibility = {}, navbarStyles = {}, companyLogoUrl }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Fermer le dropdown si on clique en dehors
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      
      // Fermer le menu mobile si on clique en dehors
      const navLinks = document.querySelector('.nav-links');
      const hamburger = document.querySelector('.hamburger');
      
      if (mobileMenuOpen && navLinks && !navLinks.contains(event.target) && !hamburger.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleMobileLinkClick = (sectionId) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        window.scrollTo({
          top: section.offsetTop,
          behavior: 'smooth'
        });
      }
    }, 300);
  };

  const getSectionTitle = (sectionId) => {
    const customSection = customSections.find(s => s.id === sectionId);
    if (customSection) return customSection.content.titre;
    const standardTitles = {
      home: 'Home',
      partners: 'Our Partners',
      about: 'About Us',
      units: 'Our Units',
      services: 'Our Services',
      solutions: 'Our Solutions',
      events: 'Latest Events',
      news: 'News',
      testimonials: 'Testimonials',
      faq: 'FAQ',
      contact: 'Contact Us'
    };
    return standardTitles[sectionId] || sectionId;
  };

  const navLinkStyle = {
    color: navbarStyles?.navLinkColor || 'white',
    fontFamily: navbarStyles?.navLinkFont,
    fontWeight: 500,
    fontSize: '1rem',
    textDecoration: 'none',
    transition: 'color 0.2s',
  };

  const buttonStyle = {
    background: navbarStyles?.buttonBg || 'rgba(192, 191, 188, 0.73)',
    color: navbarStyles?.buttonTextColor || '#fff',
    fontFamily: navbarStyles?.navLinkFont,
    border: 'none',
    borderRadius: navbarStyles?.buttonRadius ? navbarStyles.buttonRadius + 'px' : '5px',
    padding: '0.1rem 0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background 0.2s, border-radius 0.2s',
    height: '40px',
    width: '100px'
  };

  const dropdownPanelStyle = {
    background: navbarStyles?.dropdownPanelBg || '#111',
    borderRadius: '8px',
    padding: '0',
    minWidth: 180,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  };

  const dropdownNavlinkStyle = {
    ...navLinkStyle,
    display: 'block',
    padding: '0px 0px',
  };

  const navbarContainerStyle = {
    background: navbarStyles?.navbarBgColor || 'transparent',
    transition: 'background 0.2s',
  };

  const visibleSections = sectionOrder.filter(
    sectionId => sectionVisibility[sectionId] && sectionId !== 'contact'
  );
  const mainNavLinks = visibleSections.slice(0, 8);
  const dropdownSections = visibleSections.slice(8);
  const showContact = sectionVisibility['contact'];

  return (
    <>
      <nav className="menu" style={navbarContainerStyle}>
        <div className="logo">
          <a href="#home" onClick={(e) => {
            e.preventDefault();
            handleMobileLinkClick('home');
          }}>
            <img
              src={companyLogoUrl || logowhite}
              alt="logo"
              className="logo"
              style={{ maxHeight: 48, maxWidth: 160, objectFit: 'contain' }}
            />
          </a>
        </div>
        
        <button 
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul 
          className={`nav-links ${mobileMenuOpen ? 'active' : ''}`} 
          style={mobileMenuOpen ? { background: dropdownPanelStyle.background } : {}}
        >
          {/* Affiche tous les liens en mode mobile, seulement les principaux en desktop */}
          {(isMobile ? visibleSections : mainNavLinks).map((sectionId) => (
            <li key={sectionId}>
              <a 
                style={navLinkStyle}
                href={`#${sectionId}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleMobileLinkClick(sectionId);
                }}
              >
                {getSectionTitle(sectionId)}
              </a>
            </li>
          ))}

          {/* Affiche le dropdown More seulement en desktop */}
          {!isMobile && dropdownSections.length > 0 && (
            <li className="dropdown" ref={dropdownRef}>
              <button
                style={navLinkStyle}
                className="dropdown-btn"
                onClick={() => setDropdownOpen(prev => !prev)}
                type="button"
              >
                More ▾
              </button>
              <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} style={dropdownPanelStyle}>
                {dropdownSections.map((sectionId) => (
                  <li key={sectionId}>
                    <a 
                      href={`#${sectionId}`}
                      style={dropdownNavlinkStyle}
                      onClick={(e) => {
                        e.preventDefault();
                        setDropdownOpen(false);
                        handleMobileLinkClick(sectionId);
                      }}
                    >
                      {getSectionTitle(sectionId)}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          )}

          {showContact && (
            <li>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleMobileLinkClick('contact');
                }}
              >
                <button style={buttonStyle} className="contact-btn">Contact Us</button>
              </a>
            </li>
          )}
        </ul>
      </nav>
      
      {mobileMenuOpen && (
        <div 
          className="menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
