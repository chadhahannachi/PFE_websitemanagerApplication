import "../assets/css/bootstrap.min.css";
import "../assets/css/remixicon.css";
import "../assets/css/flaticon.css";
import "../assets/css/header.css";
import "../assets/css/footer.css";
import "../assets/css/dark-switch-btn.css";
import 'swiper/css/bundle';
import 'react-accessible-accordion/dist/fancy-example.css';
// import 'react-accessible-accordion/dist/accordion.css';

// Globals Style
import "../assets/css/globals.css";
import "../assets/css/responsive.css";
// Dark Mode Style
import '../assets/css/dark-mode.css'
// RTL Style
import '../assets/css/rtl.css'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
