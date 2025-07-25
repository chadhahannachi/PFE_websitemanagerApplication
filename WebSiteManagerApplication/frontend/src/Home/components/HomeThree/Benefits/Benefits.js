import React from "react";
import icon1 from '../../../images/icons/icon1.png';
import icon2 from '../../../images/icons/icon2.png';
import icon3 from '../../../images/icons/icon3.png';


const benefitsData = [
    {
      id: "1",
      icon: (<img src={icon1} alt="icon" width={110} height={110} />),
      title: "AI-Powered Content",
      shortText:
        "Automatically generates relevant sections and texts, making web page creation faster and easier.",
    },
    {
      id: "2",
      icon: (<img src={icon2} alt="icon" width={110} height={110} />),
      title: "Flexibility and Scalability",
      shortText:
        "Easily adapt your website to evolving needs by adding or removing components, changing the structure, or updating the design—without starting from scratch.",
    },
    {
      id: "3",
      icon: (<img src={icon3} alt="icon" width={110} height={110} />),
      title: "Fast Website Creation",
      shortText:
        "Significantly reduces the time needed to design and customize a website, even with no technical background.",
    },
  ];
  

const Benefits= () => {
  return (
    <>
      <div className="benefits-area pt-175 pb-150" style={{ marginTop: '-60px' }}>
        <div className="container">
          <div 
            className="section-title"
          >
            <span className="top-title">BENEFITS</span>
            <h2>WebsiteManager is a no-code solution to design and launch websites easily</h2>
          </div>

          {benefitsData && (
            <div 
              className="row justify-content-center" 
            >
              {benefitsData &&
                benefitsData.map((value, i) => (
                  <div className="col-lg-4 col-sm-6 for-child" key={i}>
                    <div className="benefits-single-item me-lg-auto">
                      <div className="benefit-icon">
                        {value.icon}
                      </div>
                      <h5>{value.title}</h5>
                      <p>{value.shortText}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Benefits;
