import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../../css/Receptionist/ListAppointments.css";
import SideMenu from "./SideMenu";
import axios from "axios";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { TbEdit } from "react-icons/tb";
import Select from 'react-select';
import { CgTrash } from "react-icons/cg";
import { X, Search, Edit, Trash2, Check, ChevronLeft, ChevronRight } from "lucide-react";

const typeColors = {
  "Bilan": "#1abc9c",
  "Biodentine": "#2ecc71",
  "Blanchement": "#939394",
  "Carie": "#0013a5",
  "Collage": "#e67e22",
  "Composite": "#e6b522",
  "Consultation": "#5858ff",
  "Contention": "#8e44ad",
  "Controle": "#2980b9",
  "Curtage": "#b222e6",
  "Debaguage": "#27ae60",
  "Detartrage": "#22e6a1",
  "Essyag": "#0d60d5",
  "Explication TT": "#34495e",
  "Extraction": "#e84393",
  "Febr": "#d94862",
  "Fixe Finie": "#0c7d72",
  "Implant": "#d35400",
  "Prise d'empreint": "#ff6f61",
  "Radio": "#5dade2",
  "Surveillance": "#720c7d",
  "Traitement canalaire": "#2e86c1",
  "Urgence": "#c0392b",
};
const ListAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [appointmentToDelete,setAppointmentToDelete]=useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filters, setFilters] = useState({ date: new Date().toISOString().split("T")[0], patient: "" });
  const [editMode,setEditMode]=useState(false);
  const [patients,setPatients]=useState([]);
  const [dentists,setDentists]=useState([]);
  const [editedAppointment,setEditedAppointment]=useState(null);
  const [types,setTypes]=useState([]);
  const token=localStorage.getItem('token');
  const fetchAppoitments = () => {
    axios
      .get("http://127.0.0.1:8000/api/appointments",{headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },})
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    fetchAppoitments();
  }, []);
  
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/appointments",{headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },})
      .then((response) => {
        console.log(response);
        setAppointments(response.data);
      })
      .catch((error) => console.log(error));
    axios.get('http://127.0.0.1:8000/api/patients',{headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },})
    .then(response=>{
      console.log(response);
      setPatients(response.data);
    }).catch((error) => console.log(error));
    axios.get('http://127.0.0.1:8000/api/dentists',{headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },})
    .then(response=>{
      console.log(response);
      setDentists(response.data);
    }).catch((error) => console.log(error));
    axios.get('http://127.0.0.1:8000/types',{headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },})
    .then(response=>{
      console.log(response);
      setTypes(response.data);
    }).catch((error) => console.log(error));
  }, []);
  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.user.firstname} ${p.user.lastname}`
  }));
  const handleSave=(e)=>{
    e.preventDefault();
    console.log(editedAppointment);
    try{
      const response=axios.put(`http://127.0.0.1:8000/api/appointments/${editedAppointment.id}`,editedAppointment,{headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },});
      toast.success('Appointment updated succesfully');
      fetchAppoitments();
      setEditMode(false);
    }catch(error){
      console.log(error)
      toast.error('Error updating the appointment');
    }
  }
  const handleStatusChange=async(id, newStatus)=>{
    try{
        const response=await axios.patch(`http://127.0.0.1:8000/api/appointments/toggleStatus/${id}`,{status:newStatus},{headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },});
        console.log(response);
        toast.success(response.data.message);
        fetchAppoitments();
    }catch(error){
        console.log(error);
        toast.error('Error updating appointment');
    }
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status: newStatus } : appt))
    );
  };
  const handleSituationChange=async(id,newSituation)=>{
    try{
      const response=await axios.patch(`http://127.0.0.1:8000/api/appointments/toggleSituation/${id}`,{situation:newSituation},{headers: {Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }})
      console.log(response);
      toast.success(response.data.message);
      fetchAppoitments();
    }catch(error){
      console.log(error);
      toast.error('Error updating appointment');
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); 
  };
  const handleDelete=async(id)=>{
    console.log(id);
    try{
        const response=await axios.delete(`http://127.0.0.1:8000/api/appointments/${id}`,{headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },});
        console.log(response);
        setShowDeleteConfirm(false);
        toast.success('Appointment deleted successfully');
    }catch(error){
        toast.error('Error deleting the appointments');
        console.log(error);
    }
  }

  const filteredAppointments = appointments.filter((appt) => {
    const fullName = `${appt.patient.user.firstname} ${appt.patient.user.lastname}`.toLowerCase();
    return (
      (!filters.date || appt.appointment_date === filters.date) &&
      (!filters.patient || fullName.includes(filters.patient.toLowerCase()))
    );
  });

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;
  const indexOfLast = currentPage * appointmentsPerPage;
  const indexOfFirst = indexOfLast - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  return (
    <div id="appointments-body" style={{ display: "flex" }}>
      <SideMenu />
      <motion.div
        className="appointments-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Appointments</h2>

        <div className="filters">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="patient"
            placeholder="Filter by patient name"
            value={filters.patient}
            onChange={handleFilterChange}
          />
        </div>
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Dentist</th>
              <th>Type</th>
              <th>Status</th>
              <th>Situation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {currentAppointments.length > 0 ? (
                currentAppointments.map((appt) => (
                  <motion.tr
                    key={appt.id}
                    whileHover={{ scale: 1.02 }}
                    className="patient-row"
                  >
                    <td>
                      {appt.patient.user.firstname} {appt.patient.user.lastname}
                    </td>
                    <td>{appt.appointment_date}</td>
                    <td>{appt.appointment_time}</td>
                    <td>
                      {appt.dentist.user.firstname} {appt.dentist.user.lastname}
                    </td>
                    <td>
                    <span
                        className="appointment-type"
                        style={{
                          backgroundColor: typeColors[appt.type.act] || "#ccc",
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          margin: "0 8px",
                        }}
                      >
                        {appt.type.act}
                      </span>
                    </td>
                    <td>
                      <select
                        value={appt.status}
                        onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                      >
                        <option value="Pending"  selected={appt.statut=='Pending'?true:false}>Pending</option>
                        <option value="Arrived" selected={appt.statut=='Arrived'?true:false}>Arrived</option>
                        <option value="Abscent" selected={appt.statut=='Abscent'?true:false}>Abscent</option>
                      </select>
                    </td>
                    <td>
                      <select onChange={(e)=>handleSituationChange(appt.id,e.target.value)} disabled={appt.statut=='Arrived'?false:true} id="">
                        <option value="Wainting">Waiting</option>
                        <option value="Armchair">Armchair</option>
                        <option value="Secretary">Secretary</option>
                        <option value="Abscent" selected={appt.statut=='Released'?true:false}>Released</option>
                      </select>
                    </td>
                    <td>
                        <TbEdit className="edit-btn" size={25} onClick={()=>{
                          setEditMode(true);
                          setEditedAppointment(appt);
                          console.log(appt);
                        }} />
                        <CgTrash className="delete-btn" size={25} onClick={()=>{
                            setShowDeleteConfirm(true);
                            setAppointmentToDelete(appt);
                          }}  />
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr whileHover={{ scale: 1.02 }} className="patient-row">
                  <td colSpan="5">No appointments found.</td>
                </motion.tr>
              )}
            </AnimatePresence>
            {/* Edit Appointment Form */}
            <AnimatePresence>
            {editMode && (
              <motion.div 
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="edit-modal"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                >
                  <div className="modal-header">
                    <h3>Edit Appointment</h3>
                    <X className="close-icon" onClick={() => setEditMode(false)} />
                  </div>
                  
                  <form onSubmit={handleSave}>
                    <div className="form-group">
                      <label>Patient:</label>
                      <Select
                        className="select"
                        options={patientOptions}
                        // value={editedAppointment.patient_id}
                        onChange={(selected) => setEditedAppointment({...editedAppointment, patient_id: selected.value})}
                        placeholder="Search for a patient"
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            border: '2px solid #0013a5',
                            borderRadius: '12px',
                            boxShadow: state.isFocused ? '0 0 0 2px rgba(0,19,165,0.2)' : 'none',
                            '&:hover': {
                              borderColor: '#0013a5',
                            },
                            padding: '6px',
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected ? '#0013a5' : 'white',
                            color: state.isSelected ? 'white' : '#0013a5',
                            '&:hover': {
                              backgroundColor: '#e6f0ff',
                            }
                          })
                        }}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={editedAppointment.appointment_date}
                        onChange={(e) => setEditedAppointment({
                          ...editedAppointment,
                          appointment_date:e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        value={editedAppointment.appointment_time}
                        onChange={(e) => setEditedAppointment({
                          ...editedAppointment,
                          appointment_time:e.target.value
                        })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Type</label>
                      <select name="" id="" onChange={(e)=>setEditedAppointment({
                        ...editedAppointment,
                        type_id:e.target.value
                      })}>
                        {types.map(type=>(
                          <option key={type.id} selected={type.id==editedAppointment.type_id?true:false} value={type.id}>{type.act} </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Dentist</label>
                      <select name="" id="" onChange={(e)=>{
                        console.log(e.target.value);
                        setEditedAppointment({
                        ...editedAppointment,
                        dentist_id:e.target.value
                      })
                      console.log(editedAppointment)
                      }}>
                        {dentists.map(dentist=>(
                          <option key={dentist.id} selected={dentist.id==editedAppointment.dentist_id?true:false} value={dentist.id}>{dentist.user.firstname} {dentist.user.lastname}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={editedAppointment.statut}
                        onChange={(e) => setEditedAppointment({
                          ...editedAppointment,
                          statut: e.target.value
                        })}
                      >
                        <option value="Pending" selected={editedAppointment.statut=='Pending'?true:false}>Pending</option>
                        <option value="Arrived" selected={editedAppointment.statut=='Arrived'?true:false}>Arrived</option>
                        <option value="Abscent" selected={editedAppointment.statut=='Abscent'?true:false}>Abscent</option>
                      </select>
                    </div>
                    
                    <div className="modal-actions">
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="save-btn"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        {/* Delete Confirmation */}
                    <AnimatePresence>
                      {showDeleteConfirm && (
                        <motion.div 
                          className="modal-overlay"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <motion.div 
                            className="confirm-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                          >
                            <h3>Confirm Deletion</h3>
                            {/* <p>Are you sure you want to delete {appointmentToDelete.patient.user.firstname || 'alae'} {appointmentToDelete.patient.user.lastname|| 'alae'} appointment at {appointmentToDelete.appointment_time || 'alae'} {appointmentToDelete.appointment_date || 'alae'}  ?</p> */}
                            <p className="warning-text">This action cannot be undone.</p>
                            
                            <div className="confirm-actions">
                              <button 
                                className="cancel-btn"
                                onClick={() => setShowDeleteConfirm(false)}
                              >
                                Cancel
                              </button>
                              <button 
                                className="delete-btnn"
                                onClick={()=>handleDelete(appointmentToDelete.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination" id="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </motion.div>
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

export default ListAppointments;
