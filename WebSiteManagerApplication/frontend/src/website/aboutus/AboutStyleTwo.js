import React from 'react';
import './AboutUs.css';
import aboutus from '../../images/aboutus.webp';
import h2_about_img_shape from '../../images/h2_about_img_shape.png';

export default function AboutStyleTwo() {
  return (
    <div className="about-us">
      <div className="about-us-content">
        <div className="about-img">
          <img className="main" src={aboutus} alt="about" />
          <div className="shape">
            <img src={h2_about_img_shape} alt="shape" />
          </div>
        </div>
        <div className="about-content">
          <span className="subtitle">About</span>
          <h2>Abshore is a Digital Services Company.</h2>
          <p>
            Since 2012, our company has been supporting our clients in the conception, development, and integration of business applications, providing personalized solutions that effectively address their unique and challenging demands.
            We drive the digital transformation of organizations, advising and assisting our clients and partners in selecting appropriate technologies to enhance their performance.
            At ABSHOHRE, We have a multidisciplinary teams that follows international project management standards. Additionally, we provide support services to companies for their infrastructures, thanks to our specialized DevOps and SysOps teams. Our project managers are certified according to PMI and ITIL standards.
            We are based in France and Tunisia, with representation offices in Benin and the Democratic Republic of the Congo (DRC).
          </p>
          <a href="#" className="btn">Lire Plus</a>
        </div>
      </div>
    </div>
  );
}
