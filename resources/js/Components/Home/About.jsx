import React from "react";
// import aboutVideo from 'Video/video';
const About=()=>{
    return(
        <div>
            <section  id="about" >
                <h2>About Us</h2>
                <article>
                    <video
                        src="/Video/video.mp4"
                        width="100%"
                        height="auto"
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{ borderRadius: '12px', marginTop: '20px' }}
                    >
                        Your browser does not support the video tag.
                    </video>
                </article>
                <article>
                    <p>At New Smile, we're passionate about creating confident, healthy smiles in a calm and caring environment. With a team of experienced dental professionals and the latest in dental technology, we provide personalized treatments that put your comfort first. Whether you're here for a routine check-up or a complete smile makeover, our mission is to make every visit stress-free and every smile shine brighter.</p>
                </article>
            </section>
        </div>
    )
}
export default About;