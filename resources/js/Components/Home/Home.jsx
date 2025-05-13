import React from "react";
import Header from "../Home/Header";
import '../../../css/Home/header.css';
import '../../../css/Home/home.css';
import SmileBrighter from "./SmileBrighter";
import About from "./About";
import Services from "./Services";
import Footer from "./Footer";
const Home=()=>{
    return(
        <div>
            <Header/>
            <SmileBrighter/>
            <About/>
            <Services/>
            <Footer/>
        </div>
    )
}
export default Home;