// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const COMMON_FIELDS = [
//   'titre',
//   'description',
//   'image',
//   'code',
//   'datePublication',
//   'isPublished',
//   'isArchived',
//   'publisher'
// ];

// const SPECIFIC_FIELDS = {
//   Partenaire: ['secteurActivite'],
//   Temoignage: ['auteur'],
//   FAQ: ['question', 'reponse'],
//   Evenement: ['dateDebut', 'dateFin'],
//   Article: ['categorie', 'prix'],
//   ContenuSpecifique: ['variables'], // { key, value }
//   // Empty for the rest (APropos, Actualite, etc.)
// };

// const DynamicContenuForm = ({ type }) => {
//   const [form, setForm] = useState({});
//   const [variables, setVariables] = useState([{ key: '', value: '' }]);

//   const handleChange = (e) => {
//     const { name, value, type: inputType, checked } = e.target;
//     setForm({
//       ...form,
//       [name]: inputType === 'checkbox' ? checked : value,
//     });
//   };

//   const handleVariableChange = (index, field, value) => {
//     const updated = [...variables];
//     updated[index][field] = value;
//     setVariables(updated);
//   };

//   const addVariable = () => {
//     setVariables([...variables, { key: '', value: '' }]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = {
//       ...form,
//       variables: type === 'ContenuSpecifique' ? variables : undefined,
//     };
//     try {
//       await axios.post(`/contenus/${type}`, data);
//       alert('Contenu ajouté avec succès');
//     } catch (err) {
//       console.error(err);
//       alert('Erreur lors de l\'ajout');
//     }
//   };

//   const fields = [...COMMON_FIELDS, ...(SPECIFIC_FIELDS[type] || [])];

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {fields.map((field) => (
//         <input
//           key={field}
//           type={field.startsWith('is') ? 'checkbox' : 'text'}
//           name={field}
//           placeholder={field}
//           checked={form[field] || false}
//           value={form[field] || ''}
//           onChange={handleChange}
//           className="border p-2 rounded w-full"
//         />
//       ))}

//       {type === 'ContenuSpecifique' && (
//         <div className="space-y-2">
//           <label className="block font-semibold">Variables:</label>
//           {variables.map((v, i) => (
//             <div key={i} className="flex gap-2">
//               <input
//                 placeholder="key"
//                 value={v.key}
//                 onChange={(e) => handleVariableChange(i, 'key', e.target.value)}
//                 className="border p-2 rounded w-1/2"
//               />
//               <input
//                 placeholder="value"
//                 value={v.value}
//                 onChange={(e) => handleVariableChange(i, 'value', e.target.value)}
//                 className="border p-2 rounded w-1/2"
//               />
//             </div>
//           ))}
//           <button type="button" onClick={addVariable} className="text-blue-600 underline">
//             Ajouter une variable
//           </button>
//         </div>
//       )}

//       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//         Ajouter {type}
//       </button>
//     </form>
//   );
// };

// const ContenuList = ({ type }) => {
//   const [data, setData] = useState([]);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(`/contenus/${type}`);
//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [type]);

//   return (
//     <div className="mt-8">
//       <h2 className="text-xl font-bold mb-4">Liste des {type}</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {data.map((item) => (
//           <div key={item._id} className="border p-4 rounded shadow">
//             <h3 className="font-bold text-lg">{item.titre}</h3>
//             <p>{item.description}</p>
//             {item.image && <img src={item.image} alt="" className="w-full h-auto mt-2" />}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const ContenuPage = ({ type }) => {
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Gestion des {type}</h1>
//       <DynamicContenuForm type={type} />
//       <ContenuList type={type} />
//     </div>
//   );
// };

// export default ContenuPage;

// src/components/ContenuList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Paper, Grid } from '@mui/material';

const ContenuList = () => {
  const { type } = useParams();
  const [contenus, setContenus] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/contenus/${type}`)
      .then(res => setContenus(res.data))
      .catch(err => console.error('Erreur chargement:', err));
  }, [type]);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Liste des {type}</Typography>
      {/* <Grid container spacing={2}>
        {contenus.map((contenu) => (
          <Grid item xs={12} key={contenu._id}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6">{contenu.titre}</Typography>
              <Typography>{contenu.description}</Typography>
              <img src={contenu.image} alt={contenu.titre} style={{ maxWidth: '100%' }} />
              <div dangerouslySetInnerHTML={{ __html: contenu.code }} />
            </Paper>
          </Grid>
        ))}
      </Grid> */}

<div>
            {contenus.length > 0 ? (
                contenus.map((contenu, index) => (
                    <div key={contenu._id} style={contenu.styles}>
                        {/* Use dangerouslySetInnerHTML to inject HTML content */}
                        <div dangerouslySetInnerHTML={{ __html: contenu.code }} />
                    </div>
                ))
            ) : (
                <p>No {type} available</p>
            )}
        </div>

        
    </div>
  );
};

export default ContenuList;
