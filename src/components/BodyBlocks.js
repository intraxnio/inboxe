import React from 'react'
import banner1 from "../images/banner1.jpg"
import sideImage1 from "../images/main-side-image-1.png"
import banner2 from "../images/banner2.jpg"
import banner3 from "../images/banner3.webp"
import sideImage2 from "../images/main-side-image-2.png"
import sideImage3 from "../images/main-side-image-3.png"
import { Link } from 'react-router-dom';





function BodyBlocks() {
  return (
    <>

    <div className="container mt-5">

        <div className="row mx-auto">
            <div className="col-12 col-md-6 col-lg-6 my-auto">
                <div className="row creator-underline txt-bold"><p>No 'SPAM' Folder</p></div>
                <div className="row bb-txt-2"><p>Maximize inbox reach with
                    <span className="span-70"> AI-powered </span>email delivery optimization.</p></div>
                {/* <div className="row bb-txt-3"><p><span className="check-1"></span>Trigger retargeting pixels directly from your links.</p></div> */}

                <div className="row-center bb-txt-3">
                    <span className="right-arrow-1"></span>
                    <p className= "my-auto">Compliant with email best practices to avoid spam filters and maximize deliverability.</p>
                </div>

                <div className="row-center bb-txt-4 mt-4">
                    <span className="right-arrow-2"></span>
                    <p className= "my-auto">AI insights to optimize <span className="span-70"> subject lines, timing, and content</span> for higher inbox placement.</p>
                </div>


                <div className="row-center bb-txt-5 mt-4">
                    <span className="right-arrow-3"></span>
                    <p className= "my-auto">Build trust through authentication tools like SPF, DKIM, and DMARC for a spam-free experience.</p>
                </div>


            </div>

            <div className="col-12 col-md-6 col-lg-6">
                <img className="img-fluid rounded" src={sideImage1} alt="banner" width={500} height={500} />
            </div>
        </div>
    </div>



    <div className="container mt-3">

<div className="row mx-auto">

<div className="col-12 col-md-6 col-lg-6 order-2 order-md-0 order-lg-0">

        <img className="img-fluid rounded" src={sideImage3} alt="banner" width={500} height={500} />

    </div>

    <div className="col-12 col-md-6 col-lg-6 my-auto">
        <div className="row creator-underline txt-bold"><p>Demographic Data</p></div>
        <div className="row bb-txt-2"><p>Understanding Your Audience through
            <span className="span-70"> Demographic </span>Insights.</p></div>


        <div className="row-center bb-txt-3">
            <span className="right-arrow-1"></span>
            <p className= "my-auto">Geographic distribution of your audience, from countries and states down to specific cities.</p>
        </div>

        <div className="row-center bb-txt-4 mt-4">
            <span className="right-arrow-2"></span>
            <p className= "my-auto">Explore the diversity of <span className="span-70">Browsers </span>your audience uses to access your content.</p>
        </div>


        <div className="row-center bb-txt-5 mt-4">
            <span className="right-arrow-3"></span>
            <p className= "my-auto">Dive into the devices your audience prefers, whether it&apos;s mobile, desktop, or tablet.</p>
        </div>


    </div>

   
</div>
</div>

     <div className="container mt-3">
        <div className="row mx-auto">

       

        
    


            <div className="col-12 col-md-6 col-lg-6 my-auto">
                <div className="row creator-underline txt-bold"><p>Reporting & Analytics</p></div>
                <div className="row bb-txt-2"><p>Get Real time <span className="span-70">Opens, Clicks, Bounce & Delivery</span> metrics of your emails.
                Reporting ROI is at ease.</p></div>


                <div className="row-center bb-txt-3">
                  <span className="just-arrow-1">&#8594;</span>
                    <p className= "my-auto">Accurate & Real-Time Analytics.</p>
                </div>

                <div className="row-center bb-txt-3 mt-3">
                  <span className="just-arrow-2">&#8594;</span>
                    <p className= "my-auto">Download & Share Reports.</p>
                </div>

                <div className="row-center bb-txt-3 mt-3">
                  <span className="just-arrow-3">&#8594;</span>
                    <p className= "my-auto">Share Reports via short URL.</p>
                </div>


            </div>

            <div className="col-12 col-md-6 col-lg-6">
        <img className="img-fluid rounded" src={sideImage2} alt="banner" width={500} height={500} />

    </div>


        </div>
    </div>



    <div className="container-fluid mx-auto custom-container-dimensions">
        <div className="row">
          <div className="col-md-6 col-12 txt-2 text-center my-auto"><p>Unlimited Emails<br /> <span className="creator-underline"> in all plans.</span></p> </div>
          <div className="col-md-6 col-12 my-auto">
            <div className="container mx-auto h2 pt-2">Pick the plan that best suits your requirements.</div>
            <div className="container mx-auto row pt-2 pb-4">Target the right audience by our e-inbox feature.</div>
            <div className="container mx-auto "> <div className="col-md-12 col-12">
            <Link to="/pricing" style={{textDecoration: 'none'}}><button className="btn signup-btn-grad-2 btn-g-fonts text-white">View Plans</button></Link>

          </div></div>
            </div>
        </div>
      </div>

    

    
{/* 
      <div className="container-fluid mx-auto custom-container-dimensions-1">
        <div className="row">
          <div className="col-md-6 col-12 txt-2 text-center my-auto"><p>Unlimited Clicks<br /> <span className="creator-underline"> in all plans.</span></p> </div>
          <div className="col-md-6 col-12 my-auto">
            <div className="container mx-auto h2 pt-2 pb-4">NO limits on number of clicks per link.</div>
            <div className="container mx-auto "> <div className="col-md-12 col-12">
            <Link to="/pricing" style={{textDecoration: 'none'}}><button className="btn login-btn-grad btn-g-fonts text-white">View Plans</button></Link>

          </div></div>
            </div>
        </div>
      </div> */}

    </>
  )
}

export default BodyBlocks