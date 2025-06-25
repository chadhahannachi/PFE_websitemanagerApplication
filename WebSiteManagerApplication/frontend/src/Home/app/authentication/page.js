import NavbarStyleTwo from "../../components/Layout/NavbarStyleTwo";
import PageBannerTitle from "../../components/Common/PageBannerTitle.js";
import Authentication from "../../components/Authentication/Authentication.tsx";
import banner from '../../images/page-banner/page-banner-img-19.jpg'
 
export default function AuthenticationPage() {
  return (
    <>
      <NavbarStyleTwo />
      
      <PageBannerTitle 
        title="Login Register" 
        homeText="Home" 
        homeUrl="/" 
        image={banner}
      />

      <Authentication />
    </>
  )
}
