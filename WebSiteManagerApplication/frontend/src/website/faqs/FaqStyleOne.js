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

export default function FaqStyleOne({ faqs }) {
  const [selectedElement, setSelectedElement] = useState(null);

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