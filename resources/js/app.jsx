import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';
import '../css/app.css';
import Appointments from './Components/Receptionist/Appointments';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PatientsList from './Components/Receptionist/PatientList';
import Facturisation from './Components/Receptionist/Facturisation';
import AddPatient from './Components/Receptionist/AddPatient';
import ListAppointments from './Components/Receptionist/ListAppointments';
import FactureList from './Components/Receptionist/FactureList';
import LoginForm from './Components/Auth/LoginForm';
import GroupChat from './Components/Receptionist/GroupChat';
import Dashboard from './Components/Receptionist/Dashboard';
import Profile from './Components/Receptionist/Profile';

function App(){
    return(<>
            <ToastContainer />
            <HashRouter>
                <Routes>
                    <Route path="/" element= {<Home/>} />
                    <Route path="/calendar/" element= {<Appointments/>} />
                    <Route path="/patients/" element= {<PatientsList/>} />
                    <Route path="/factures/" element= {<FactureList/>} />
                    <Route path="/facturisation/" element= {<Facturisation/>} />
                    <Route path="/patients/addpatient/" element= {<AddPatient/>} />
                    <Route path="/appointments/" element= {<ListAppointments/>} />
                    <Route path="/messages/" element= {<GroupChat/>} />
                    <Route path="/dashboard/" element= {<Dashboard/>} />
                    <Route path="/profile/" element= {<Profile />} />
                    <Route path="/login" element= {<LoginForm/>} />
                </Routes>
            </HashRouter>
        </>
    )
}
ReactDOM.createRoot(document.getElementById('app')).render(<App/>);