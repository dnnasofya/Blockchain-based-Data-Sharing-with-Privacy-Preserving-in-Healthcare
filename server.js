const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const dotenv = require('dotenv');
const MedicalDataArtifact = require('./build/contracts/MedicalData.json');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3(provider);
const medicalDataABI = MedicalDataArtifact.abi;
const medicalDataAddress = '0xE836a95dF04C127672B53B37D034DA431EB1Da1C'; 
const medicalData = new web3.eth.Contract(medicalDataABI, medicalDataAddress);

// Register a patient
app.post('/register-patient', async (req, res) => {
    const { name, phone, gender, bloodgroup, allergies, medication, eth_address } = req.body;
    try {
        await medicalData.methods.setDetails(name, phone, gender, bloodgroup, allergies, medication).send({ from: eth_address });
        res.send('Patient registered successfully');
    } catch (err) {
        console.error('Error registering patient on blockchain:', err);
        res.status(500).send('Blockchain error');
    }
});

// Register a doctor
app.post('/register-doctor', async (req, res) => {
    const { name, phone, gender, major, eth_address } = req.body;
    try {
        await medicalData.methods.setDoctor(name, phone, gender, major).send({ from: eth_address });
        res.send('Doctor registered successfully');
    } catch (err) {
        console.error('Error registering doctor on blockchain:', err);
        res.status(500).send('Blockchain error');
    }
});

// Add a medical record
app.post('/add-medical-record', async (req, res) => {
    const { eth_address, bloodType, allergies, medication, diagnosis } = req.body;

    try {
        await medicalData.methods.addRecord(bloodType, allergies, medication, diagnosis).send({ from: eth_address });
        res.json({ success: true });
    } catch (err) {
        console.error('Error adding medical record to blockchain:', err);
        res.status(500).send('Blockchain error');
    }
});

// Get all patients (for display purposes, only Ethereum addresses will be shown)
app.get('/get-patients', async (req, res) => {
    try {
        const patients = await medicalData.methods.getPatients().call();
        res.json({ patients });
    } catch (err) {
        console.error('Error fetching patients from blockchain:', err);
        res.status(500).send('Blockchain error');
    }
});

// Grant access to a doctor
app.post('/grant-access', async (req, res) => {
    const { doctorAddr, eth_address } = req.body;

    try {
        await medicalData.methods.givePermission(doctorAddr).send({ from: eth_address });
        res.json({ success: true });
    } catch (err) {
        console.error('Error granting access on blockchain:', err);
        res.status(500).send('Blockchain error');
    }
});

// Revoke access from a doctor
app.post('/revoke-access', async (req, res) => {
    const { doctorAddr, eth_address } = req.body;

    try {
        await medicalData.methods.RevokePermission(doctorAddr).send({ from: eth_address });
        res.json({ success: true });
    } catch (err) {
        console.error('Error revoking access on blockchain:', err);
        res.status(500).send('Blockchain error');
    }
});

// Make an appointment
app.post('/make-appointment', async (req, res) => {
    const { patientAddr, date, time, diagnosis, prescription, description, status, eth_address } = req.body;

    try {
        await medicalData.methods.setAppointment(patientAddr, date, time, diagnosis, prescription, description, status).send({ from: eth_address });
        res.json({ success: true });
    } catch (err) {
        console.error('Error creating appointment on blockchain:', err);
        res.status(500).send('Blockchain error');
    }
});

// Edit an appointment
app.post('/edit-appointment', async (req, res) => {
    const { patientAddr, date, time, diagnosis, prescription, description, status, eth_address } = req.body;

    try {
        await medicalData.methods.updateAppointment(patientAddr, date, time, diagnosis, prescription, description, status).send({ from: eth_address });
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating appointment on blockchain:', err);
        res.status(500).send('Blockchain error');
    }
});

// View a patient's record
app.get('/view-record/:patientAddr', async (req, res) => {
    const { patientAddr } = req.params;
    const doctorAddr = req.query.doctorAddr;

    try {
        const hasAccess = await medicalData.methods.accessRequests(patientAddr, doctorAddr).call();
        if (hasAccess) {
            const records = await medicalData.methods.getRecords(patientAddr).call();
            res.json({ success: true, records });
        } else {
            res.json({ success: false, message: 'Access not granted' });
        }
    } catch (error) {
        console.error('Error fetching records from blockchain:', error);
        res.status(500).send('Blockchain error');
    }
});

// Request access to a patient's record
app.post('/request-access', async (req, res) => {
    const { patientAddr, doctorAddr } = req.body;

    try {
        await medicalData.methods.requestAccess(patientAddr).send({ from: doctorAddr });
        res.json({ success: true });
    } catch (err) {
        console.error('Error requesting access on blockchain:', err);
        res.status(500).send('Blockchain error');
    }
});

// Get access requests for a patient
app.get('/get-access-requests', async (req, res) => {
    const patientAddr = req.query.patientAddr;

    try {
        const requests = await medicalData.methods.getAccessRequests(patientAddr).call();
        res.json({ requests });
    } catch (err) {
        console.error('Error fetching access requests from blockchain:', err);
        res.status(500).send('Blockchain error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
