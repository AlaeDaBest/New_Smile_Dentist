import React, { useState } from "react";
import { motion } from "framer-motion";
import SideMenu from "./SideMenu";
import "../../../css/Receptionist/AddPatient.css"; 
import axios from "axios";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { TiArrowLeftThick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const AddPatient = () => {
  const [formData, setFormData] = useState({
    CIN: "",
    firstname: "",
    lastname: "",
    gender: "male",
    birthdate: "",
    email: "",
    tel: "",
    address: "",
    photo: null,
    allergies: "",
    medical_conditions: "",
    had_operations: false
  });
  const navigate=useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(formData.firstname==''||formData.lastname==''){
      toast.error("First name and Last name are required", {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    try{
      const newPatient={
        'CIN':formData.CIN,
        'firstname':formData.firstname,
        'lastname':formData.lastname,
        'gender':formData.gender,
        'birthdate':formData.birthdate,
        'email':formData.email,
        'tel':formData.tel,
        'address':formData.address,
        'photo':formData.photo,
        'allergies':formData.allergies,
        'medical_conditions':formData.medical_conditions,
        'had_operations':formData.had_operations
      }
      console.log('response');
      const response=await axios.post('http://127.0.0.1:8000/patients',newPatient);
      console.log(response);
      toast.success("Patient created with success", {
        position: 'top-right',
        autoClose: 3000,
      });
    }catch(error){
      console.log(error);
      toast.error("Failed to load data", {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="add-patient-container">
      <SideMenu />
      <main className="add-patient-main">
        <motion.div
          className="add-patient-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TiArrowLeftThick id="arrow" onClick={()=>navigate('/patients')} />
          <h2>Add New Patient</h2>
          <form onSubmit={handleSubmit} className="add-patient-form">
            <div className="form-group">
              <label>CIN</label>
              <input name="CIN" value={formData.CIN} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>First Name</label>
              <input name="firstname" value={formData.firstname} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="lastname" value={formData.lastname} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Birthdate</label>
              <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="tel" value={formData.tel} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Photo</label>
              <input type="file" name="photo" accept="image/*" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Allergies</label>
              <textarea name="allergies" value={formData.allergies} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Medical Conditions</label>
              <textarea name="medical_conditions" value={formData.medical_conditions} onChange={handleChange} />
            </div>
            <div className="form-checkbox">
              <input type="checkbox" name="had_operations" checked={formData.had_operations} onChange={handleChange} />
              <label>Had Previous Operations?</label>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="submit-btn"
            >
              Submit
            </motion.button>
          </form>
        </motion.div>
      </main>
      <ToastContainer 
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              toastStyle={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
      />
    </div>
  );
};

export default AddPatient;
