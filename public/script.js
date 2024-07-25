// Initialize Web3
async function initWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
        alert('MetaMask is not installed. Please install MetaMask to use this application.');
    }
}

// Load the topbar.html content into the placeholder
async function loadMenuBar() {
    const response = await fetch('topbar.html');
    if (response.ok) {
        const menuBarHtml = await response.text();
        document.getElementById('topbar').innerHTML = menuBarHtml;

        // After loading the menu bar, set the account addresses
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.enable();
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];

                // Store the account address in localStorage
                localStorage.setItem('ethereumAddress', account);

                document.getElementById('viewDoctorProfile').href = `details-doctor.html?address=${account}`;
                document.getElementById('editDoctorProfile').href = `edit-doctor.html?address=${account}`;
                document.getElementById('makeAppointment').href = `create-appointment.html?address=${account}`;
                document.getElementById('updateAppointment').href = `update-appointment.html?address=${account}`;

                document.getElementById('viewPatientProfile').href = `details.html?address=${account}`;
                document.getElementById('editPatientProfile').href = `edit-patient.html?address=${account}`;
                document.getElementById('allowAccess').href = `approve.html?address=${account}`;
                document.getElementById('revokeAccess').href = `revoke.html?address=${account}`;
            } catch (error) {
                console.error("User denied account access");
            }
        } else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    } else {
        console.error('Failed to load topbar.html:', response.statusText);
    }
}

window.addEventListener('load', async () => {
    await initWeb3();
    await loadMenuBar();
});
