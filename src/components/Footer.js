import React from "react";
import { Link } from 'react-router-dom';
import instagram from "../images/icon-instagram.png"
import facebook from "../images/icon-facebook.png"
import youtube from "../images/icon-youtube.png"
import twitter from "../images/icon-twitter.png"
import linkedin from "../images/icon-linkedin.png"

export default function Footer() {
  return (
    <>
      <div className="container-fluid bg-footer-container pt-5 pb-2">
        <div className="container row mx-auto p-1">
          <div className="container col-md-3 col-12 my-2">
            <div className="div">
                
              <ul>
                <li className="footer-head-text">Useful</li>
                <li className="footer-content-text"><Link to="/terms" className="footer-subhead-decoration">Terms & Conditions</Link></li>
                <li className="footer-content-text"><Link to="/privacy-policy" className="footer-subhead-decoration">Privacy Policy</Link></li>
                <li className="footer-content-text"><Link to="/cancellation-refund" className="footer-subhead-decoration">Cancellation & Refund</Link></li>
                <li className="footer-content-text"><Link to="/shipping-policy" className="footer-subhead-decoration">Shipping Policy</Link></li>
                <li className="footer-content-text"><Link to="/contact" className="footer-subhead-decoration">Contact Us</Link></li>
                {/* <li className="footer-content-text"><Link to="/sitemap.xml" className="footer-subhead-decoration">Sitemap</Link></li> */}

              </ul>
            </div>
          </div>
          {/* <div className="container col-sm-6 col-6 col-md-3 col-lg-3 my-2">
            <div className="div">
              <ul>
                <li className="footer-head-text">Support</li>
                <li className="footer-content-text"><Link href="/support/contact"><a className="footer-subhead-decoration">Contact Us</a></Link></li>
                <li className="footer-content-text"><Link href="/sitemap.xml"><a className="footer-subhead-decoration">Sitemap</a></Link></li>

                <li className="footer-content-text"><Link href="/support/creators"><a className="footer-subhead-decoration">For Creators</a></Link></li>
                <li className="footer-content-text"><Link href="/support/brands"><a className="footer-subhead-decoration">For Brands</a></Link></li>
                <li className="footer-content-text"><Link href="/support/others"><a className="footer-subhead-decoration">Others</a></Link></li>

              </ul>
            </div>
          </div> */}
        
          
          <div className="container col-sm-12 col-12 col-md-3 col-lg-3 my-2">
            <div className="div">
              <ul>
                <li className="footer-head-text">Compare</li>
                <li className="footer-content-text">
                 Bitly Alternative
                </li>
                <li className="footer-content-text">
                 ShortUrl Alternative
                </li>
                <li className="footer-content-text">
                 Rebrandly Alternative
                </li>
                <li className="footer-content-text">
                 TinyUrl Alternative
                </li>
                <li className="footer-content-text">
                 t.ly Alternative
                </li>
                <li className="footer-content-text">
                 Pixally Alternative
                </li>
               

                <li className="footer-head-text pt-4">
                  Follow us 
                </li>
                <li className="footer-content-text my-1">
                  {/* <Link href="https://www.instagram.com/broadreach.in/"><a><img  className="img-fluid rounded icon-image" src={instagram} alt="instagram-icon" width={50} height={25} /></a></Link> */}
                  {/* <Link href="https://www.facebook.com/broadreach.in"><a><img  className="img-fluid rounded icon-image" src={facebook} alt="facebook-icon" width={50} height={25} /></a></Link> */}
                  {/* <Link href="https://www.youtube.com"><a><Image  className="img-fluid rounded icon-image mt-1" src={youtube} alt="youtube-icon" width={55} height={35} /></a></Link>
                  <Link href="https://www.twitter.com"><a><Image  className="img-fluid rounded icon-image" src={twitter} alt="twitter-icon" width={50} height={25} /></a></Link> */}
                  <Link to="https://www.linkedin.com/company/linck-one/"><a><img  className="img-fluid rounded icon-image" src={linkedin} alt="linkedin-icon" width={38} height={22} /></a></Link>

                  
                </li>
              </ul>
            </div>
          </div>
        </div>



        <div className="container text-center my-3">
          <span className="fw-normal" style={{color: "#B9B4C7"}}>Copyright &copy;linck.one 2024</span>
        </div>
      </div>
    </>
  );
}
