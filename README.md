# Blockchain-based-Data-Sharing-with-Privacy-Preserving-in-Healthcare

## Project Overview
This project focuses on the implementation of a blockchain-based data sharing system that ensures secure exchange of patient information while preserving privacy. This project involves the development of a decentralized application (DApp) utilizing Ethereum blockchain and smart contracta for secure data storage and access management.

## Features
- **Decentralized Storage**: Uses Ethereum blockchain to store patient information, ensuring data is tamper-proof.
- **Smart Contracts**: Automates access permissions and transaction process.
- **Patient Control**: Allow patients with complete authority over their health data to grant or revoke access to doctors.

## Prerequisites
- **Ganache** : For local blockchain testing.
- **MetaMask** : For managing Ethereum wallets and transactions.
- **Node.js and Truffle** : Framework for smart contract deployment.

## Setup

### Step 1: Install Prerequisites
1. Download and install **Ganache** for local blockchain testing.
2. Install **MetaMask** browser extension.
3. Download and install **Node.js**.
4. Install **Truffle** : `npm install -g truffle`

### Step 2: Clone the Repository
Clone the project repository:
`git clone <repository-url>`

### Step 3: Install Dependencies:
`npm install`

### Step 4: Setup Local Blockchain
Configure the 'truffle-config.js' file to connect to the local blockchain provided by Ganache.

### Step 5: Compile and Migrate Smart Contracts
- Compile the smart contracts:
`truffle compile`
- Migrate the smart contracts:
`truffle migrate`

### Step 6: Run the Application
- Start application: `npm run start`
- Open browser and navigate to http://localhost:3000.

## Implementation
This project includes key pages for managing user interactions and data transactions. Key pages include:
- **Main Page**: Navigation to various sections of the application.
- **Register Pages**: Separate forms for patient and doctor registration.
- **Profile Pages**: View and update profiles for patients and doctors.
- **Appointment Pages**: Create and update appointments for patients.

## Future Work
Future improvements to the system include:
- **Advanced Encryption Techniques**: Integrating homomorphic encryption to further enhance data privacy.
- **System Scalability**: Enhancing the system to handle larger volumes of data and transactions.

## File Structure
```plaintext
Project Root
├── build/                         # Contains compiled smart contract artifacts
│   ├── contracts/
│   │   ├── MedicalData.json
│   │   └── Migrations.json
├── contracts/                     # Solidity smart contracts
│   ├── MedicalData.sol
│   └── Migrations.sol
├── migrations/                    # JavaScript files for deploying contracts
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js
├── node_modules/                  # Node.js dependencies (generated by npm)
├── public/                        # Source files for the application
│   ├── approve.html
│   ├── background.jpg
│   ├── create-appointment.html
│   ├── details.html
│   ├── details-doctor.html
│   ├── edit-doctor.html
│   ├── edit-patient.html
│   ├── index.html
│   ├── logo.png
│   ├── patientlist.html
│   ├── register-doctor.html
│   ├── register-patient.html
│   ├── revoke.html
│   ├── script.js
│   ├── topbar.html
│   └── update-appointment.html
├── test/                          # Contains tests for the contracts
│   ├── MedicalData.test.js
├── package.json                   # Node.js dependencies and scripts
├── package-lock.json              # Node.js dependencies lock file
├── server.js                      # Server configuration and setup
├── LICENSE                        # License file for the project
└── truffle-config.js              # Configuration file for Truffle
