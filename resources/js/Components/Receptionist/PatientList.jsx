import React, { useEffect, useState } from "react";
import SideMenu from "./SideMenu";
import axios, { Axios } from "axios";
import { TbEdit } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import "../../../css/Receptionist/patientslist.css";
import { X, Search, Edit, Trash2, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { IoIosInformationCircle } from "react-icons/io";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { IoPersonAddSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

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

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedPatient, setEditedPatient] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const token=localStorage.getItem('token');
  const navigate=useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios.get("http://127.0.0.1:8000/api/patients",{headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },})
      .then((res) => setPatients(res.data))
      .catch((err) => console.error(err));
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setCurrentPage(1); // Reset pagination
    axios
      .get(`http://127.0.0.1:8000/api/patients/${patient.id}/appointments`,{headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },})
      .then((response) => {
        setAppointments(response.data.appointments);
      }).catch((err) => console.error(err));
  };

  const handleEdit = (patient) => {
    var birthdate=patient.user.birthdate
    if (!birthdate){
      birthdate=null
    }else{
      birthdate=patient.user.birthdate.split('T')[0]
    }
    setEditedPatient({
      ...patient,
      user: {
        ...patient.user,
        birthdate: birthdate
      }
    });
    const updatedPatient={
        firstname:""
    }
    setEditMode(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response=await axios.put(`http://127.0.0.1:8000/api/patients/${editedPatient.id}`, editedPatient,{headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },});
      console.log(editedPatient);
      toast.success(response.data.message || "Patient updated successfully.");
      fetchPatients();
      if (selectedPatient && selectedPatient.id === editedPatient.id) {
        setSelectedPatient(editedPatient); 
      }
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/patients/${patientToDelete.id}`,{headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },});
      fetchPatients();
      if (selectedPatient && selectedPatient.id === patientToDelete.id) {
        handleClose();
      }
      setShowDeleteConfirm(false);
      toast.success("Patient deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting the patients");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedPatients.map(patientId => 
          axios.delete(`http://127.0.0.1:8000/api/patients/${patientId}`,{headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },})
        )
      );
      fetchPatients();
      setSelectedPatients([]);
      toast.success("Patient deleted successfully.");
      setShowBulkDeleteConfirm(false);
    } catch (err) {
      console.error(err);
      toast.error("Error deleting the patient");
    }
  };

  const togglePatientSelection = (patientId) => {
    setSelectedPatients(prev => 
      prev.includes(patientId) 
        ? prev.filter(id => id !== patientId) 
        : [...prev, patientId]
    );
  };

  const appointmentsPerPage = 3;
  const indexOfLast = currentPage * appointmentsPerPage;
  const indexOfFirst = indexOfLast - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  const [patientsPerPage] = useState(5); 
  const [patientsPage, setPatientsPage] = useState(1);
  const filteredPatients = patients.filter(patient =>
    `${patient.user.firstname} ${patient.user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const indexOfLastPatient = patientsPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPatientsPages = Math.ceil(filteredPatients.length / patientsPerPage);
  
  const handleClose = () => {
    setSelectedPatient(null);
    setAppointments([]);
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return 'N/A';
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="dashboard-container">
      <SideMenu />
      <main className="main-content two-column">
        {/* Left Side: Patients Table */}
        <section className="patients-section">
          <div className="section-header">
            <h2 className="section-title">Patients</h2>
            {selectedPatients.length > 0 && (
              <motion.button
                className="bulk-delete-btn"
                onClick={() => setShowBulkDeleteConfirm(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Trash2 size={18} /> Delete Selected ({selectedPatients.length})
              </motion.button>
              
            )}
          </div>
          <motion.button
            className="add-btn"
            onClick={() =>navigate('/patients/addpatient')}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
          <IoPersonAddSharp size={20} />
          </motion.button>
          

          <motion.div
            className="patients-table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <Search className="search-icon" />
            </div>
            
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    {selectedPatients.length > 0 && (
                      <Check 
                        className="select-all-check"
                        onClick={() => setSelectedPatients([])}
                      />
                    )}
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Age</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.filter(patient => `${patient.user.firstname} ${patient.user.lastname}`.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))
                  .map((patient, index) => (
                    <motion.tr 
                      key={index} 
                      whileHover={{ scale: 1.02 }} 
                      className={`patient-row ${selectedPatients.includes(patient.id) ? 'selected-row' : ''}`}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedPatients.includes(patient.id)}
                          onChange={() => togglePatientSelection(patient.id)}
                        />
                      </td>
                      <td>{patient.user.lastname} {patient.user.firstname}</td>
                      <td>{patient.user.email}</td>
                      <td>{patient.user.tel}</td>
                      <td>{calculateAge(patient.user.birthdate)}</td>
                      <td className="actions-cell">
                        <IoIosInformationCircle 
                          className="view-btn" 
                          onClick={() => handleView(patient)} 
                          title="View Details"
                          size={20}
                        />
                        <Edit 
                          className="edit-btn" 
                          onClick={() => handleEdit(patient)}
                          title="Edit Patient"
                          size={20}
                        />
                        <Trash2 
                          className="delete-btn" 
                          onClick={() => {
                            setPatientToDelete(patient);
                            setShowDeleteConfirm(true);
                          }}
                          title="Delete Patient"
                          size={20}
                        />
                      </td>
                    </motion.tr>
                  ))}
                  
              </tbody>
            </table>
            {totalPatientsPages > 1 && (
                    <div className="paginationn">
                      <button
                        onClick={() => setPatientsPage(prev => Math.max(prev - 1, 1))}
                        disabled={patientsPage === 1}
                      >
                        <ChevronLeft size={16} color="white" />
                      </button>
                      <span>{patientsPage} / {totalPatientsPages}</span>
                      <button
                        onClick={() => setPatientsPage(prev => Math.min(prev + 1, totalPatientsPages))}
                        disabled={patientsPage === totalPatientsPages}
                      >
                        <ChevronRight size={16} color="white"  />
                      </button>
                    </div>
                  )}
          </motion.div>
        </section>

        {/* Right Side: Patient Details Panel */}
        {selectedPatient && (
          <motion.section
            className="patient-details"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="details-header">
              <h3>Patient Info</h3>
              <X className="close-icon" onClick={handleClose} />
            </div>
            <p><strong>Name:</strong> {selectedPatient.user.lastname} {selectedPatient.user.firstname}</p>
            <p><strong>Gender:</strong> {selectedPatient.user.gender}</p>
            <p><strong>Email:</strong> {selectedPatient.user.email}</p>
            <p><strong>Phone:</strong> {selectedPatient.user.tel}</p>
            <p><strong>Age:</strong> {calculateAge(selectedPatient.user.birthdate)}</p>
            <p><strong>Allergies:</strong> {selectedPatient.allergies || 'None'}</p>
            <p><strong>Medical conditions:</strong> {selectedPatient.medical_conditions || 'None'}</p>

            <h4>Appointments</h4>
            <ul className="appointment-list">
              {currentAppointments.length > 0 ? (
                currentAppointments.map((appt, idx) => (
                  <li key={idx}>
                    <div className="appointment-item">
                      <span className="appointment-date">{appt.appointment_date}</span>
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
                        {appt.type.abbreviation}
                      </span>
                      <span className="appointment-status">({appt.statut})</span> -{" "}
                      <span className="appointment-dentist">
                        {appt.dentist.user.lastname} {appt.dentist.user.firstname}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <p>No appointments found.</p>
              )}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </motion.section>
        )}

        {/* Edit Patient Modal */}
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
                  <h3>Edit Patient</h3>
                  <X className="close-icon" onClick={() => setEditMode(false)} />
                </div>
                
                <form onSubmit={handleSave}>
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={editedPatient.user.firstname}
                      onChange={(e) => setEditedPatient({
                        ...editedPatient,
                        user: {
                          ...editedPatient.user,
                          firstname: e.target.value
                        }
                      })}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={editedPatient.user.lastname}
                      onChange={(e) => setEditedPatient({
                        ...editedPatient,
                        user: {
                          ...editedPatient.user,
                          lastname: e.target.value
                        }
                      })}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editedPatient.user.email}
                      onChange={(e) => setEditedPatient({
                        ...editedPatient,
                        user: {
                          ...editedPatient.user,
                          email: e.target.value
                        }
                      })}
                      
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={editedPatient.user.tel}
                      onChange={(e) => setEditedPatient({
                        ...editedPatient,
                        user: {
                          ...editedPatient.user,
                          tel: e.target.value
                        }
                      })}
                      
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Birthdate</label>
                    <input
                      type="date"
                      value={editedPatient.user.birthdate}
                      onChange={(e) => setEditedPatient({
                        ...editedPatient,
                        user: {
                          ...editedPatient.user,
                          birthdate: e.target.value
                        }
                      })}
                      
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={editedPatient.user.gender}
                      onChange={(e) => setEditedPatient({
                        ...editedPatient,
                        user: {
                          ...editedPatient.user,
                          gender: e.target.value
                        }
                      })}
                      
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Allergies</label>
                    <textarea
                      value={editedPatient.allergies}
                      onChange={(e) => setEditedPatient({
                        ...editedPatient,
                        allergies: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Medical Conditions</label>
                    <textarea
                      value={editedPatient.medical_conditions}
                      onChange={(e) => setEditedPatient({
                        ...editedPatient,
                        medical_conditions: e.target.value
                      })}
                    />
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

        {/* Delete Confirmation Modal */}
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
                <p>Are you sure you want to delete {patientToDelete?.user?.firstname} {patientToDelete?.user?.lastname}?</p>
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
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Delete Confirmation Modal */}
        <AnimatePresence>
          {showBulkDeleteConfirm && (
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
                <h3>Confirm Bulk Deletion</h3>
                <p>Are you sure you want to delete {selectedPatients.length} selected patients?</p>
                <p className="warning-text">This action cannot be undone.</p>
                
                <div className="confirm-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setShowBulkDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="delete-btnn"
                    onClick={handleBulkDelete}
                  >
                    Delete All
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
      </main>
    </div>
  );
};

export default PatientsList;