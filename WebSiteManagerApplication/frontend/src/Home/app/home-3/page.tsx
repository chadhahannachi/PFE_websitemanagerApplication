
import SubscriptionPackage from "../../components/Subscription/SubscriptionPackage.tsx";
import ContactUsForm from "../../components/ContactUs/ContactUsForm.tsx";
import HeroBanner from "../../components/HomeThree/HeroBanner/index";
import Navbar from "../../components/Layout/Navbar";
import React from "react";
import NavbarStyleTwo from "../../components/Layout/NavbarStyleTwo.js";
import Benefits from "../../components/HomeThree/Benefits/Benefits";

export default function Home3() {
  return (
    <>
      {/* <Navbar /> */}
      
      <NavbarStyleTwo />
      
      <HeroBanner />
    
      <div id="benefits">
        <Benefits />
      </div>

      <div id="subscription-section">
        <SubscriptionPackage />
      </div>

      <div id="getlicence">
        <ContactUsForm />
      </div>
        
    </>
  )
}
