import react from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import SmileBrighter from "./SmileBrighter";
const Header=()=>{
    const navigate=useNavigate();
    return(
        <header id="home_header">
            <div style={{display:"flex",alignItems:"center"}}>
            <img src="/Images/Logo/NewSmile_colored.png" id="logo_colored" alt="" />
                <h2 style={{color:"#0013a5"}}>New Smile</h2>
            </div>
            <nav>
                <NavLink to="/">Home</NavLink>
                <ScrollLink to="services" smooth={true} duration={500}>Services </ScrollLink>
                <ScrollLink to="about" smooth={true} duration={500}>About </ScrollLink>
                <ScrollLink to="contact" smooth={true} duration={500}>Contact </ScrollLink>
            </nav>
            <div >
                <button onClick={()=>navigate('/login')}><span>Connect</span></button>
            </div>
        </header>
    )
}
export default Header;