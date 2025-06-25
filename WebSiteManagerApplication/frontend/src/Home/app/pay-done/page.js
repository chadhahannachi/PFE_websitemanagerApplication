import NavbarStyleTwo from "../../components/Layout/NavbarStyleTwo.js";
import PageBannerTitle from "../../components/Common/PageBannerTitle.js";
import PayDoneContent from "../../components/PayDone/PayDoneContent.tsx";
import banner from '../../images/page-banner/page-banner-img-19.jpg'
  
export default function PayDonePage() {
  return (
    <>
      <NavbarStyleTwo />

      <PageBannerTitle 
        title="Pay Done" 
        homeText="Home" 
        homeUrl="/" 
        image={banner}
      />

      <PayDoneContent />
  
  
    </>
  )
}
