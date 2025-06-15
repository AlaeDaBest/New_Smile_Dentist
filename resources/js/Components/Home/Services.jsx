import React from "react";
import { FaTeeth } from "react-icons/fa";
import { RiToothFill } from "react-icons/ri";
import { PiToothFill } from "react-icons/pi";
import { FaTeethOpen } from "react-icons/fa";
import { RiSurgicalMaskFill } from "react-icons/ri";
import { GiTooth } from "react-icons/gi";
import { IoSparkles } from "react-icons/io5";
import { MdSettingsOverscan } from "react-icons/md";
import { FaChild } from "react-icons/fa";
const Services=()=>{
    return(
        <section id="services">
            <h2>Our <span className="highlight">Services</span></h2>
            <div className="services-grid">
                <div className="service-card">
                <h3>Surgery</h3>
                <div className="service-hover">
                    <p>Expert dental surgeries to help you get back to feeling your best.</p>
                    <RiSurgicalMaskFill size={50} />
                </div>
                </div>
                <div className="service-card">
                <h3>3D Radiology</h3>
                <div className="service-hover">
                    <p>Cutting-edge 3D scans that give your dentist a clear picture for better care.</p>
                    <MdSettingsOverscan size={50} />
                </div>
                </div>
                <div className="service-card">
                <h3>Prosthetics</h3>
                <div className="service-hover">
                    <p>Custom-made replacements that bring your smile and bite back to life.</p>
                    <FaTeeth size={50} />
                </div>
                </div>
                <div className="service-card">
                <h3>Implantology</h3>
                <div className="service-hover">
                    <p>Restore your smile with durable, natural-looking dental implants that feel just like real teeth.</p>
                    <PiToothFill size={50} />
                </div>
                </div>
                <div className="service-card">
                <h3>Aesthetic Dentistry</h3>
                <div className="service-hover">
                    <p>Enhance your smile’s beauty with treatments designed to boost your confidence.</p>
                    <IoSparkles size={50} />
                </div>
                </div>
                <div className="service-card">
                <h3>Orthodontics</h3>
                <div className="service-hover">
                    <p>Straighten your teeth comfortably with braces or clear aligners made just for you.</p>
                    <FaTeethOpen size={50} />
                </div>
                </div>
                <div className="service-card">
                <h3>Pediatric Dentistry</h3>
                <div className="service-hover">
                    <p>Gentle, caring dental care tailored to keep your child’s smile healthy and happy.</p>
                    <RiToothFill size={50} />
                </div>
                </div>
                <div className="service-card">
                <h3>Endodontics</h3>
                <div className="service-hover">
                    <p>Save your natural teeth with expert root canal treatments that ease pain and protect your smile.</p>
                    <FaChild size={50} />
                </div>
                </div>
            </div>
        </section>
    )
}
export default Services;