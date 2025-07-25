import React from 'react';
import Navbar from '../../website/navbar/Navbar';

// NavbarDisplay reçoit toutes les données nécessaires en props
const NavbarDisplay = ({ sectionOrder, sectionVisibility, customSections, navbarStyles, companyLogoUrl }) => {
  return (
    <Navbar
      sectionOrder={sectionOrder}
      sectionVisibility={sectionVisibility}
      customSections={customSections}
      navbarStyles={navbarStyles}
      companyLogoUrl={companyLogoUrl}
    />
  );
};

export default NavbarDisplay;