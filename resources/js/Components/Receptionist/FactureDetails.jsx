import { useEffect, useState } from 'react';
import '../../../css/Receptionist/invoicelist.css';
import axios from 'axios';
import { X } from "lucide-react";
import { toast } from 'react-toastify';

export default function FactureDetails({ facture, paiements, onNewPayment,setSelectedFacture }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const token=localStorage.getItem('token');
  const totalPaid = paiements.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);
  const remaining = facture.total_amount - totalPaid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newPaiment={
        invoice_id:facture.id,
        amount_paid:amount,
        payment_date:new Date().toISOString().split('T')[0],
        payment_method:method
    }
    console.log(newPaiment);
    try {
      const response = await axios.post(`/api/payments`, newPaiment,{headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },});
      console.log(response);
      onNewPayment(response.data);
      setAmount('');
    } catch (error) {
      console.error('Payment failed:', error);

      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = `/api/invoices/${facture.id}/pdf`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="facture-details-card" >

      <div >
        <X className="close-icon" onClick={() => setSelectedFacture(null)} />
        <h2 className="facture-details-title" style={{ color: '#000', fontSize: '1.5rem', fontWeight: 'bold' }}>Facture #{facture.id}</h2>
        <p><strong>Total:</strong> {facture.total_amount} DH</p>
        <p><strong>Paid:</strong> {totalPaid.toFixed(2)} DH</p>
        <p><strong>Remaining:</strong> {remaining.toFixed(2)} DH</p>
        <p><strong>Status:</strong> <span className={`status ${facture.status}`}>{facture.status.replace('_', ' ')}</span></p>

        <hr className="divider" />

        <h3 className="payment-heading">Payments</h3>
        <ul className="payments-list">
          {paiements.map(p => (
            <li key={p.id}>
              {p.payment_date} – {p.amount_paid} € ({p.payment_method})
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="payment-form">
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="transfer">Bank Transfer</option>
        </select>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Add Payment'}
          </button>
          <button onClick={downloadPdf} id='download-button'  className="download-button">
            Download PDF
          </button>
      </div>
        
      </form>
    </div>
  );
}
