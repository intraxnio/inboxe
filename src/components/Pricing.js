import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from "react-router-dom";





function Pricing() {
  const [isMonthly, setIsMonthly] = useState(false);
  const navigate = useNavigate();


  const togglePricing = () => {
    setIsMonthly(!isMonthly);
  };

  const redirectToSignup = () => {
    navigate(`/signup/brand`);
   
  };

  return (
    <>
      <header>
        <title>Pricing: linck</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-site-verification" content="HvvX1gisMdTNXS66CRCrbZTdRWr_q-P5JXjMDhwP3_4" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-D0SY7XGY0L"></script>
      </header>

      <Navbar />

      <div className="container mt-5 mb-5">
        <div className="text-center">
          <div className={`btn-group custom-btn-group ${isMonthly ? 'monthly' : 'yearly'}`} role="group">
            <button
              type="button"
              className={`btn ${isMonthly ? 'price-btn-color-1' : 'price-btn-color-2'} ${isMonthly ? 'active' : ''}`}
              onClick={togglePricing}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`btn ${isMonthly ? 'price-btn-color-1' : 'price-btn-color-2'} ${isMonthly ? '' : 'active'}`}
              onClick={togglePricing}
            >
              Annual (2 months free)
            </button>
          </div>
        </div>
      </div>

      <div className="container row mx-auto justify-content-center mb-5">
        <div className="col-12 col-md-4 col-lg-4 py-3">
          <div className="border border-primary rounded p-3">
            <div className="row text-center">
              <p><span className="pricing-txt"> Starter</span></p>
              <p><span className="pricing-txt-price"> {isMonthly ? '$290' : '$29'}</span></p>
            </div>
            <div className="features-details">

<div className="bb-txt-3 cussLine">
<span className="material-icons me-3">all_inclusive</span>
  <p>Unlimited contacts</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">all_inclusive</span>
  <p>Up to 10k emails/month</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">all_inclusive</span>
  <p>Drag & drop editor</p>
</div>


<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">bar_chart</span>
  <p>Real time analytics</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">description</span>
  <p>Smart Sending</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">query_stats</span>
  <p>Advanced segmentation</p>
</div>

</div>
            <div className="container my-4 mx-auto d-flex justify-content-center">
              <button className="btn login-btn-grad btn-g-fonts text-white" onClick={redirectToSignup} >Get Started</button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 col-lg-4 py-3">
          <div className="border border-primary rounded p-3">
            <div className="row text-center">
              <p><span className="pricing-txt"> Start Up</span></p>
              <p><span className="pricing-txt-price"> {isMonthly ? '$1390' : '$139'}</span></p>
            </div>
            <div className="features-details">

            <div className="bb-txt-3 cussLine">
<span className="material-icons me-3">all_inclusive</span>
  <p>Unlimited contacts</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">all_inclusive</span>
  <p>Up to 50k emails/month</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">all_inclusive</span>
  <p>Drag & drop editor</p>
</div>


<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">bar_chart</span>
  <p>Real time analytics</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">description</span>
  <p>Smart Sending</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">query_stats</span>
  <p>Advanced segmentation</p>
</div>

<div className="bb-txt-3 cussLine">
  <span class="material-icons me-3">link</span>
    <p>Retargeting</p>
  </div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">sell</span>
  <p>Demographic data</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">share</span>
  <p>IP warm-up</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">language</span>
  <p>IP rotation</p>
</div>

</div>
            <div className="container my-4 mx-auto d-flex justify-content-center">
              <button className="btn signup-btn-grad btn-g-fonts text-white" onClick={redirectToSignup}>Get Started</button>
            </div>
          </div>
        </div>


        <div className="col-12 col-md-4 col-lg-4 py-3">
          <div className="border border-primary rounded p-3">
            <div className="row text-center">
              <p><span className="pricing-txt"> Custom Pricing</span></p>
              {/* <p><span className="pricing-txt-price"> Unlimited</span></p> */}
              <p>Businesses with over 100K emails per month.</p>
            </div>
       
            <div className="container my-2 mx-auto d-flex justify-content-center">
              <button className="btn signup-btn-grad btn-g-fonts text-white">support@linck.one</button>
               {/* <Button
              variant="outlined"
              color="secondary"
              startIcon={<MailOutlineIcon />}
              style={{marginLeft: '16px', textTransform: 'lowercase'}}
            >
              support@linck.one
            </Button> */}
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}

export default Pricing;
