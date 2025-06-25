// import React from 'react';
// import './News.css';

// export default function NewsStyleOne({ news }) {
//   return (
//     <div className="news-container style-one">
//       <div className="news-grid">
//         {news.map((item, index) => (
//           <div className="news-card" key={index}>
//             <div className="news-title-container" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
//               {item.image && (
//                 <img
//                   src={item.image}
//                   alt={item.name || "Image de l'actualité"}
//                   style={{
//                     width: '40px',
//                     height: '40px',
//                     objectFit: 'cover',
//                     marginRight: '8px',
//                     verticalAlign: 'middle',
//                   }}
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/40";
//                   }}
//                 />
//               )}
//               <h3 style={{ margin: 0 }}>{item.name}</h3>
//             </div>
//             <p>{item.desc}</p>
//             <button>Read More</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import './News.css';

export default function NewsStyleOne({ news }) {
  const [activeCard, setActiveCard] = useState(null);

  const toggleCard = (index) => {
    setActiveCard(activeCard === index ? null : index);
  };

  return (
    <div className="news-container style-one">
      <div className="news-grid">
        {news.map((item, index) => (
          <div 
            className={`news-card ${activeCard === index ? 'active' : ''}`} 
            key={index}
          >
            <div className="news-image-container">
              <img
                src={item.image}
                alt={item.name || "Image de l'actualité"}
                className="news-image"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300";
                }}
              />
                {/* <div className="image-bottom-gradient"></div> */}

            </div>
            
            <div className="news-title-wrapper" onClick={() => toggleCard(index)}>
              <div>{item.name}..</div>
              <button className="news-toggle-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {activeCard === index && (
              <div className="news-description-container scale-up-hor-right">
                <div className="news-description">
                  <div>{item.desc}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}