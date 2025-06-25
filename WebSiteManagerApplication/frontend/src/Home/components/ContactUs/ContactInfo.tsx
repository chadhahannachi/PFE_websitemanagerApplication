import React from "react";
import { BJ, CD, FR, TN } from 'country-flag-icons/react/3x2';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

const ContactInfo = () => {
  const locations = [
    {
      flag: <TN style={{ width: '40px', height: '40px' }} />,
      country: "TUNISIE",
      address: "Immeuble Néo, 2ème étage, Rue du Lac Lochnes, 1053, Les Berges du Lac, Tunis, Tunisie",
      phone: "+216 71 96 34 53",
      phoneHref: "tel:+21671963453",
      email: "contact@abshore.com"
    },
    {
      flag: <FR style={{ width: '40px', height: '40px' }} />,
      country: "FRANCE",
      address: "41 Rue de la Découverte CS 37621 31676 LA BEGE CEDEX, France",
      phone: "+33 6 13 30 61 78",
      phoneHref: "tel:+33613306178",
      email: "contact@abshore.com"
    },
    {
      flag: <BJ style={{ width: '40px', height: '40px' }} />,
      country: "BENIN",
      address: "L'AFRICAINE VIE BENIN SA 19 Patte d'Oie. Cotonou, Bénin",
      phone: "+229 21 30 39 93",
      phoneHref: "tel:+22921303993",
      email: "contact@abshore.com"
    },
    {
      flag: <CD style={{ width: '40px', height: '40px' }} />,
      country: "RDC",
      address: "Appart.23, 1er étage, 22B Bd Du 30 Juin, Kinshasa, Congo-Kinshasa",
      phone: "+243 999 92 60 51",
      phoneHref: "tel:+243999926051",
      email: "contact@abshore.com"
    },
  ];

  return (
    <ul className="contact-us-info p-0 mb-0 list-unstyled mt-1 mt-lg-0">
      {locations.map((loc, index) => (
        <li key={index} className="mb-3">
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
              {loc.flag}
            </div>
            <div className="flex-grow-1 ms-4">
              <h4 className="mb-1">{loc.country}</h4>
              <div>{loc.address}</div>
              <div className="d-flex align-items-center mt-0">
                <FaPhone className="me-1" />
                <a href={loc.phoneHref} className="me-3">{loc.phone}</a>
                <FaEnvelope className="me-1" />
                <a href={`mailto:${loc.email}`}>{loc.email}</a>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ContactInfo;
