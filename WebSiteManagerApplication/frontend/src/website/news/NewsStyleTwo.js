// // src/components/NewsStyleTwo.js
// import React from 'react';
// import './News.css';
// import SupportAgentIcon from '@mui/icons-material/SupportAgent';
// import EqualizerIcon from '@mui/icons-material/Equalizer';
// import SchoolIcon from '@mui/icons-material/School';

// const iconMap = {
//   SupportAgentIcon: SupportAgentIcon,
//   EqualizerIcon: EqualizerIcon,
//   SchoolIcon: SchoolIcon,
// };

// export default function NewsStyleTwo({ news }) {
//   return (
//     <div className="news-container style-two">
//       <div className="news-grid">
//         {news.map((item, index) => {
//           const IconComponent = iconMap[item.icon];
//           return (
//             <div className="news-card" key={index}>
//               <div className="news-icon">
//                 <IconComponent style={{ fontSize: 40, color: 'white' }} />
//               </div>
//               <h3>{item.name}</h3>
//               <p>{item.desc}</p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import React from 'react';
import './News.css';

export default function NewsStyleTwo({ news }) {
  return (
    <div className="news-container style-two">
      <div className="news-grid">
        {news.map((item, index) => (
          <div className="news-card" key={index}>
            <div className="news-title-container" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name || "Image de l'actualité"}
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    marginRight: '8px',
                    verticalAlign: 'middle',
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/40";
                  }}
                />
              )}
              <h3 style={{ margin: 0 }}>{item.name}</h3>
            </div>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}