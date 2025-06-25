
import React, { useRef } from 'react';
import '../../website/news/News.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function NewsStyleThreeDisplay({ news }) {
  const newsGridRef = useRef(null);

  const scrollLeft = () => {
    if (newsGridRef.current) {
      newsGridRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (newsGridRef.current) {
      newsGridRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="news-container style-three">
      <button className="nav-arrow left-arrow" onClick={scrollLeft}>
        <ArrowBackIosIcon />
      </button>
      <div className="news-grid" ref={newsGridRef}>
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
      <button className="nav-arrow right-arrow" onClick={scrollRight}>
        <ArrowForwardIosIcon />
      </button>
    </div>
  );
}