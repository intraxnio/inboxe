import React from 'react'
import mainBanner from "../images/influencers-collage.webp"
import banner3 from "../images/main-side-image-4.png"



function BodyCards() {
  return (
    <>
    
    <div className="container row pt-5 pb-4 mx-auto">
        <div className="col-md-6 col-12">
        <img className="img-fluid rounded" src={banner3} alt="micro-influencers" width={500} height={500} />

        </div>
        <div className="container col-md-6 col-12 my-auto">
          <div className="container ps-5">
          <div className="inf-txt-1"><p>Be a<br />smart<br /><span className="creator-underline-marketer">marketer</span></p></div>
                {/* <div className="bb-txt-3"><p><span className="check-1"></span>&nbsp;&nbsp;&nbsp;Pick right influencer</p></div>
                <div className="bb-txt-4"><p><span className="check-2"></span>&nbsp;&nbsp;&nbsp;Make impact on Marketing ROI</p></div>
                <div className="bb-txt-5"><p><span className="check-3"></span>&nbsp;&nbsp;&nbsp;Save tons of marketing budget</p></div> */}
        </div>

          </div>
       
    </div>
    
    </>
  )
}

export default BodyCards