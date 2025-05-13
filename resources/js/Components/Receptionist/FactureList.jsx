import { useEffect, useState } from 'react';
import FactureDetails from './FactureDetails';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import '../../../css/Receptionist/invoicelist.css'; 
import SideMenu from './SideMenu';
import { ToastContainer } from 'react-toastify';
import { PiInvoiceBold } from "react-icons/pi";
import { FaDownload } from "react-icons/fa6";

const FactureList = () => {
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [factures, setFactures] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/invoices')
      .then(response => {
        console.log(response);
        setFactures(response.data);
      });
  }, []);
  function HandleDownload(id){
    const link = document.createElement('a');
    link.href = `http://127.0.0.1:8000/invoices/${id}/download`;
    link.setAttribute('download', `invoice_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <main id="global-list-container">
        <div className="facture-list-container">
            <SideMenu/>
        <h1 className="facture-title">List of Invoices</h1>

        <table className="facture-table">
            <thead>
            <tr>
                <th>Patient</th>
                <th>Total (€)</th>
                <th>Payed (€)</th>
                <th>Remaining (€)</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <AnimatePresence>
                {factures.map((f) => {
                const paid = f.payments?.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0) || 0;
                const remaining = f.total_amount - paid;

                return (
                    <motion.tr
                    key={f.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="facture-row"
                    whileHover={{ scale: 1.02 }}
                    >
                    <td>{f.patient.user.firstname} {f.patient.user.lastname}</td>
                    <td>{f.total_amount}</td>
                    <td>{paid.toFixed(2)}</td>
                    <td>{remaining.toFixed(2)}</td>
                    <td>
                        <span className={`status ${f.status}`}>{f.status.replace('_', ' ')}</span>
                    </td>
                    <td>
                        <PiInvoiceBold className="facture-button" onClick={() => setSelectedFacture(f)} title="Payments" />
                        <FaDownload className="facture-button download-button" onClick={()=>HandleDownload(f.id)} title="Download PDF" />
                    </td>
                    </motion.tr>
                );
                })}
            </AnimatePresence>
            </tbody>
        </table>
        <AnimatePresence>
            {selectedFacture && (
            <motion.div
                className="facture-details-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
            >
                <FactureDetails
                facture={selectedFacture}
                paiements={selectedFacture.payments}
                onNewPayment={(newPaiement) => {
                    const updated = {
                    ...selectedFacture,
                    payments: [...selectedFacture.payments, newPaiement],
                    };
                    setSelectedFacture(updated);
                }}
                setSelectedFacture={setSelectedFacture}
                />
            </motion.div>
            )}
        </AnimatePresence>
        </div>
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
  );
};

export default FactureList;
