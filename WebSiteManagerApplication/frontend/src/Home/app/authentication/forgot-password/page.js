import ForgotPassword from "../../../components/Authentication/ForgotPassword.js";
import PageBannerTitle from "../../../components/Common/PageBannerTitle.js";
import NavbarStyleTwo from "../../../components/Layout/NavbarStyleTwo";
import banner from '../../../images/page-banner/page-banner-img-19.jpg'

 
export default function ForgotPasswordPage() {
  return (
    <>
      <NavbarStyleTwo />
      
      <PageBannerTitle 
        title="Forgot Password" 
        homeText="Home" 
        homeUrl="/" 
        image={banner}
      />

      <ForgotPassword />
     
    </>
  )
}
