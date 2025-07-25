import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import '../../website/partners/OurPartners.css';
import PartnerStyleTwo from '../../website/partners/PartnerStyleTwo'; // Nouveau style (images seules)
import PartnersStyleOneDisplay from './PartnersStyleOneDisplay';

// Liste des styles disponibles
const styles = [
  { name: 'Cards Slider', component: PartnersStyleOneDisplay },
  { name: 'Images Slider', component: PartnerStyleTwo },
];

const PartnersSectionDisplay = ({ styleIndex, entrepriseId }) => {
  const [partenaires, setPartenaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Par défaut, utiliser le premier style si styleIndex n'est pas fourni
  const PartnerComponent = styles[styleIndex]?.component || PartnersStyleOneDisplay;

 

  

  // Fonction pour récupérer les partenaires de la même entreprise que l'utilisateur connecté
  const fetchPartenairesByEntreprise = async () => {
    

    try {
      

      // Récupérer les détails de l'utilisateur connecté
      

      if (!entrepriseId) {
        console.error("User's company (entreprise) is missing");
        setError("Entreprise de l'utilisateur non trouvée.");
        setLoading(false);
        return;
      }

      // Récupérer les partenaires associés à l'entreprise de l'utilisateur
      const partenairesResponse = await axios.get(
        `http://localhost:5000/contenus/Partenaire/entreprise/${entrepriseId}`,
        
      );

      // Filtrer uniquement les partenaires publiés (isPublished: true)
      // const publishedPartenaires = partenairesResponse.data.filter(partenaire => partenaire.isPublished);
      const publishedPartenaires = partenairesResponse.data;
      setPartenaires(publishedPartenaires);
    } catch (error) {
      console.error("Error fetching partenaires:", error);
      setError("Erreur lors de la récupération des partenaires.");
    } finally {
      setLoading(false);
    }
  };

  // Appeler fetchPartenairesByEntreprise au montage du composant
  useEffect(() => {
      fetchPartenairesByEntreprise();
  });

  // Afficher un message de chargement pendant la récupération des données
  if (loading) {
    return (
      <section className="partners-section">
        {styleIndex === 0 && (
          <>
            <h2 className="partners-title">Our Partners</h2>
            <p className="partners-subtitle">Pleasure to work with</p>
          </>
        )}
        <div className="slider-container">
          <p>Chargement des partenaires...</p>
        </div>
      </section>
    );
  }

  // Afficher un message d'erreur si la récupération échoue
  if (error) {
    return (
      <section className="partners-section">
        {styleIndex === 0 && (
          <>
            <h2 className="partners-title">Our Partners</h2>
            <p className="partners-subtitle">Pleasure to work with</p>
          </>
        )}
        <div className="slider-container">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  // Si aucun partenaire n'est publié, afficher un message
  if (partenaires.length === 0) {
    return (
      <section className="partners-section">
        {styleIndex === 0 && (
          <>
            <h2 className="partners-title">Our Partners</h2>
            <p className="partners-subtitle">Pleasure to work with</p>
          </>
        )}
        <div className="slider-container">
          <p>Aucun partenaire publié pour le moment.</p>
        </div>
      </section>
    );
  }

  return (
        
    <section>
      <PartnerComponent partenaires={partenaires} entrepriseId={entrepriseId} />
    </section>
  );
};

export default PartnersSectionDisplay;