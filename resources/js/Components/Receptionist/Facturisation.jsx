import React, { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, ChevronDown, X, Check } from "lucide-react";
import axios from "axios";
import Select from 'react-select';
import "../../../css/Receptionist/Facturisation.css"; // Your custom styles
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';

const Facturisation = () => {
  const [activeTab, setActiveTab] = useState("estimate"); // "estimate" or "invoice"
  const [treatmentType, setTreatmentType] = useState("appointment");
  const [estimateItems, setEstimateItems] = useState([
    { id: Date.now(), price: "", type: "", name: "",typeT:"" },
  ]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [analyseTypes, setAnalyseTypes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [patientId,setPatientId]=useState('');
  const token=localStorage.getItem('token');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, appointmentTypes,analyseTypes ] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/patients",{headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },}),
          axios.get("http://127.0.0.1:8000/types",{headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },}),
          axios.get("http://127.0.0.1:8000/type_analyses",{headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },}),
        ]);
        console.log(patientsRes,appointmentTypes,analyseTypes)
        setPatients(patientsRes.data.filter((patient) => patient.id!= 9))
        console.log(patients);
        setAppointmentTypes(appointmentTypes.data);
        setAnalyseTypes(analyseTypes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = () => {
    setEstimateItems([
      ...estimateItems,
      { id: Date.now(),  price: "", type: "", name: "",typeT:"" },
    ]);
    console.log(estimateItems);
  };

  const handleRemoveItem = (id) => {
    if (estimateItems.length > 1) {
      setEstimateItems(estimateItems.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setEstimateItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          if (field === "type") {
            const treatment =
              treatmentType === "appointment"
                ? appointmentTypes.find((t) => t.id == value)
                : analyseTypes.find((t) => t.id == value);
            if (treatment) {
              updatedItem.name = treatment.name;
              updatedItem.price = treatment.price;
            }
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return estimateItems
      .reduce((total, item) => {
        return total  + (parseFloat(item.price) || 0);
      }, 0)
      .toFixed(2);
  };

  const handleGenerateEstimate = async(e) => {
    e.preventDefault();
    if (!selectedPatient) {
      toast.error('Please select a patient');
      return;
    }

    setIsGenerating(true);
    try {
      const estimateData = {
        patient_id: selectedPatient,
        items: estimateItems.map((item) => ({
          treatment_id: item.type,
          unit_price: item.price,
          treatmentType:item.typeT
        })),
        total: calculateTotal(),
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/estimates",
        estimateData,{headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },}
      );
      setGeneratedDoc(response.data);
      setIsGenerating(false);
      const estimateId = response.data.id;
      window.open(response.data.download_url,'_blank');
    }catch(error){
      console.error("Error generating estimate:", error);
      setIsGenerating(false);
    }
  };

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    // if (!generatedDoc) {
    //   alert("Please generate an estimate first");
    //   return;
    // }

    setIsGenerating(true);
    try {
      const invoiceData = {patient_id: selectedPatient,
        items: estimateItems.map((item) => ({
          treatment_id: item.type,
          unit_price: item.price,
          treatmentType:item.typeT
        })),
        total: calculateTotal()
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/invoices",
        invoiceData,{headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },}
      );
      setGeneratedDoc(response.data);
      setIsGenerating(false);
      const estimateId = response.data.id;
      window.open(response.data.download_url,'_blank');
    } catch (err) {
      console.error("Error generating invoice:", err);
      setIsGenerating(false);
    }
  };

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.user.firstname} ${p.user.lastname}`
  }));

  return (
    <div className="facturisation-container">
      <SideMenu />
      <main className="main-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="content-wrapper"
        >
      {/* <h1 className="title">Gestion de la Facturisation</h1> */}
          {/* Tabs to switch between Estimate and Invoice */}
          <div className="tabs">
            <div
              className={`tab ${activeTab === "estimate" ? "active" : ""}`}
              onClick={() => setActiveTab("estimate")}
            >
              Estimate
            </div>
            <div
              className={`tab ${activeTab === "invoice" ? "active" : ""}`}
              onClick={() => setActiveTab("invoice")}
            >
              Invoice
            </div>
          </div>

          <motion.div
            className="tab-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Facturation or Estimation Form */}
            <h2 className="card-title">
              {activeTab === "estimate" ? "Generate an estimation" : "Generate an Invoice"}
            </h2>

            <form onSubmit={activeTab === "estimate" ? handleGenerateEstimate : handleGenerateInvoice}>
              {/* Patient selection */}
              <div className="form-group">
                <label className="label">Patient</label>
                <div className="relative">
                <Select
                    className="select"
                    options={patientOptions}
                    onChange={(selected) => setSelectedPatient(selected.value)}
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
              </div>
              
              {/* Treatment Form based on Selection */}
              <div className="items-container">
                {estimateItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="item-row"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Treatment Type Selector (Per Item) */}
                    <div className="form-group">
                      <label className="label">Treatment Category</label>
                      <div className="radio-group">
                        <motion.label
                          whileTap={{ scale: 0.95 }}
                          className={`radio-option ${item.typeT === "appointment" ? "active" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`treatmentType-${item.id}`}
                            value="appointment"
                            checked={item.typeT === "appointment"}
                            onChange={(e) => handleItemChange(item.id, "typeT", e.target.value)}
                            className="hidden-radio"
                          />
                          <span className="radio-custom"></span>
                          <span className="radio-label">Appointment</span>
                        </motion.label>

                        <motion.label
                          whileTap={{ scale: 0.95 }}
                          className={`radio-option ${item.typeT === "analyse" ? "active" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`treatmentType-${item.id}`}
                            value="analyse"
                            checked={item.typeT === "analyse"}
                            onChange={(e) => handleItemChange(item.id, "typeT", e.target.value)}
                            className="hidden-radio"
                          />
                          <span className="radio-custom"></span>
                          <span className="radio-label">Analysis</span>
                        </motion.label>
                      </div>
                    </div>

                    {/* Treatment Selection */}
                    <div className="form-group">
                      <label className="label">Treatment Type</label>
                      <select
                        className="select"
                        value={item.type}
                        onChange={(e) => {
                          const selectedTypeId = e.target.value;
                          const selectedType =
                            item.typeT === "appointment"
                              ? appointmentTypes.find((type) => type.id == selectedTypeId)
                              : analyseTypes.find((type) => type.id == selectedTypeId);

                          handleItemChange(item.id, "type", selectedTypeId);
                          handleItemChange(item.id, "name", selectedType?.name || selectedType?.label || "");
                          handleItemChange(item.id, "price", selectedType?.price || 0);
                        }}
                        required
                      >
                        <option value="">Select a type</option>
                        {item.typeT === "appointment" &&
                          appointmentTypes.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.act}
                            </option>
                          ))}
                        {item.typeT === "analyse" &&
                          analyseTypes.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Price Input */}
                    <div className="form-group">
                      <label className="label">Unit Price</label>
                      <input
                        type="text"
                        className="input"
                        value={item.price}
                        onChange={(e) => handleItemChange(item.id, "price", e.target.value)}
                        required
                      />
                    </div>

                    {/* Remove Button */}
                    {estimateItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="remove-item-button"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>


              <motion.button
                type="button"
                onClick={handleAddItem}
                className="add-item-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={16} /> Add Treatment
              </motion.button>

              <div className="total-section">
                <span className="total-label">Total:</span>
                <span className="total-amount">{calculateTotal()} DH</span>
              </div>

              <motion.button
                type="submit"
                className="submit-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : activeTab === "estimate" ? "Generate estimate" : "Generate invoice"}
              </motion.button>
            </form>
          </motion.div>
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

export default Facturisation;
