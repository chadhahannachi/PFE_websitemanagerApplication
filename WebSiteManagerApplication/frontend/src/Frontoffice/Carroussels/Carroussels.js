import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Carroussel = () => {
    const [carrousels, setCarrousels] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/carroussels') // Replace with your actual backend URL
            .then(response => setCarrousels(response.data))
            .catch(error => console.error('Error loading carrousels:', error));
    }, []);

    return (
        <div>

            
<Link to="/addcarroussel" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="warning">
                    Ajouter un nouveau carroussel
                </Button>
            </Link>
                  

        <div>
            {carrousels.length > 0 ? (
                carrousels.map((carroussel, index) => (
                    <div key={carroussel._id} style={carroussel.styles}>
                        {/* Use dangerouslySetInnerHTML to inject HTML content */}
                        <div dangerouslySetInnerHTML={{ __html: carroussel.code }} />
                    </div>
                ))
            ) : (
                <p>No carousels available</p>
            )}
        </div>
        </div>
    );
};

export default Carroussel;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import CarrouselForm from './CarrouselForm';

// const Carroussel = () => {
//     const [carrousels, setCarrousels] = useState([]);

//     useEffect(() => {
//         fetchCarrousels();
//     }, []);

//     const fetchCarrousels = () => {
//         axios.get('http://localhost:5000/carroussels')
//             .then(response => setCarrousels(response.data))
//             .catch(error => console.error('Error loading carrousels:', error));
//     };

//     return (
//         <div>
//             <CarrouselForm onCarrouselCreated={fetchCarrousels} />

//             {carrousels.length > 0 ? (
//                 carrousels.map((carroussel) => (
//                     <div key={carroussel._id} style={carroussel.styles}>
//                         <h2>{carroussel.titre}</h2>
//                         <div style={{ display: 'flex', gap: '15px', overflow: 'auto' }}>
//                         {carroussel.contenus.map((contenu, index) => (
//     <div key={contenu._id || `${carroussel._id}-${index}`} style={{ padding: '10px', background: 'white', borderRadius: '10px' }}>
//         <img src={contenu.image} alt={contenu.titre} style={{ width: '80px', height: '80px' }} />
//         <h3>{contenu.titre}</h3>
//         <p>{contenu.description}</p>
//     </div>
// ))}

//                         </div>
//                     </div>
//                 ))
//             ) : (
//                 <p>No carousels available</p>
//             )}
//         </div>
//     );
// };

// export default Carroussel;
