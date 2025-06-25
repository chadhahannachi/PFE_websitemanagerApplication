import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logowhite from '../../images/logo-white.png';
import { Button } from '@mui/material';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <a href="#home">
          <img src={logowhite} alt="logo" className="logo" />
        </a>
      </div>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#solutions">Our Solutions</a></li>
        <li><a href="#partners">Our Partners</a></li>
        <li><a href="#units">Our Units</a></li>
        <li><a href="#events">Latest Events</a></li>
        <li><a href="#news">News</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="#contact"><Button>Contact Us</Button></a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
