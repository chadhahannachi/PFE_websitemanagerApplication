
import SubscriptionPackage from "../../components/Subscription/SubscriptionPackage.tsx";
import ContactUsForm from "../../components/ContactUs/ContactUsForm.tsx";
import HeroBanner from "../../components/HomeThree/HeroBanner/index";
import Navbar from "../../components/Layout/Navbar";
import React from "react";

export default function Home3() {
  return (
    <>
      <Navbar />

      <HeroBanner />

      <div id="subscription-section">
        <SubscriptionPackage />
      </div>

      <div id="getlicence">
        <ContactUsForm />
      </div>
      
      
    </>
  )
}
