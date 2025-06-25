import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import ListAdminABshore from "./listuser/listSuperAdminABshore";
import UpdateUser from "./listuser/UpdateUser";
import SignupForm from "./user/AdduserByAdminABSHORE";
import ListSuperAdminEnt from "./listuser/listSuperAdminEnt";
import ListModerateur from "./listuser/listModerateur";
import LoginForm from './user/login';
import { RequestPasswordReset, ResetPassword } from "./user/resetpwd";
import EntrepriseManager from "./entreprise/EntrepriseManager";
import Profile from "./user/profile";
import AddSuperAdminCompany from "./user/AddSadminToCompany";
import AddMember from "./user/AddSadminToCompany";
import AddMemberByAdminEnt from "./user/AddMemberByAdminEnt";
import MyCompany from "./entreprise/MyCompany";
import PagesManagement from "./BackofficeComponents/PagesManagement";
import SlidesManagement from "./BackofficeComponents/SlidesManagement";
import CarrousselsManagement from "./BackofficeComponents/CarrousselsManagement";
import SolutionsManagement from "./BackofficeComponents/SolutionsManagement";
import UnitesManagement from "./BackofficeComponents/UnitesManagement";
import ServicesManagement from "./BackofficeComponents/ServicesManagement";
import ActualitesManagement from "./BackofficeComponents/ActualitesManagement";
import ArticlesManagement from "./BackofficeComponents/ArticlesManagement";
import APropossManagement from "./BackofficeComponents/AProposManagement";
import EvenementsManagement from "./BackofficeComponents/EvenementsManagement";
import FAQsManagement from "./BackofficeComponents/FAQManagement";
import TemoignagesManagement from "./BackofficeComponents/TemoignagesManagement";
import PartenairesManagement from "./BackofficeComponents/PartenairesManagement";
import ContenuSpecifiquesManagement from "./BackofficeComponents/ContenuSpecifiqueManagement";
import NavbarManagement from "./BackofficeComponents/NavbarManagement";
import FormulaireComponent from "./FormulaireComponent";
import LanguagesManagement from "./BackofficeComponents/LanguagesManager";
import KeywordsManagement from "./BackofficeComponents/ReferencementManager";
import CookiesManagement from "./BackofficeComponents/CookiesManager";


import { Container, Button } from "@mui/material";
import ModalComponent from "./components/ModalComponent";
import SectionRenderer from "./components/SectionRenderer";

import axios from "axios";
import DynamicRenderer from "./Frontoffice/Carroussels/Carroussels";
import AddCarroussel from "./Frontoffice/Carroussels/AddCarroussel";
import Carroussel from "./Frontoffice/Carroussels/Carroussels";
import ContenuPage from "./Frontoffice/Contenus/contenuPage";
import ContenuMenu from "./Frontoffice/Contenus/contenumenu";
import AddContenu from "./Frontoffice/Contenus/addcontenu";
import ContenuList from "./Frontoffice/Contenus/contenuPage";

import CarrouselDisplay from "./Frontoffice/CarrouselDisplay";
import AboutUs from "./website/aboutus/AboutUs";
import OurServices from "./website/services/OurServices";
import OurPartners from "./website/partners/OurPartners";
import LatestEvents from "./website/events/LatestEvents";
import ContactUs from "./website/contactus/ContactUs";
import News from "./website/news/News";
import Testimonials from "./website/testimonials/Testimonials";
import Slider from "./website/slider/Slider";
import HomePage from "./website/HomePage";
import WorkspaceLayout from "./website/WorkspaceLayout";
// import WebsiteEditor from "./website/WebsiteEditor";
// import Editor from "./website/WebsiteEditor";
// import TextEditor from "./website/TextEditorBlock";
import CharteGraphique from "./charteGraphique/charteGraphique";
import ContentManager from "./website/contenuSpecifique/ContentManager";
import Home3 from "./Home/app/home-3/page.tsx";
import RootLayout from "./Home/app/layout.tsx";
import AuthenticationPage from "./Home/app/authentication/page.js";
import ForgotPasswordPage from "./Home/app/authentication/forgot-password/page.js";
import CheckoutPage from "./Home/app/checkout/page.js";
import PayDonePage from "./Home/app/pay-done/page.js";
import NewPasswordPage from "./Home/app/authentication/new-password/page.js";
import LicenceRequestManagement from "./BackofficeComponents/LicenceRequestManagement.js";
import LicenceRequestDetails from "./BackofficeComponents/LicenceRequestDetails.js";
import LicenceDetail from "./Home/components/LicenceDetail/LicenceDetail";
import { ContenuGenerator } from "./components/ContenuGenerator/index.tsx";
import AboutusSectionBackoffice from "./BackofficeComponents/aboutusSectionBackoffice.js";
import ContactUsSection from "./BackofficeComponents/ContactUsSection.js";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const [sections, setSections] = useState([]);

  // Layout pour les routes avec Sidebar et Topbar
  const Layout = ({ children }) => {
    return (
      <div className="app">
        <Sidebar isSidebar={isSidebar} />
        <main className="content">
          <Topbar setIsSidebar={setIsSidebar} />
          {children}
        </main>
      </div>
    );
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Routes avec Layout (Sidebar et Topbar) */}
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/team" element={<Layout><Team /></Layout>} />
          <Route path="/contacts" element={<Layout><Contacts /></Layout>} />
          
          <Route path="/invoices" element={<Layout><Invoices /></Layout>} />
          
          <Route path="/form" element={<Layout><Form /></Layout> } />
          
          <Route path="/bar" element={<Layout><Bar /></Layout> } />
          
          <Route path="/pie" element={<Layout><Pie /></Layout> } />
          
          <Route path="/line" element={<Layout><Line /></Layout> } />
            
          <Route path="/line" element={ <Layout><Line /></Layout>}/>
          <Route path="/faq" element={<Layout><FAQ /></Layout>}/>
          <Route path="/calendar" element={<Layout><Calendar/></Layout>}/>

          <Route path="/geography" element={<Layout><Geography /></Layout>}/>


          <Route path="/ListSuperAdminABshore" element={<Layout><ListAdminABshore /></Layout>}/>
          <Route path="/update-user/:id" element={<Layout> <UpdateUser /> </Layout>}/>
          <Route path="/registration" element={<Layout><SignupForm /></Layout> }/>

          <Route path="/AddMemberByAdminEnt" element={<Layout><AddMemberByAdminEnt /></Layout>} />

          <Route path="/ListSuperAdminEnt" element={<Layout><ListSuperAdminEnt/></Layout> } />
          <Route path="/ListModerateur" element={<Layout><ListModerateur/></Layout>} />

          <Route path="/EntrepriseManager" element={<Layout><EntrepriseManager /></Layout>}/>

          <Route path="/profile" element={ <Layout><Profile /></Layout> }/>

          <Route path="/pagesmanagement" element={<Layout><PagesManagement/></Layout> } />

          <Route path="/slidesmanagement" element={ <Layout><SlidesManagement/></Layout> }/>

          <Route path="/carrousselsmanagement" element={ <Layout><CarrousselsManagement/></Layout> }/>

          <Route path="/solutionsmanagement" element={ <Layout><SolutionsManagement/></Layout> }/>

          <Route path="/unitesmanagement" element={<Layout> <UnitesManagement/></Layout>}/>
          <Route path="/servicesmanagement" element={<Layout> <ServicesManagement/></Layout>}/>
          <Route path="/actualitesmanagement" element={<Layout> <ActualitesManagement/></Layout>}/>
          <Route path="/articlesmanagement" element={<Layout> <ArticlesManagement/></Layout>}/>
          <Route path="/aProposmanagement" element={<Layout> <APropossManagement/></Layout>}/>
          <Route path="/aboutusSectionBackoffice" element={<Layout> <AboutusSectionBackoffice/></Layout>}/>

          <Route path="/evenementmanagement" element={<Layout> <EvenementsManagement/></Layout>}/>
          <Route path="/faqmanagement" element={<Layout> <FAQsManagement/></Layout>}/>
          <Route path="/temoignagesmanagement" element={<Layout> <TemoignagesManagement/></Layout>}/>
          <Route path="/partenairesmanagement" element={<Layout> <PartenairesManagement/></Layout>}/>
          <Route path="/contenuSpecifiquemanagement" element={<Layout> <ContenuSpecifiquesManagement/></Layout>}/>
          <Route path="/navbarmanagement" element={<Layout> <NavbarManagement/></Layout>}/>
          <Route path="/formulaire" element={<Layout> <FormulaireComponent/></Layout>}/>
          <Route path="/languages" element={<Layout> <LanguagesManagement/></Layout>}/>
          <Route path="/keywordsreferencement" element={<Layout> <KeywordsManagement/></Layout>}/>
          <Route path="/cookiesmanagement" element={<Layout> <CookiesManagement/></Layout>}/>
          <Route path="/contactus" element={<Layout> <ContactUsSection/></Layout>}/>


          <Route path="/add-super-admin-company/:entrepriseId" element={<Layout><AddSuperAdminCompany /></Layout>} />
          <Route path="/mycompany" element={<Layout><MyCompany /></Layout>} />

          {/* Routes sans Layout (pas de Sidebar ni Topbar) */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/requestresetpwd" element={<RequestPasswordReset />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />




          <Route path="/frontoffice" element={<SectionRenderer sections={sections}/>} />

          <Route path="/carroussels" element={<Carroussel sections={sections}/>} />
          <Route path="/addcarroussel" element={<AddCarroussel/>} />



          {/* <Route path="/contenu" element={<ContenuPage/>} /> */}
          {/* <Route path="/contenumenu" element={<ContenuMenu/>} />
          <Route path="/contenus/:type" element={<ContenuList />} />
          <Route path="add" element={<AddContenu />} /> */}


        {/* <Route path="/carrousseldisplay" element={<CarrouselDisplay />} /> */}


        {/* <Route path="/homepage" element={<HomePage />} /> */}
        <Route path="/workspacelayout" element={<WorkspaceLayout />} />
        {/* <Route path="/Editor" element={<Editor />} /> */}
        <Route path="/CharteGraphique" element={<CharteGraphique />} />
        <Route path="/contentm" element={<ContentManager />} />
        <Route path="/homepage/:entrepriseId/:entrepriseName" element={<HomePage />} />

          <Route path="/hometh" element={<RootLayout><Home3 /></RootLayout>} />
          <Route path="/authentication" element={<RootLayout>< AuthenticationPage/></RootLayout>} />
          <Route path="/authentication/forgot-password" element={<RootLayout>< ForgotPasswordPage/></RootLayout>} />
          <Route path="/checkout" element={<RootLayout>< CheckoutPage/></RootLayout>} />
          <Route path="/pay-done" element={<RootLayout>< PayDonePage/></RootLayout>} />
          
          <Route path="/new-password/:token" element={<NewPasswordPage />} />

          <Route path="/licenceRequestList" element={<Layout><LicenceRequestManagement /></Layout>} />
          <Route path="/licence-requests/:id" element={<LicenceRequestDetails />} />
          <Route path="/licence/:id" element={<LicenceDetail />} />


<Route 
            path="/contenugenerator/:entrepriseId" 
            element={<ContenuGenerator />}
          />

        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );



  // const [sections, setSections] = useState([]);

  // return (
  //   <Container>
  //     <SectionRenderer sections={sections}/>
  //   </Container>
  // );


}

export default App;