import React from "react";
import PageBannerTitle from "../../components/Common/PageBannerTitle.tsx";
import NavbarStyleTwo from "../../components/Layout/NavbarStyleTwo.js";


export default function ContactUsPage() {
  return (
    <>
      <NavbarStyleTwo />

      <PageBannerTitle 
        title="Contact Us" 
        homeText="Home" 
        homeUrl="/" 
        image="/images/page-banner/page-banner-img-22.jpg"
      />

     

      {/* <ContactUsForm /> */}

    </>
  )
}
