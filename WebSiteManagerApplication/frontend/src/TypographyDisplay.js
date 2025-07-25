import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TypographyDisplay = () => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const { entrepriseId } = useParams(); // Récupère l'ID depuis l'URL

  useEffect(() => {
    if (!entrepriseId) return;
    setLoading(true);
    axios
      .post(`http://localhost:5000/chatbot/fonts/${entrepriseId}`)
      .then(res => setAnswer(res.data.answer))
      .catch(() => setAnswer('Erreur lors de la récupération des polices.'))
      .finally(() => setLoading(false));
  }, [entrepriseId]);

  if (loading) return <div>Chargement de la typographie (IA)...</div>;
  if (!answer) return null;

  return (
    <div style={{ margin: '2rem 0', background: '#f3f4f6', borderRadius: 8, padding: 24 }}>
      <h3 style={{ color: '#014268', marginBottom: 16 }}>Typographies détectées par l'IA</h3>
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#222' }}>{answer}</pre>
    </div>
  );
};

export default TypographyDisplay;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// // Fonction utilitaire pour extraire les polices depuis le texte IA
// function extractFontsFromAnswer(answer) {
//   // Cherche les motifs du type : "Poppins", Arial, 'Montserrat', etc.
//   // On prend tout ce qui ressemble à une police après un deux-points ou dans un tableau/ligne
//   const fontRegex = /:\s*['"]?([A-Za-z0-9 \-,]+)['"]?/g;
//   const found = [];
//   let match;
//   while ((match = fontRegex.exec(answer)) !== null) {
//     // On split si plusieurs polices séparées par une virgule
//     match[1].split(',').forEach(font => {
//       const clean = font.trim().replace(/^['"]|['"]$/g, '');
//       if (clean && !found.includes(clean)) found.push(clean);
//     });
//   }
//   return found;
// }

// const TypographyDisplay = () => {
//   const [answer, setAnswer] = useState('');
//   const [fonts, setFonts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { entrepriseId } = useParams(); // Récupère l'ID depuis l'URL

//   useEffect(() => {
//     if (!entrepriseId) return;
//     setLoading(true);
//     axios
//       .post(`http://localhost:5000/chatbot/fonts/${entrepriseId}`)
//       .then(res => {
//         setAnswer(res.data.answer);
//         setFonts(extractFontsFromAnswer(res.data.answer));
//       })
//       .catch(() => {
//         setAnswer('Erreur lors de la récupération des polices.');
//         setFonts([]);
//       })
//       .finally(() => setLoading(false));
//   }, [entrepriseId]);

//   if (loading) return <div>Chargement de la typographie (IA)...</div>;
//   if (!answer) return null;

//   return (
//     <div style={{ margin: '2rem 0', background: '#f3f4f6', borderRadius: 8, padding: 24 }}>
//       <h3 style={{ color: '#014268', marginBottom: 16 }}>Typographies détectées par l'IA</h3>
//       <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#222' }}>{answer}</pre>
//       {fonts.length > 0 && (
//         <div style={{ marginTop: 24 }}>
//           <h4 style={{ color: '#2563eb', marginBottom: 8 }}>Liste des polices détectées :</h4>
//           <ul style={{ listStyle: 'disc', paddingLeft: 24 }}>
//             {fonts.map(font => (
//               <li key={font} style={{ fontFamily: font, fontSize: 20, marginBottom: 4 }}>
//                 {font}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TypographyDisplay;