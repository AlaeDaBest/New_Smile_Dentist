import React from "react";
import { FaTeeth } from "react-icons/fa";
import { RiToothFill } from "react-icons/ri";
import { PiToothFill } from "react-icons/pi";
import { FaTeethOpen } from "react-icons/fa";
import { GiTooth } from "react-icons/gi";
const Services=()=>{
    return(
        <section id="services">
            <h2>Our <span className="highlight">Services</span></h2>
            <div className="services-grid">
                <div className="service-card">
                <h3>Dental Veneers</h3>
                <div className="service-hover">
                    <p>We offer a wide range of services to help you achieve a healthy, beautiful smile.</p>
                    <FaTeeth size={50} />
                </div>
                </div>
                <div className="service-card">
                <h3>Dental Whitening</h3>
                <div className="service-hover">
                    <p>Feel free to browse our website and learn about our dental practice.</p>
                    <RiToothFill size={50} />
                </div>
                </div>
                <div className="service-card">
                <h3>Dental Implants</h3>
                <div className="service-hover">
                    <p>Restore your smile with durable, natural-looking dental implants designed to last a lifetime .</p>
                    <PiToothFill size={50} />
                </div>
                </div>
                <div className="service-card">
                <h3>Dental Bonding</h3>
                <div className="service-hover">
                    <p>Restore your smile with durable, natural-looking dental implants designed to last a lifetime .</p>
                    <FaTeethOpen size={50} />
                </div>
                </div>
                <div className="service-card">
                <h3>Dental Bridges</h3>
                <div className="service-hover">
                    <p>Restore your smile with durable, natural-looking dental implants designed to last a lifetime .</p>
                    <GiTooth size={50} />
                </div>
                </div>
            </div>
        </section>
    )
}
export default Services;