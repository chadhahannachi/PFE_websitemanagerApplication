import NewPassword from "../../../components/Authentication/NewPassword.js";
import PageBannerTitle from "../../../components/Common/PageBannerTitle.js";
import NavbarStyleTwo from "../../../components/Layout/NavbarStyleTwo";
import banner from '../../../images/page-banner/page-banner-img-19.jpg'

 
export default function NewPasswordPage() {
  return (
    <>
      <NavbarStyleTwo />
      
      <PageBannerTitle 
        title="New Password" 
        homeText="Home" 
        homeUrl="/" 
        image={banner}
      />

      <NewPassword />
     
    </>
  )
}
