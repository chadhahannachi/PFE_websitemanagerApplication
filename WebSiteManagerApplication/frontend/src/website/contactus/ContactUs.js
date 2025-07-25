// // components/ContactUs.js
// import React from 'react';
// import './ContactUs.css';

// const ContactUs = () => {
//   return (
//     <section className="contact-us">
//       <div className="contact-container">
//         <div className="contact-info">
//           <h2>Contact Us</h2>
//           <p>
//             Massa urna magnis dignissim id euismod porttitor vitae etiam
//             viverra et adipiscing sit morbi aliquet mauris porttitor nisi.
//           </p>
//           <div className="contact-detail">
//             <p><strong>Office:</strong><br />1234 N Spring St, Los Angeles, CA 90012, United States.</p>
//             <p><strong>Phone:</strong><br />+01 - 123 456 7890</p>
//             <p><strong>Email:</strong><br />mail@example.com</p>
//           </div>
//           <div className="social-icons">
//             <i className="fab fa-twitter"></i>
//             <i className="fab fa-youtube"></i>
//             <i className="fab fa-facebook"></i>
//             <i className="fab fa-instagram"></i>
//           </div>
//         </div>

//         <div className="contact-form">
//           <h3>Get in Touch</h3>
//           <form>
//             <div className="name-fields">
//               <input type="text" placeholder="First" required />
//               <input type="text" placeholder="Last" required />
//             </div>
//             <input type="email" placeholder="Email" required />
//             <input type="text" placeholder="Subject" required />
//             <textarea placeholder="Comment or Message" required></textarea>
//             <div class="button-container">
//               <button type="submit">Envoyer</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactUs;

import React, { useState } from 'react';
import './ContactUs.css';
import ContactUsStyleOne from './ContactUsStyleOne';
import ContactUsStyleTwo from './ContactUsStyleTwo';

const styles = [
  { name: 'Classic Layout', component: ContactUsStyleOne },
  { name: 'Modern Layout', component: ContactUsStyleTwo },
];

// export default function ContactUs({ styleIndex }) {
  // const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  // const ContactComponent = styles[styleIndex]?.component || ContactUsStyleOne;
  export default function ContactUs() {
     const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  return (
    // <section className="contact-us" style={{ backgroundColor }}>
    <section >
      <ContactUsStyleOne onBackgroundColorChange={setBackgroundColor} />
    </section>
  );
}