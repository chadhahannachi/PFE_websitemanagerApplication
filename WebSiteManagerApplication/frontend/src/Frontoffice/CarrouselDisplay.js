import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CarrouselDisplay = () => {
  const [carroussels, setCarroussels] = useState([]);
  const [partenairesParCarrousel, setPartenairesParCarrousel] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carrousselRes = await axios.get('http://localhost:5000/carroussels');
        const partenairesRes = await axios.get('http://localhost:5000/contenus/Partenaire');

        const tousLesCarrousels = carrousselRes.data;
        const tousLesPartenaires = partenairesRes.data;

        console.log("Carrousels récupérés :", tousLesCarrousels);
        console.log("Partenaires récupérés :", tousLesPartenaires);

        // Regrouper les partenaires par carrousel
        const regroupement = {};
        tousLesCarrousels.forEach((carrousel) => {
          regroupement[carrousel._id] = tousLesPartenaires.filter(p => p.carroussel === carrousel._id);
        });

        setCarroussels(tousLesCarrousels);
        setPartenairesParCarrousel(regroupement);
      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
      }
    };

    fetchData();
  }, []);

  if (!carroussels.length) return <p>Chargement...</p>;

  return (
    <div>
      {carroussels.map((carrousel) => (
        <div key={carrousel._id} style={carrousel.styles}>
          <h3>{carrousel.titre || "Carrousel"}</h3>
          {partenairesParCarrousel[carrousel._id]?.map((partenaire) => (
            <div key={partenaire._id} style={carrousel.elementStyles}>
              <h4>{partenaire.titre}</h4>
              <p>{partenaire.description}</p>
              <small>{partenaire.secteurActivite}</small>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CarrouselDisplay;


//ajouter un attribut unitstyle à carroussel pour qu'on l'applique dans le cas de section qui contient plusieurs data comme section partenaires , services . on l'applique sur la div qui contient partenaire par exemple . 
//peut etre ajouter carrousseltype pour les classer par type . 