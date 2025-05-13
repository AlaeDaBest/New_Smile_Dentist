import React from "react";
import { Link as ScrollLink } from "react-scroll";
const SmileBrighter=()=>{
    return(
        <div id="smilebrighter">
            <section id="bigger_section">
                <article>
                    <h1>SMILE  <br />
                        <span id="brighter">BRIGHTER </span>
                        WITH US</h1>
                </article>
                <article id="section_img">
                    <img src="Images/Home/article1.jpg" alt="" />
                </article>
            </section>
            <section id="smaller_section">
                <article id="paragraph">
                <p>At New Smile, we provide gentle, modern dental care tailored to your needs. From check-ups to cosmetic treatments, we're here to keep your smile healthy and confident.
                    
                </p>
                <br />
                </article>
                <article id="section_img">
                    <img src="Images/Home/article2.jpg" alt="" />
                </article>
            </section>
        </div>
    )
}
export default SmileBrighter;