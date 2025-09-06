import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import HomePageOne from "./pages/HomePageOne";
import HomePageTwo from "./pages/HomePageTwo";
import HomePageThree from "./pages/HomePageThree";
import HomePageFour from "./pages/HomePageFour";
import HomePageFive from "./pages/HomePageFive";
import HomePageSix from "./pages/HomePageSix";
import HomePageSeven from "./pages/HomePageSeven";
import EmailPage from "./pages/EmailPage";
import AddUserPage from "./pages/AddUserPage";
import AlertPage from "./pages/AlertPage";
import AssignRolePage from "./pages/AssignRolePage";
import AvatarPage from "./pages/AvatarPage";
import BadgesPage from "./pages/BadgesPage";
import ButtonPage from "./pages/ButtonPage";
import CalendarMainPage from "./pages/CalendarMainPage";
import CardPage from "./pages/CardPage";
import CarouselPage from "./pages/CarouselPage";
import ChatEmptyPage from "./pages/ChatEmptyPage";
import ChatMessagePage from "./pages/ChatMessagePage";
import ChatProfilePage from "./pages/ChatProfilePage";
import CodeGeneratorNewPage from "./pages/CodeGeneratorNewPage";
import CodeGeneratorPage from "./pages/CodeGeneratorPage";
import ColorsPage from "./pages/ColorsPage";
import ColumnChartPage from "./pages/ColumnChartPage";
import CompanyPage from "./pages/CompanyPage";
import CurrenciesPage from "./pages/CurrenciesPage";
import DropdownPage from "./pages/DropdownPage";
import ErrorPage from "./pages/ErrorPage";
import FaqPage from "./pages/FaqPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import FormLayoutPage from "./pages/FormLayoutPage";
import FormValidationPage from "./pages/FormValidationPage";
import FormPage from "./pages/FormPage";
import GalleryPage from "./pages/GalleryPage";
import ImageGeneratorPage from "./pages/ImageGeneratorPage";
import ImageUploadPage from "./pages/ImageUploadPage";
import InvoiceAddPage from "./pages/InvoiceAddPage";
import InvoiceEditPage from "./pages/InvoiceEditPage";
import InvoiceListPage from "./pages/InvoiceListPage";
import InvoicePreviewPage from "./pages/InvoicePreviewPage";
import KanbanPage from "./pages/KanbanPage";
import LanguagePage from "./pages/LanguagePage";
import LineChartPage from "./pages/LineChartPage";
import ListPage from "./pages/ListPage";
import MarketplaceDetailsPage from "./pages/MarketplaceDetailsPage";
import MarketplacePage from "./pages/MarketplacePage";
import NotificationAlertPage from "./pages/NotificationAlertPage";
import NotificationPage from "./pages/NotificationPage";
import PaginationPage from "./pages/PaginationPage";
import PaymentGatewayPage from "./pages/PaymentGatewayPage";
import PieChartPage from "./pages/PieChartPage";
import PortfolioPage from "./pages/PortfolioPage";
import PricingPage from "./pages/PricingPage";
import ProgressPage from "./pages/ProgressPage";
import RadioPage from "./pages/RadioPage";
import RoleAccessPage from "./pages/RoleAccessPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import StarRatingPage from "./pages/StarRatingPage";
import StarredPage from "./pages/StarredPage";
import SwitchPage from "./pages/SwitchPage";
import TableBasicPage from "./pages/TableBasicPage";
import TableDataPage from "./pages/TableDataPage";
import TabsPage from "./pages/TabsPage";
import TagsPage from "./pages/TagsPage";
import TermsConditionPage from "./pages/TermsConditionPage";
import TextGeneratorPage from "./pages/TextGeneratorPage";
import ThemePage from "./pages/ThemePage";
import TooltipPage from "./pages/TooltipPage";
import TypographyPage from "./pages/TypographyPage";
import UsersGridPage from "./pages/UsersGridPage";
import UsersListPage from "./pages/UsersListPage";
import ViewDetailsPage from "./pages/ViewDetailsPage";
import VideoGeneratorPage from "./pages/VideoGeneratorPage";
import VideosPage from "./pages/VideosPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import VoiceGeneratorPage from "./pages/VoiceGeneratorPage";
import WalletPage from "./pages/WalletPage";
import WidgetsPage from "./pages/WidgetsPage";
import WizardPage from "./pages/WizardPage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import TextGeneratorNewPage from "./pages/TextGeneratorNewPage";
import HomePageEight from "./pages/HomePageEight";
import HomePageNine from "./pages/HomePageNine";
import HomePageTen from "./pages/HomePageTen";
import HomePageEleven from "./pages/HomePageEleven";
import GalleryGridPage from "./pages/GalleryGridPage";
import GalleryMasonryPage from "./pages/GalleryMasonryPage";
import GalleryHoverPage from "./pages/GalleryHoverPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import AddBlogPage from "./pages/AddBlogPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import MaintenancePage from "./pages/MaintenancePage";
import BlankPagePage from "./pages/BlankPagePage";

import MasterLayout from "./masterLayout/MasterLayout";
// import { Breadcrumb } from "react-bootstrap";
import AddUser from "./Backoffice/UserManagement/AddUser";
import Team from "./Backoffice/UserManagement/TeamList";
import AddMember from "./Backoffice/UserManagement/AddMember";
import Profile from "./Backoffice/UserManagement/Profile";
import Breadcrumb from "./components/Breadcrumb";
import UserDetail from "./Backoffice/UserManagement/UserDetail";
import CompanyList from "./Backoffice/Company Management/CompanyList";
import CompanyDetail from "./Backoffice/Company Management/CompanyDetail";
import AddCompany from "./Backoffice/Company Management/AddCompany";
import MyCompany from "./Backoffice/Company Management/MyCompany";
import LicenceRequestsList from "./Backoffice/LicenceManagement/LicenceRequestsList";
import LicenceRequestDetail from "./Backoffice/LicenceManagement/LicenceRequestDetail";
import Archive from "./Backoffice/Archive/Archive";
import LicenceList from "./Backoffice/LicenceManagement/LicenceList";
import MyLicence from "./Backoffice/LicenceManagement/MyLicence";
import PaymentList from "./Backoffice/LicenceManagement/PaymentList";
import PaymentDetail from "./Backoffice/LicenceManagement/PaymentDetail";
import SlidesList from "./Backoffice/WebSite/Components/SlidesList";
import PartnersList from "./Backoffice/WebSite/Components/PartnersList";
import ServicesList from "./Backoffice/WebSite/Components/ServicesList";
import SolutionsList from "./Backoffice/WebSite/Components/SolutionsList";
import UnitsList from "./Backoffice/WebSite/Components/UnitsList";
import FAQList from "./Backoffice/WebSite/Components/FaqList";
import EventsList from "./Backoffice/WebSite/Components/EventsList";
import ArchiveCompany from "./Backoffice/Archive/ArchiveCompany";
import ArchiveContent from "./Backoffice/Archive/ArchiveContent";
import AboutUsSection from "./Backoffice/WebSite/Components/AboutUsSection";
import ContactUsSection from "./Backoffice/WebSite/Components/ContactUs";
import LicenceDetail from "./Backoffice/LicenceManagement/LicenceDetail";
import CharteGraphique from "./Backoffice/WebSite/CharteGraphique";
import AiComponentList from "./Backoffice/WebSite/Components/AiComponentList";
import AbshoreDashboard from "./Backoffice/Dashboard/AbshoreDashboard";
import FormManagement from "./Backoffice/WebSite/FormManagement/FormManagement";
import FormSubmissions from "./Backoffice/WebSite/FormSubmissions";
import { useEffect } from "react";
import WebsiteManagement from "./Backoffice/WebSite/MyWebsite";
import UsersList from "./Backoffice/UserManagement/UsersList";
import ProtectedSuperAdminAbshoreRoute from "./ProtectedSuperAdminAbshoreRoute";
import ProtectedRoute from "./ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import WebsitesList from "./Backoffice/WebSite/WebsitesList";
import MyPaymentList from "./Backoffice/LicenceManagement/MyPaymentList";


function RedirectByRole() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.sub;
      axios.get(`http://localhost:5000/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        const role = response.data.role;
        if (role === "superadminabshore") {
          navigate("/AbshoreDashboard", { replace: true });
        } else if (role === "superadminentreprise" || role === "moderateur") {
          navigate("/WebsiteManagement", { replace: true });
        }
      });
    } catch (e) {
      // Token invalide, ne fait rien
    }
  }, [navigate]);

  return null;
}

function ExternalRedirect() {
  useEffect(() => {
    window.location.replace('http://localhost:3001/');
  }, []);
  return null;
}

function App() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const from = params.get('from');
  
    if (token) {
      localStorage.setItem("token", token);
  
      // Si on vient de 3001, on retourne l'utilisateur là-bas
      if (from === "3001") {
        window.location.href = "http://localhost:3000";
      }
    }
  }, []);


  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>

      
      <Route exact path='/' element={<RedirectByRole />} />

        {/* Breadcrumb */}
        <Route exact path='/UsersList' element={<MasterLayout><Breadcrumb title="Users List" /><ProtectedSuperAdminAbshoreRoute><UsersList/></ProtectedSuperAdminAbshoreRoute></MasterLayout>} />
        <Route exact path='/Team' element={<MasterLayout><Breadcrumb title="Team" /><ProtectedRoute><Team /></ProtectedRoute></MasterLayout>} />
        <Route exact path='/AddUserPage' element={<MasterLayout><Breadcrumb title="Add User" /><ProtectedSuperAdminAbshoreRoute><AddUser /></ProtectedSuperAdminAbshoreRoute></MasterLayout>} />
        <Route exact path='/AddMember' element={<MasterLayout><Breadcrumb title="Add Member" /><ProtectedRoute><AddMember /></ProtectedRoute></MasterLayout>} />
        
        <Route exact path='/Profile' element={<MasterLayout><Breadcrumb title="Profile" /><ProtectedRoute><Profile /></ProtectedRoute></MasterLayout>} />
        <Route exact path='/UserDetail/:id' element={<MasterLayout><Breadcrumb title="User Detail" /><ProtectedRoute><UserDetail /></ProtectedRoute></MasterLayout>} />
        <Route exact path='/CompanyList' element={<MasterLayout><Breadcrumb title="Company List" /><ProtectedSuperAdminAbshoreRoute><CompanyList /></ProtectedSuperAdminAbshoreRoute></MasterLayout>} />
        <Route exact path='/CompanyDetail/:id' element={<MasterLayout><Breadcrumb title="Company Detail" /><ProtectedRoute><CompanyDetail /></ProtectedRoute></MasterLayout>} />
        <Route exact path='/AddCompany' element={<MasterLayout><Breadcrumb title="Add Company" /><ProtectedSuperAdminAbshoreRoute><AddCompany /></ProtectedSuperAdminAbshoreRoute></MasterLayout>} />
        <Route exact path='/MyCompany' element={<MasterLayout><Breadcrumb title="My Company" /><ProtectedRoute><MyCompany /></ProtectedRoute></MasterLayout>} />
        <Route exact path='/LicenceRequestsList' element={<MasterLayout><Breadcrumb title="Licence Requests List" /><ProtectedSuperAdminAbshoreRoute><LicenceRequestsList /></ProtectedSuperAdminAbshoreRoute></MasterLayout>} />
        <Route exact path='/LicenceRequestDetail/:id' element={<MasterLayout><Breadcrumb title="Licence Request Detail" /><ProtectedRoute><LicenceRequestDetail /></ProtectedRoute></MasterLayout>} />
        <Route exact path='/LicenceList' element={<MasterLayout><Breadcrumb title="Licence List" /><ProtectedSuperAdminAbshoreRoute><LicenceList/></ProtectedSuperAdminAbshoreRoute></MasterLayout>} />
        <Route exact path='/MyLicence' element={<MasterLayout><Breadcrumb title="My Licence" /><ProtectedRoute><MyLicence/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/LicenceDetail/:id' element={<MasterLayout><Breadcrumb title="Licence Detail" /><ProtectedRoute><LicenceDetail/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/PaymentList' element={<MasterLayout><Breadcrumb title="Invoices" /><ProtectedSuperAdminAbshoreRoute><PaymentList/></ProtectedSuperAdminAbshoreRoute></MasterLayout>} />
        <Route exact path='/PaymentDetail/:id' element={<MasterLayout><Breadcrumb title="Invoices" /><ProtectedRoute><PaymentDetail/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/MyPaymentList' element={<MasterLayout><Breadcrumb title="MyInvoices" /><ProtectedRoute><MyPaymentList/></ProtectedRoute></MasterLayout>} />

        <Route exact path='/SlidesList' element={<MasterLayout><Breadcrumb title="Slides" /><ProtectedRoute><SlidesList/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/PartnersList' element={<MasterLayout><Breadcrumb title="Partners" /><ProtectedRoute><PartnersList/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/ServicesList' element={<MasterLayout><Breadcrumb title="Services" /><ProtectedRoute><ServicesList/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/SolutionsList' element={<MasterLayout><Breadcrumb title="SolutionsList" /><ProtectedRoute><SolutionsList/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/UnitsList' element={<MasterLayout><Breadcrumb title="Units" /><ProtectedRoute><UnitsList/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/FAQList' element={<MasterLayout><Breadcrumb title="FAQ " /><ProtectedRoute><FAQList/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/EventsList' element={<MasterLayout><Breadcrumb title="Events" /><ProtectedRoute><EventsList/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/AboutUsSection' element={<MasterLayout><Breadcrumb title="About Us" /><ProtectedRoute><AboutUsSection/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/ContactUsSection' element={<MasterLayout><Breadcrumb title="Contact Us" /><ProtectedRoute><ContactUsSection/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/CharteGraphique' element={<MasterLayout><Breadcrumb title="Charte Graphique" /><ProtectedRoute><CharteGraphique/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/AiComponentList' element={<MasterLayout><Breadcrumb title="Ai Components List" /><ProtectedRoute><AiComponentList/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/FormManagement' element={<MasterLayout><Breadcrumb title="Form Management" /><ProtectedRoute><FormManagement/></ProtectedRoute></MasterLayout>} />
        <Route exact path='/FormSubmissions' element={<MasterLayout><Breadcrumb title="Form Submissions" /><ProtectedRoute><FormSubmissions/></ProtectedRoute></MasterLayout>} />
        
        
        <Route exact path='/WebsitesList' element={<MasterLayout><Breadcrumb title="Websites Management" /><ProtectedSuperAdminAbshoreRoute><WebsitesList/></ProtectedSuperAdminAbshoreRoute></MasterLayout>} />

        <Route exact path='/WebsiteManagement' element={<MasterLayout><Breadcrumb title="Website Management" /><ProtectedRoute><WebsiteManagement/></ProtectedRoute></MasterLayout>} />
        {/* <Route exact path='/WebsiteManagement' element={<MasterLayout><Breadcrumb title="Website Management" /><WebsiteManagement/></MasterLayout>} /> */}
        
        


        <Route exact path='/Archive' element={<MasterLayout><Breadcrumb title="Archive" /><ProtectedRoute><Archive /></ProtectedRoute></MasterLayout>} />
        <Route exact path='/ArchiveCompany' element={<MasterLayout><Breadcrumb title="Archive" /><ProtectedSuperAdminAbshoreRoute><ArchiveCompany /></ProtectedSuperAdminAbshoreRoute></MasterLayout>} />
        <Route exact path='/ArchiveContent' element={<MasterLayout><Breadcrumb title="Archive" /><ProtectedRoute><ArchiveContent /></ProtectedRoute></MasterLayout>} />
        <Route exact path='/AbshoreDashboard' element={<MasterLayout><Breadcrumb title="Dashboard" /><ProtectedSuperAdminAbshoreRoute><AbshoreDashboard /></ProtectedSuperAdminAbshoreRoute></MasterLayout>} />




























        <Route exact path='/DashboardOne' element={<HomePageOne />} />
        <Route exact path='/index-2' element={<HomePageTwo />} />
        <Route exact path='/index-3' element={<HomePageThree />} />
        <Route exact path='/index-4' element={<HomePageFour />} />
        <Route exact path='/index-5' element={<HomePageFive />} />
        <Route exact path='/index-6' element={<HomePageSix />} />
        <Route exact path='/index-7' element={<HomePageSeven />} />
        <Route exact path='/index-8' element={<HomePageEight />} />
        <Route exact path='/index-9' element={<HomePageNine />} />
        <Route exact path='/index-10' element={<HomePageTen />} />
        <Route exact path='/index-11' element={<HomePageEleven />} />

        {/* SL */}
        <Route exact path='/add-user' element={<AddUserPage />} />
        <Route exact path='/alert' element={<AlertPage />} />
        <Route exact path='/assign-role' element={<AssignRolePage />} />
        <Route exact path='/avatar' element={<AvatarPage />} />
        <Route exact path='/badges' element={<BadgesPage />} />
        <Route exact path='/button' element={<ButtonPage />} />
        <Route exact path='/calendar-main' element={<CalendarMainPage />} />
        <Route exact path='/calendar' element={<CalendarMainPage />} />
        <Route exact path='/card' element={<CardPage />} />
        <Route exact path='/carousel' element={<CarouselPage />} />
        <Route exact path='/chat-empty' element={<ChatEmptyPage />} />
        <Route exact path='/chat-message' element={<ChatMessagePage />} />
        <Route exact path='/chat-profile' element={<ChatProfilePage />} />
        <Route exact path='/code-generator' element={<CodeGeneratorPage />} />
        <Route
          exact
          path='/code-generator-new'
          element={<CodeGeneratorNewPage />}
        />
        <Route exact path='/colors' element={<ColorsPage />} />
        <Route exact path='/column-chart' element={<ColumnChartPage />} />
        <Route exact path='/company' element={<CompanyPage />} />
        <Route exact path='/currencies' element={<CurrenciesPage />} />
        <Route exact path='/dropdown' element={<DropdownPage />} />
        <Route exact path='/email' element={<EmailPage />} />
        <Route exact path='/faq' element={<FaqPage />} />
        <Route exact path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route exact path='/form-layout' element={<FormLayoutPage />} />
        <Route exact path='/form-validation' element={<FormValidationPage />} />
        <Route exact path='/form' element={<FormPage />} />

        <Route exact path='/gallery' element={<GalleryPage />} />
        <Route exact path='/gallery-grid' element={<GalleryGridPage />} />
        <Route exact path='/gallery-masonry' element={<GalleryMasonryPage />} />
        <Route exact path='/gallery-hover' element={<GalleryHoverPage />} />

        <Route exact path='/blog' element={<BlogPage />} />
        <Route exact path='/blog-details' element={<BlogDetailsPage />} />
        <Route exact path='/add-blog' element={<AddBlogPage />} />

        <Route exact path='/testimonials' element={<TestimonialsPage />} />
        <Route exact path='/coming-soon' element={<ComingSoonPage />} />
        <Route exact path='/access-denied' element={<AccessDeniedPage />} />
        <Route exact path='/maintenance' element={<MaintenancePage />} />
        <Route exact path='/blank-page' element={<BlankPagePage />} />

        <Route exact path='/image-generator' element={<ImageGeneratorPage />} />
        <Route exact path='/image-upload' element={<ImageUploadPage />} />
        <Route exact path='/invoice-add' element={<InvoiceAddPage />} />
        <Route exact path='/invoice-edit' element={<InvoiceEditPage />} />
        <Route exact path='/invoice-list' element={<InvoiceListPage />} />
        <Route exact path='/invoice-preview' element={<InvoicePreviewPage />} />
        <Route exact path='/kanban' element={<KanbanPage />} />
        <Route exact path='/language' element={<LanguagePage />} />
        <Route exact path='/line-chart' element={<LineChartPage />} />
        <Route exact path='/list' element={<ListPage />} />
        <Route
          exact
          path='/marketplace-details'
          element={<MarketplaceDetailsPage />}
        />
        <Route exact path='/marketplace' element={<MarketplacePage />} />
        <Route
          exact
          path='/notification-alert'
          element={<NotificationAlertPage />}
        />
        <Route exact path='/notification' element={<NotificationPage />} />
        <Route exact path='/pagination' element={<PaginationPage />} />
        <Route exact path='/payment-gateway' element={<PaymentGatewayPage />} />
        <Route exact path='/pie-chart' element={<PieChartPage />} />
        <Route exact path='/portfolio' element={<PortfolioPage />} />
        <Route exact path='/pricing' element={<PricingPage />} />
        <Route exact path='/progress' element={<ProgressPage />} />
        <Route exact path='/radio' element={<RadioPage />} />
        <Route exact path='/role-access' element={<RoleAccessPage />} />
        <Route exact path='/sign-in' element={<SignInPage />} />
        <Route exact path='/sign-up' element={<SignUpPage />} />
        <Route exact path='/star-rating' element={<StarRatingPage />} />
        <Route exact path='/starred' element={<StarredPage />} />
        <Route exact path='/switch' element={<SwitchPage />} />
        <Route exact path='/table-basic' element={<TableBasicPage />} />
        <Route exact path='/TableDataPage' element={<TableDataPage />} />
        <Route exact path='/tabs' element={<TabsPage />} />
        <Route exact path='/tags' element={<TagsPage />} />
        <Route exact path='/terms-condition' element={<TermsConditionPage />} />
        <Route
          exact
          path='/text-generator-new'
          element={<TextGeneratorNewPage />}
        />
        <Route exact path='/text-generator' element={<TextGeneratorPage />} />
        <Route exact path='/theme' element={<ThemePage />} />
        <Route exact path='/tooltip' element={<TooltipPage />} />
        <Route exact path='/typography' element={<TypographyPage />} />
        <Route exact path='/users-grid' element={<UsersGridPage />} />
        <Route exact path='/users-list' element={<UsersListPage />} />
        <Route exact path='/view-details' element={<ViewDetailsPage />} />
        <Route exact path='/video-generator' element={<VideoGeneratorPage />} />
        <Route exact path='/videos' element={<VideosPage />} />
        <Route exact path='/view-profile' element={<ViewProfilePage />} />
        <Route exact path='/voice-generator' element={<VoiceGeneratorPage />} />
        <Route exact path='/wallet' element={<WalletPage />} />
        <Route exact path='/widgets' element={<WidgetsPage />} />
        <Route exact path='/wizard' element={<WizardPage />} />

        {/* <Route exact path='*' element={<ErrorPage />} /> */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
