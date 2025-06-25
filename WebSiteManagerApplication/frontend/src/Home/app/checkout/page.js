import NavbarStyleTwo from "../../components/Layout/NavbarStyleTwo";
import PageBannerTitle from "../../components/Common/PageBannerTitle.js";
import CheckoutContent from "../../components/Checkout/CheckoutContent.tsx";
import banner from '../../images/page-banner/page-banner-img-19.jpg'

export default function CheckoutPage() {
  return (
    <>
      <NavbarStyleTwo />

      <PageBannerTitle 
        title="Checkout" 
        homeText="Home" 
        homeUrl="/" 
        image={banner}
      />

      <CheckoutContent />

    </>
  )
}
