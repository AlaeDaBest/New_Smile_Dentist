import React from "react";
import { Link as ScrollLink } from "react-scroll";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
const Footer=()=>{
    return(
        <footer class="footer" id="contact">
            <div class="footer-container">
                <div class="footer-brand">
                <h2>New Smile</h2>
                <p>Your comfort, our priority. Brightening smiles one visit at a time.</p>
                </div>
                <div class="footer-links">
                <h4>Quick Links</h4>
                <ul>
                    <li><ScrollLink to="services" smooth={true} duration={500}>Services </ScrollLink></li>
                    <li><ScrollLink to="about" smooth={true} duration={500}>About </ScrollLink></li>
                    {/* <li><a href="#contact">Contact</a></li>
                    <li><a href="#appointments">Book Now</a></li> */}
                </ul>
                </div>
                <div class="footer-contact">
                <h4>Contact</h4>
                <p><MdEmail /> cliniquenewsmile@hotmail.com</p>
                <p><MdEmail /> Newsmileclinic.scp@gmail.com</p>
                <p><FaPhoneAlt /> +212 5 39 34 13 33</p>
                <p><IoLogoWhatsapp /> +212 6 76 13 94 51</p>
                <p><AiFillInstagram /> Newsmileclinicscp/ </p>
                <p><FaFacebook /> Newsmileclinic</p>
                <p><FaLocationDot /> N° 12 Angle Av. Accasia, Rés. Al Ismailia Entresol N°8 - Tanger - Maroc </p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 New Smile. All rights reserved.</p>
            </div>
        </footer>
    )
}
export default Footer;