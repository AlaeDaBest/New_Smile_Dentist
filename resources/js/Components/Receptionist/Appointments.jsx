import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../css/Home/appointment.css';
import SideMenu from './SideMenu';
import { motion, AnimatePresence } from "framer-motion";
import { Home, Calendar, Users, Smile, Settings, LogOut, Menu, X } from "lucide-react";

// Enhanced color palette with more vibrant colors
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

// Glass morphism effect styles
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
};

function getMondayISO() {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  return monday.toISOString().slice(0, 10);
}

function renderEventContent(arg) {
  const { patientName } = arg.event.extendedProps;
  const title = arg.event.title;
  const timeText = arg.timeText;
  const backgroundColor = typeColors[title] || '#888';

  return (
    <motion.div 
      className="fc-event-custom" 
      style={{ backgroundColor }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="event-content">
        <strong className="font-semibold">{patientName}</strong>
        <span className="text-sm">{title}</span>
        <span className="text-xs text-gray-200">{timeText}</span>
      </div>
    </motion.div>
  );
}

const Appointments = () => {
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [patients, setPatients] = useState([]);
  const [types, setTypes] = useState([]);
  const [duration, setDuration] = useState('');
  const [act, setAct] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    dentistId: '',
    patientId: '',
    typeId: 1
  });
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const token = localStorage.getItem('token');
  console.log(token)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dentistsRes = await axios.get('http://127.0.0.1:8000/dentists',{
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const dentistsArray = Array.isArray(dentistsRes.data)
          ? dentistsRes.data
          : dentistsRes.data.data || dentistsRes.data.user || [];
        const   doctors = dentistsArray.map(d => ({
          id: String(d.id),
          title: `${d.user.firstname} ${d.user.lastname}`,
        }));
        
        const [patientsRes, typesRes, apptsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/patients',{headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },}),
          axios.get('http://127.0.0.1:8000/types',{headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },}),
          axios.get('http://127.0.0.1:8000/api/appointments',{headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },})
        ]);

        setPatients(patientsRes.data);
        setTypes(typesRes.data);

        const apptsArray = Array.isArray(apptsRes.data)
          ? apptsRes.data
          : apptsRes.data.data || [];
        const appts = apptsArray.map(a => {
          const startISO = `${a.appointment_date}T${a.appointment_time}:00`;
          const endDate = new Date(startISO);
          endDate.setMinutes(endDate.getMinutes() + a.type.duration);
          return {
            id: String(a.id),
            resourceId: String(a.dentist_id),
            title: a.type.act,
            start: startISO,
            end: endDate.toISOString(),
            extendedProps: {
              patientName: `${a.patient.user.firstname} ${a.patient.user.lastname}`,
              patientId: a.patient.id,
              dentistId: a.dentist_id,
              typeId: a.type_id
            }
          };
        });

        setResources(doctors);
        setEvents(appts);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data", {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    var selectedType = types.find(type => type.id == parseInt(formData.typeId) );
    if (selectedType) {
      setDuration(selectedType.duration);
      setAct(selectedType.act);
    }else{
      selectedType=1;
    }
  }, [formData.typeId, types]);

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.user.firstname} ${p.user.lastname}`
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    var selectedType = types.find(type => type.id == formData.typeId);
    const selectedPatient = patients.find(p => p.id == formData.patientId);

    if (!selectedPatient) {
      toast.error("Invalid patient or appointment type.");
      return;
    }
    if(!selectedType){
      selectedType=types.find(type => type.id == 1);
    }

    const newAppt = {
      patient_id: formData.patientId,
      appointment_date: formData.date,
      appointment_time: formData.time,
      dentist_id: formData.dentistId,
      type_id: formData.typeId || 1,
      statut: 'Pending'
    };
    const startISO = `${formData.date}T${formData.time}:00`;
    const endDate = new Date(startISO);
    // console.log('rr',endDate);
    endDate.setMinutes(endDate.getMinutes() + Number(duration));
    // console.log(endDate);
    // console.log(duration);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/appointments', newAppt,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(token);
      const newEvent = {
        id: response.data.id,
        resourceId: formData.dentistId,
        title: selectedType?.act || 'Unknown',
        start: startISO,
        end: endDate,
        extendedProps: {
          patientName: `${selectedPatient.user.firstname} ${selectedPatient.user.lastname}`,
          patientId: formData.patientId,
          dentistId: formData.dentistId,
          typeId: formData.typeId || 1 
        }
      };
      console.log(newEvent);
      setShowForm(false);
      setEvents([...events, newEvent]);
      toast.success(response.data.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create appointment");
    }
  };

  return (
    <div className="appointments-container" style={{
      background: 'linear-gradient(135deg, #f9fafb 0%, #fff 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <SideMenu />
      
      <div className="calendar-container" style={{
        display: "flex",
        padding: "20px",
        gap: "20px",
        height: "calc(100vh - 80px)"
      }}>
        <motion.div 
          style={{ flex: 3 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            ...glassStyle,
            padding: '20px',
            marginLeft:'50px',
          }}>
            <FullCalendar
              plugins={[resourceTimeGridPlugin, interactionPlugin]}
              initialView="resourceTimeGridWeek"
              firstDay={1}
              initialDate={getMondayISO()}
              editable={true}
              eventStartEditable={true}
              eventDurationEditable={true}
              slotMinTime="09:00:00"
              slotMaxTime="20:00:00"
              slotDuration="00:10:00"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'resourceTimeGridWeek,dayGridMonth',
              }}
              resources={resources}
              events={events}
              displayEventTime={false}
              eventContent={renderEventContent}
              eventDidMount={(info) => {
                const { patientName } = info.event.extendedProps;
                const appointmentType = info.event.title;
                const start = info.event.start;
                const end = info.event.end;
                const color = typeColors[appointmentType] || '#888';
                info.el.style.backgroundColor = color;
                info.el.style.border = color;
                info.el.style.color = 'white';
                const tooltip = `Patient: ${patientName}\nType: ${appointmentType}\nStart: ${start?.toLocaleString?.() || 'N/A'}\nEnd: ${end?.toLocaleString?.() || 'N/A'}`;
                info.el.setAttribute('title', tooltip);
              }}
              eventDrop={async (info) => {
                const updatedEvent = info.event;
                const updatedStart = updatedEvent.start;
                const updatedEnd = updatedEvent.end;
                const eventId = updatedEvent.id;
                const dentistId = updatedEvent.getResources()[0].id;
                const patientId = updatedEvent.extendedProps.patientId;
                const typeId = updatedEvent.extendedProps.typeId;
                const statut = updatedEvent.extendedProps ? updatedEvent.extendedProps.statut : 'Attend';
                
                if (!dentistId || !patientId) {
                  toast.error("Missing dentist or patient information.");
                  return;
                }

                const year = updatedStart.getFullYear();
                const month = String(updatedStart.getMonth() + 1).padStart(2, '0');
                const date = String(updatedStart.getDate()).padStart(2, '0');
                const hours = String(updatedStart.getHours()).padStart(2, '0');
                const minutes = String(updatedStart.getMinutes()).padStart(2, '0');
                
                const updatedAppt = {
                  id: eventId,
                  appointment_date: `${year}-${month}-${date}`,
                  appointment_time: `${hours}:${minutes}`,
                  dentist_id: dentistId,
                  patient_id: patientId,
                  type_id: typeId,
                  statut: 'Attend',
                };

                try {
                  const response = await axios.put(`http://127.0.0.1:8000/api/appointments/${eventId}`, updatedAppt,{headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },});
                  toast.success(response.data.message, {
                    position: 'top-right',
                    autoClose: 3000,
                  });
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to update appointment", {
                    position: 'top-right',
                    autoClose: 3000,
                  });
                }
              }}
              views={{
                resourceTimeGridWeek: {
                  type: 'resourceTimeGrid',
                  duration: { days: 7 },
                  datesAboveResources: true,
                  resourceAreaHeaderContent: '',
                  resourceAreaWidth: '0px',
                }
              }}
              dateClick={(info) => {
                setFormData({
                  date: info.dateStr.split('T')[0],
                  time: info.dateStr.split('T')[1]?.slice(0, 5) || '09:00',
                  dentistId: info.resource?.id || '',
                });
                setShowForm(true);
              }}
              eventClick={info => {
                toast.info(`Appointment: ${info.event.title}\nPatient: ${info.event.extendedProps.patientName}`, {
                  position: 'top-right',
                  autoClose: 3000,
                });
              }}
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {isLegendOpen && (
            <motion.div
              style={{
                flex: 1,
                maxHeight: "100vh",
                overflowY: "auto",
                padding: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.18)"
              }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ marginBottom: "15px", fontSize: "1.2rem", color: "#0013a5" }}>Appointment Types</h4>
                <button 
                  onClick={() => setIsLegendOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#0013a5'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '10px'
              }}>
                {Object.entries(typeColors).map(([type, color]) => (
                  <motion.div
                    key={type}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.7)',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "4px",
                      backgroundColor: color,
                      marginRight: "10px"
                    }}></div>
                    <span style={{ fontSize: "14px" }}>{type}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isLegendOpen && (
          <motion.button
            onClick={() => setIsLegendOpen(true)}
            style={{
              position: 'absolute',
              right: '20px',
              bottom: '20px',
              background: '#0013a5',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,19,165,0.3)'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Calendar size={24} />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              style={glassStyle}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <form id="form_add_rdv" onSubmit={handleSubmit}>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Patient:</label>
                  <Select
                    className="select"
                    options={patientOptions}
                    onChange={(selected) => setFormData({...formData, patientId: selected.value})}
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
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Date:</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Time:</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Dentist:</label>
                  <select
                    value={formData.dentistId}
                    onChange={(e) => setFormData({ ...formData, dentistId: e.target.value })}
                    className="w-full p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  >
                    {resources.map((res) => (
                      <option key={res.id} value={res.id}>{res.title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Type:</label>
                  <select
                    value={formData.typeId}
                    onChange={(e) =>{ 
                      console.log(e.target.value)
                      setFormData({ ...formData, typeId: e.target.value })}}
                    className="w-full p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  >
                    {types.map((res) => (
                      <option key={res.id} value={res.id}>{res.act}</option>
                    ))}
                  </select>
                </div>
                
                <div id='form_add_btn' className="flex justify-end space-x-3">
                  <motion.button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save Appointment
                  </motion.button>
                </div>
              </form>
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
    </div>
  );
};

export default Appointments;