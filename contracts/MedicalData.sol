// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalData {
    
    struct Patients {
        string name;
        string phone;
        string gender;
        string bloodgroup;
        string allergies;
        string medication;
        address addr;
        uint date;
    }

    struct Doctors {
        string name;
        string phone;
        string gender;
        string major;
        address addr;
        uint date;
    }

    struct Appointments {
        address doctoraddr;
        address patientaddr;
        string date;
        string time;
        string prescription;
        string description;
        string diagnosis;
        string status;
        uint creationDate;
    }
    
    address public owner;
    address[] public patientList;
    address[] public doctorList;
    address[] public appointmentList;

    mapping(address => Patients) patients;
    mapping(address => Doctors) doctors;
    mapping(address => Appointments) appointments;

    mapping(address => mapping(address => bool)) isApproved;
    mapping(address => bool) isPatient;
    mapping(address => bool) isDoctor;
    mapping(address => uint) AppointmentPerPatient;

    uint256 public patientCount = 0;
    uint256 public doctorCount = 0;
    uint256 public appointmentCount = 0;
    uint256 public permissionGrantedCount = 0;
    
    function Record() public {
        owner = msg.sender;
    }
    
    //Retrieve patient details from user sign up page and store the details into the blockchain
    function setDetails(string memory _name, string memory _phone, string memory _gender, string memory _bloodgroup, string memory _allergies, string memory _medication) public {
        require(!isPatient[msg.sender]);
        Patients storage p = patients[msg.sender];
        
        p.name = _name;
        p.phone = _phone;
        p.gender = _gender;
        p.bloodgroup = _bloodgroup;
        p.allergies = _allergies;
        p.medication = _medication;
        p.addr = msg.sender;
        p.date = block.timestamp;
        
        patientList.push(msg.sender);
        isPatient[msg.sender] = true;
        isApproved[msg.sender][msg.sender] = true;
        patientCount++;
    }
    
    //Allows patient to edit their existing record
    function editDetails(string memory _name, string memory _phone, string memory _gender, string memory _bloodgroup, string memory _allergies, string memory _medication) public {
        require(isPatient[msg.sender]);
        Patients storage p = patients[msg.sender];
        
        p.name = _name;
        p.phone = _phone;
        p.gender = _gender;
        p.bloodgroup = _bloodgroup;
        p.allergies = _allergies;
        p.medication = _medication;
        p.addr = msg.sender;    
    }

    //Retrieve doctor details from doctor registration page and store the details into the blockchain
    function setDoctor(string memory _name, string memory _phone, string memory _gender, string memory _major) public {
        require(!isDoctor[msg.sender]);
        Doctors storage d = doctors[msg.sender];
        
        d.name = _name;
        d.phone = _phone;
        d.gender = _gender;
        d.major = _major;
        d.addr = msg.sender;
        d.date = block.timestamp;
        
        doctorList.push(msg.sender);
        isDoctor[msg.sender] = true;
        doctorCount++;
    }

    //Allows doctors to edit their existing profile
    function editDoctor(string memory _name, string memory _phone, string memory _gender, string memory _major) public {
        require(isDoctor[msg.sender]);
        Doctors storage d = doctors[msg.sender];
        
        d.name = _name;
        d.phone = _phone;
        d.gender = _gender;
        d.major = _major;
        d.addr = msg.sender;
    }

    //Retrieve appointment details from appointment page and store the details into the blockchain
    function setAppointment(address _addr, string memory _date, string memory _time, string memory _diagnosis, string memory _prescription, string memory _description, string memory _status) public {
        require(isDoctor[msg.sender]);
        Appointments storage a = appointments[_addr];
        
        a.doctoraddr = msg.sender;
        a.patientaddr = _addr;
        a.date = _date;
        a.time = _time;
        a.diagnosis = _diagnosis;
        a.prescription = _prescription; 
        a.description = _description;
        a.status = _status;
        a.creationDate = block.timestamp;

        appointmentList.push(_addr);
        appointmentCount++;
        AppointmentPerPatient[_addr]++;
    }
    
    //Retrieve appointment details from appointment page and store the details into the blockchain
    function updateAppointment(address _addr, string memory _date, string memory _time, string memory _diagnosis, string memory _prescription, string memory _description, string memory _status) public {
        require(isDoctor[msg.sender]);
        Appointments storage a = appointments[_addr];
        
        a.doctoraddr = msg.sender;
        a.patientaddr = _addr;
        a.date = _date;
        a.time = _time;
        a.diagnosis = _diagnosis;
        a.prescription = _prescription; 
        a.description = _description;
        a.status = _status;
    }
    
    //Owner of the record must give permission to doctor only they are allowed to view records
    function givePermission(address _address) public returns(bool success) {
        isApproved[msg.sender][_address] = true;
        permissionGrantedCount++;
        return true;
    }

    //Owner of the record can take away the permission granted to doctors to view records
    function RevokePermission(address _address) public returns(bool success) {
        isApproved[msg.sender][_address] = false;
        return true;
    }

    //Retrieve a list of all patients address
    function getPatients() public view returns(address[] memory) {
        return patientList;
    }

    //Retrieve a list of all doctors address
    function getDoctors() public view returns(address[] memory) {
        return doctorList;
    }

    //Retrieve a list of all appointments address
    function getAppointments() public view returns(address[] memory) {
        return appointmentList;
    }

    //Retrieve patient count
    function getPatientCount() public view returns(uint256) {
        return patientCount;
    }

    //Retrieve doctor count
    function getDoctorCount() public view returns(uint256) {
        return doctorCount;
    }

    //Retrieve appointment count
    function getAppointmentCount() public view returns(uint256) {
        return appointmentCount;
    }

    //Retrieve permission granted count
    function getPermissionGrantedCount() public view returns(uint256) {
        return permissionGrantedCount;
    }

    //Retrieve permission granted count
    function getAppointmentPerPatient(address _address) public view returns(uint256) {
        return AppointmentPerPatient[_address];
    }

    //Retrieve patient details by address
    function getPatientDetails(address _address) public view returns (string memory, string memory, string memory, string memory, string memory, string memory) {
        require(isApproved[_address][msg.sender], "Not approved to view this record");
        Patients storage p = patients[_address];
        return (p.name, p.phone, p.gender, p.bloodgroup, p.allergies, p.medication);
    }

    //Retrieve doctor details by address
    function getDoctorDetails(address _address) public view returns (string memory, string memory, string memory, string memory) {
        require(isDoctor[_address] || msg.sender == owner, "Not approved to view this record");
        Doctors storage d = doctors[_address];
        return (d.name, d.phone, d.gender, d.major);
    }

    //Retrieve appointment details by address
    function getAppointmentDetails(address _address) public view returns (address, string memory, string memory, string memory, string memory, string memory, string memory) {
        Appointments storage a = appointments[_address];
        return (a.doctoraddr, a.date, a.time, a.diagnosis, a.prescription, a.description, a.status);
    }
}
