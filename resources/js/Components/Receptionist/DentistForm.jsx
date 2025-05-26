import { useRef, useState } from "react";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { motion } from "framer-motion";
import styled from "styled-components";

// Styled components
const FormContainer = styled(motion.div)`
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 800px;
  margin: 2rem auto;
  overflow: hidden;
`;

const FormTitle = styled.h2`
  color: #bd2503;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 600;
  font-size: 1.8rem;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #ff613d, #bd2503);
    margin: 0.5rem auto 0;
    border-radius: 2px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled(motion.div)`
  margin-bottom: 1.5rem;
  position: relative;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
`;

const FormInput = styled.input`
  width: 90%;
  padding: 12px 15px;
  margin-right:10px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  
  &:focus {
    border-color: #bd2503;
    box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
    outline: none;
    background-color: white;
  }
`;

const FormSelect = styled.select`
  width: 97%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  
  &:focus {
    border-color: #bd2503;
    box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
    outline: none;
    background-color: white;
  }
`;

const FileInputContainer = styled.div`
  position: relative;
  margin-top: 1rem;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 15px;
  background: linear-gradient(to right, #ff613d, #bd2503);
  color: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 500;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 97, 61, 0.55);
  }
`;

const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const SubmitButton = styled(motion.button)`
  padding: 12px 25px;
  background: linear-gradient(to right, #ff613d, #bd2503);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 97, 61, 0.55);
  }
`;

const CancelButton = styled(motion.button)`
  padding: 12px 25px;
  background: #f5f5f5;
  color: #555;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e0e0e0;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const DentistForm = ({ dentist, onClose, onSaved }) => {
    const [formData, setFormData] = useState({
      CIN: dentist?.user.CIN || '',
      firstname: dentist?.user?.firstname || '',
      lastname: dentist?.user?.lastname || '',
      tel: dentist?.user?.tel || '',
      email: dentist?.user?.email || '',
      gender: dentist?.user?.gender || 'female',
      birthdate: dentist?.user?.birthdate || '',
      password: dentist?.user?.password||'',
      photo: null,
      recrutement_date: dentist?.recrutement_date || '',
      speciality: dentist?.speciality || 'orthodontics',
    });
    console.log('dentist',dentist);
    
    const [fileName, setFileName] = useState('No file chosen');
    const fileInputRef = useRef(null);
  
    const handleFileChange = (e) => {
      if (e.target.files.length > 0) {
        setFileName(e.target.files[0].name);
      } else {
        setFileName('No file chosen');
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const file = fileInputRef.current.files[0];
      
      const NewDentist = {
        'CIN': formData.CIN,
        'firstname': formData.firstname,
        'lastname': formData.lastname,
        'tel': formData.tel,
        'email': formData.email,
        'gender': formData.gender,
        'birthdate': formData.birthdate,
        'recrutement_date': formData.recrutement_date,
        'password': formData.password,
        'speciality':formData.speciality,
        'photo': file,
      };
      console.log(formData);
      
      const url = dentist 
        ? `/api/dentists/${dentist.id}?_method=PUT` 
        : `/api/dentists`;
      const method = dentist ? 'post' : 'post';
  
      try {
        const response = await axios[method](url, NewDentist, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response);
        toast.success(dentist ? "Dentist updated successfully" : "Dentist created successfully",{
            position: 'top-right',
            autoClose: 3000,
        });
        onSaved();  
        onClose();  
      } catch (err) {
        toast.error("An error occurred while saving the dentist",{
            position: 'top-right',
            autoClose: 3000,
        });
        console.error(err);
      }
    };
  
    return (
      <FormContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FormTitle>{dentist ? "Edit Dentist" : "Create New Dentist"}</FormTitle>
        <form onSubmit={handleSubmit} id="Assistant_form">
          <FormGrid>
            <FormGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <FormLabel>CIN:</FormLabel>
              <FormInput 
                type="text" 
                placeholder="CIN" 
                value={formData.CIN} 
                onChange={e => setFormData({...formData, CIN: e.target.value})} 
                
              />
            </FormGroup>
            
            <FormGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FormLabel>First name:</FormLabel>
              <FormInput 
                type="text" 
                placeholder="First Name" 
                value={formData.firstname} 
                onChange={e => setFormData({...formData, firstname: e.target.value})} 
                
              />
            </FormGroup>
            
            <FormGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FormLabel>Last name:</FormLabel>
              <FormInput 
                type="text" 
                placeholder="Last Name" 
                value={formData.lastname} 
                onChange={e => setFormData({...formData, lastname: e.target.value})} 
                
              />
            </FormGroup>
            
            <FormGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FormLabel>Gender:</FormLabel>
              <FormSelect 
                value={formData.gender} 
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <FormLabel>Birthdate:</FormLabel>
              <FormInput 
                type="date" 
                placeholder="birthdate" 
                value={formData.birthdate} 
                onChange={e => setFormData({...formData, birthdate: e.target.value})} 
                
              />
            </FormGroup>
            
            <FormGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <FormLabel>Recruitment date:</FormLabel>
              <FormInput 
                type="date" 
                placeholder="recruitment date" 
                value={formData.recrutement_date} 
                onChange={e => setFormData({...formData, recrutement_date: e.target.value})} 
                
              />
            </FormGroup>

            <FormGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <FormLabel>Speciality:</FormLabel>
              <FormSelect 
                value={formData.speciality} 
                onChange={(e) => setFormData({...formData, speciality: e.target.value})}
              >
                <option value="orthodontics">Orthodontics</option>
                <option value="endodontics">Endodontics</option>
                <option value="periodontics">Periodontics</option>
                <option value="oral_surgery">Oral Surgery</option>
                <option value="pediatric_dentistry">Pediatric Dentistry</option>
                <option value="prosthodontics">Prosthodontics</option>
                <option value="oral_pathology">Oral Pathology</option>
                <option value="dental_radiology">Dental Radiology</option>
                <option value="public_health">Public Health</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <FormLabel>Email:</FormLabel>
              <FormInput 
                type="email" 
                placeholder="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                
              />
            </FormGroup>
            
            <FormGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <FormLabel>Phone:</FormLabel>
              <FormInput 
                type="tel" 
                placeholder="Phone number" 
                value={formData.tel} 
                onChange={e => setFormData({...formData, tel: e.target.value})} 
                 
              />
            </FormGroup>
            
            {!dentist && (
              <FormGroup
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <FormLabel>Password:</FormLabel>
                <FormInput 
                  type="password" 
                  placeholder="password" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})}                
                />
              </FormGroup>
            )}
          </FormGrid>
          
          <FileInputContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <FormLabel>Profile Photo:</FormLabel>
            <FileInputLabel>
              Choose File
              <FileInput 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
              />
            </FileInputLabel>
            <span style={{ marginLeft: '1rem', fontSize: '0.9rem', color: '#666' }}>
              {fileName}
            </span>
          </FileInputContainer>
          
          <ButtonGroup>
            <CancelButton
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </CancelButton>
            <SubmitButton
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {dentist ? "Update Assistant" : "Create Assistant"}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </FormContainer>
    );
};

export default DentistForm;