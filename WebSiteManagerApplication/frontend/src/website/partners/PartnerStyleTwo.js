import React from 'react';
import './OurPartners.css';

export default function PartnerStyleTwo({ partenaires }) {
  return (
    <div className="slider-container style-two">
      <div className="slider-track">
        {/* Duplique les partenaires pour l'effet de défilement continu */}
        {[...partenaires, ...partenaires, ...partenaires].map((partenaire, index) => (
          <div className="partner-logo style-two" key={`${partenaire._id}-${index}`}>
            <img
              src={partenaire.image}
              alt={partenaire.titre || "Logo partenaire"}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150"; // Image par défaut si l'URL échoue
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}