import React, { useState, useEffect, useRef } from 'react';
import '../../../css/Receptionist/Profile.css'; 
import SideMenu from './SideMenu';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { Input } from 'postcss';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState({
    id:'',
    CIN:'',
    firstname: '',
    lastname: '',
    gender: '',
    birthdate: '',
    email: '',
    tel: '',
    address: '',
    photo:'',
    password: '',
    roleable: {
        recrutement_date: '',
        speciality: '',
    },
  });
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);
//   console.log(user);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };
  const fileInputRef=useRef(null);
  const handleSave = async() => {
    setIsSaving(true);
    console.log('user',user);
    try{
        if(user.roleable_type=='App\\Models\\Dentist'){
            const file=fileInputRef.current.files[0];
            console.log('user',user,'file',file);
            if(user.password){
              if(user.password.length<8){
                toast.error('Password must be at least 8 characters long');
                setIsSaving(false);
              }
            }
            const updatedDentist={
                'id':user.id,
                'CIN':user.CIN,
                'firstname':user.firstname,
                'lastname':user.lastname,
                'gender':user.gender,
                'birthdate':user.birthdate,
                'email':user.email,
                'tel':user.tel,
                'address':user.address,
                'photo':file,
                'speciality':user.roleable.speciality,
                'recrutement_date':user.roleable.recrutement_date,
                'password':user.password,
            }
            console.log('updatedDentist',updatedDentist);
            const method='post';
            const url=`/api/dentists/${user.roleable.id}?_method=PUT`;
            console.log('yes')
            const response= await axios[method](url, updatedDentist,{headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data'
              }} );
                const userinfo=await axios.get(`/api/users/${user.id}`,{headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'}})
              localStorage.setItem('user', JSON.stringify(userinfo.data));
              console.log('userinfo',userinfo.data);
              console.log('userinfo',user);
              setUser(userinfo.data);
              setIsEditing(false);
              setIsSaving(false);
        }
    }catch(error){
        console.log(error);
    }
  };

  const handleCancel = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
        <SideMenu/>
      <div className={`profile-card ${isEditing ? 'edit-mode' : ''}`}>
        <div className="profile-header">
          <div className="avatar-container">
            <img 
              src={user.photo||'Images/Profiles/default.jpeg'} 
              alt="Profile" 
              className="profile-avatar"
            />
            {isEditing && (
              <div className="avatar-edit-btn">
              <input type="file" ref={fileInputRef} id="fileInput" style={{ display: 'none' }} />
              <label htmlFor="fileInput">
                <i className="fas fa-camera"></i>
              </label>
            </div>
            )}
          </div>
          <h2 className="profile-name">{user.firstname} {user.lastname}</h2>
          {!isEditing && (
            <button 
              className="edit-btnn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-body">

          <div className="profile-field">
            <label>Firstname</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={user.firstname}
                onChange={(e)=>setUser({...user, firstname: e.target.value})}
                className="profile-input"
              />
            ) : (
              <p>{user.firstname}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Lastname</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={user.lastname}
                onChange={(e)=>setUser({...user, lastname: e.target.value})}
                className="profile-input"
              />
            ) : (
              <p>{user.lastname}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Gender</label>
            {isEditing ? (
              <select
                value={user.gender}
                onChange={(e)=>setUser({...user,gender: e.target.value})}
                className="profile-input"
              >
                <option value="female">female</option>
                <option value="male">male</option>
              </select>
            ) : (
              <p>{user.gender}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Birthdate</label>
            {isEditing ? (
              <input
                type="date"
                name="birthdate"
                value={user.birthdate}
                onChange={(e)=>setUser({...user, birthdate: e.target.value})}
                className="profile-input"
              />
            ) : (
              <p>{user.birthdate}</p>
            )}
          </div>
          <div className="profile-field">
            <label>Phone Number:</label>
            {isEditing ? (
              <input
                type="text"
                name="tel"
                value={user.tel}
                onChange={(e)=>setUser({...user, tel: e.target.value})}
                className="profile-input"
              />
            ) : (
              <p>{user.tel}</p>
            )}
          </div>
          <div className="profile-field">
            <label>Recrutement date</label>
            {isEditing ? (
              <input
                type="date"
                name="recrutement_date"
                value={user.roleable.recrutement_date}
                onChange={(e)=>setUser({...user, roleable: {...user.roleable,recrutement_date:e.target.value}})}
                className="profile-input"
              />
            ) : (
              <p>{user.roleable.recrutement_date}</p>
            )}
          </div>
          <div className="profile-field">
            <label>Speciality</label>
            {isEditing ? (
              <select
                value={user.roleable.speciality}
                onChange={(e)=>setUser({...user,roleable: {...user.roleable, speciality: e.target.value}})}
                className="profile-input"
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
              </select>
            ) : (
              <p>{user.roleable.speciality}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Email</label>
            {isEditing ? (
              <input
                type="text"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="profile-input"
              />
            ) : (
              <p>{user.email}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Address</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={user.address}
                onChange={handleInputChange}
                className="profile-input"
              />
            ) : (
              <p>{user.address}</p>
            )}
          </div>
          
            {isEditing ? (
                <div className="profile-field">
                    <label>Password</label>
                    <input
                        type="text"
                        name="password"
                        value={user.password}
                        onChange={handleInputChange}
                        className="profile-input"
                    />
              </div>
            ) : (
              ''
            )}

          {isEditing && (
            <div className="profile-actions">
              <button 
                className="cancel-btn"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
// import React, { useState, useEffect, useRef } from 'react';
// import SideMenu from './SideMenu';
// const Profile=()=>{
//     return (
//         <div>
//             <SideMenu/>
//         </div>
//     )
// }
// export default Profile;