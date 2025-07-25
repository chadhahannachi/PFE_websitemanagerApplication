// import React, { useState } from 'react';
// import './FaqSection.css';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// export default function FaqStyleOne({ faqs }) {
//   const [activeIndex, setActiveIndex] = useState(null);

//   const toggleFAQ = (index) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   return (
//     <div className="faq-container style-one">
//       {faqs.map((faq, index) => (
//         <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
//           <button className="faq-question" onClick={() => toggleFAQ(index)}>
//             <span>{faq.question}</span>
//             <span className="faq-toggle">{activeIndex === index ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}</span>
//           </button>
//           <div className="faq-answer">
//             <p>{faq.answer}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


import React, { useState } from 'react';
import './FaqSection.css';
import EditorFaqList from './EditorFaqList';

import ReactDOM from 'react-dom';

const SuccessNotification = ({ show, message }) => {
  if (!show) return null;
  
  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#c6c6c6',
      color: 'white',
      padding: '15px 25px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 10000,
      fontSize: '16px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'slideInRight 0.3s ease-out',
      border: '1px solid #c6c6c6',
      pointerEvents: 'none'
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#c6c6c6',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        ✓
      </div>
      {message}
    </div>,
    document.body
  );
};

export default function FaqStyleOne({ faqs }) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const initialPosition = {
    faqList: { top: 0, left: 0 },
  };

  const initialStyles = {
    faqList: {
      button: {
        color: '#333333',
        backgroundColor: '#ffffff',
        fontSize: '1rem',
        fontFamily: 'Arial',
        borderRadius: '0px',
        hoverColor: '#555555',
      },
      answer: {
        backgroundColor: '#ffffff',
        color: '#666666',
        fontSize: '1rem',
        fontFamily: 'Arial',
      },
      width: 600,
      minHeight: 400,
    }
  };

  return (
    <div className="faq-style-one-container">
      <EditorFaqList
        faqs={faqs}
        initialPosition={initialPosition.faqList}
        initialStyles={initialStyles.faqList}
        onSelect={setSelectedElement}
        isAccordion={true}
      />
    </div>
  );
}