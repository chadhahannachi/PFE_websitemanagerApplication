


import BookingSearchForm from "./BookingSearchForm.tsx";
import { Link } from "react-router-dom";
import heroImg from '../../../images/banner/banner-img-6.jfif';
import heroImg2 from "../../../images/banner/banner-img-5.jfif";
import shape from "../../../images/shape/shape-14.png";
import shape2 from "../../../images/shape/shape-18.png";

const HeroBanner = () => {
  return (
    <>
      <div className="banner-area banner-bg-3 bg-color-f7f2ff overflow-hidden position-relative z-1">
        <div className="container-fluid mw-1640">
          <div className="row align-items-center">
            <div className="col-lg-5 order-2 order-lg-1">
              <div className="banner-img-wrap style-three">
                <div className="row">
                  <div 
                    className="col-lg-5 col-sm-6"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-duration="500"
                    data-aos-once="true"
                  >
                    <div className="banner-img-two position-relative z-1">
                      <img src={heroImg} alt="banner" />
                    </div>
                  </div>

                  <div 
                    className="col-lg-7 col-sm-6"
                    data-aos="fade-right"
                    data-aos-delay="200"
                    data-aos-duration="500"
                    data-aos-once="true"
                  >
                    <div className="banner-img position-relative z-1">
                      <img src={heroImg2} alt="banner" />
                      <img
                        src={shape}
                        className="shape shape-14"
                        alt="shape-14"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7 order-1 order-lg-2">
              <div className="banner-content style-three">
                <div 
                  data-aos="fade-left"
                  data-aos-delay="300"
                  data-aos-duration="500"
                  data-aos-once="true"
                >
                  <span className="top-title">Create Your Website</span>
                  <h1>Launch a Website Without Writing a Single Line of Code.</h1>
                  <p>
                    Build stunning websites without writing a single line of code. Our intuitive no-code platform lets you design, customize, and launch your site in minutes — all with simple clicks and drag-and-drop tools. Whether you're a beginner or a pro, creating your online presence has never been this effortless.
                  </p>

                  <div className="banner-btn">
                    {/* <Link to="/stay" className="default-btn active rounded-10">
                      Get a Licence
                    </Link> */}

                    <a href="#getlicence" className="default-btn active rounded-10">
                      <span>Get a Licence</span> 
                    </a>

                    <a href="#subscription-section" className="default-btn rounded-10 bg-transparent">
                      <span>Get Price</span> 
                    </a>

                  </div>
                </div>

                {/* BookingSearchForm */}
                <BookingSearchForm />
              </div>
            </div>
          </div>
        </div>

        {/* shape */}
        <img src={shape2} className="shape shape-18" alt="shape-18" />
      </div>
    </>
  );
};

export default HeroBanner;
