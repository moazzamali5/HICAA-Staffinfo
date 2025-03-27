import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBznEzlZirP0pvdYapdJf0_YEJORmAq8Ls",
    authDomain: "hicaa-staffinfo.firebaseapp.com",
    projectId: "hicaa-staffinfo",
    storageBucket: "hicaa-staffinfo.firebasestorage.app",
    messagingSenderId: "576458310276",
    appId: "1:576458310276:web:a449a0e9fc4db2a178f8d1",
    measurementId: "G-4YS2N2QQLK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM Elements
const staffForm = document.getElementById('staffForm');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const responsesBtn = document.getElementById('responsesBtn');
const staffFormLink = document.getElementById('staffFormLink');
const adminModal = document.getElementById('adminModal');
const loginBtn = document.getElementById('loginBtn');
const adminPassword = document.getElementById('adminPassword');
const responsesPage = document.getElementById('responsesPage');
const responsesList = document.getElementById('responsesList');
const mainContent = document.querySelector('.main-content');
const successMessage = document.getElementById('successMessage');
const closeSuccessBtn = document.querySelector('.close-success');
const searchInput = document.getElementById('searchInput');
const siblingsCount = document.getElementById('siblingsCount');
const siblingsContainer = document.getElementById('siblingsContainer');
const disabilityDetailsContainer = document.getElementById('disabilityDetailsContainer');
const hasDisabilityRadios = document.getElementsByName('hasDisability');
const maritalStatusRadios = document.getElementsByName('maritalStatus');
const partnerInfoContainer = document.getElementById('partnerInfoContainer');
const passportPhoto = document.getElementById('passportPhoto');
const selfiePhoto = document.getElementById('selfiePhoto');
const passportFileName = document.getElementById('passportFileName');
const selfieFileName = document.getElementById('selfieFileName');

// Admin password (in a real application, this should be handled server-side)
const ADMIN_PASSWORD = "bananacheese";

// Mobile sidebar toggle
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Success message functions
function showSuccessMessage() {
    successMessage.style.display = 'flex';
}

function hideSuccessMessage() {
    successMessage.style.display = 'none';
}

closeSuccessBtn.addEventListener('click', hideSuccessMessage);

// Navigation functions
function showStaffForm() {
    mainContent.style.display = 'block';
    responsesPage.classList.add('hidden');
    staffFormLink.classList.add('active');
    responsesBtn.classList.remove('active');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
}

function showResponses() {
    mainContent.style.display = 'none';
    responsesPage.classList.remove('hidden');
    staffFormLink.classList.remove('active');
    responsesBtn.classList.add('active');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
    
    // Load responses data
    const staffRef = ref(database, 'staff');
    onValue(staffRef, (snapshot) => {
        const data = snapshot.val();
        displayResponses(data);
    });
}

// Navigation event listeners
staffFormLink.addEventListener('click', (e) => {
    e.preventDefault();
    showStaffForm();
});

responsesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    adminModal.style.display = 'flex';
});

// Siblings functionality
siblingsCount.addEventListener('change', () => {
    const count = parseInt(siblingsCount.value) || 0;
    siblingsContainer.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const siblingDiv = document.createElement('div');
        siblingDiv.className = 'sibling-group';
        siblingDiv.innerHTML = `
            <h4>Sibling ${i + 1}</h4>
            <div class="form-group">
                <label for="siblingName${i}">Name</label>
                <input type="text" id="siblingName${i}" name="siblingName${i}" required>
            </div>
            <div class="form-group">
                <label for="siblingContact${i}">Contact</label>
                <input type="tel" id="siblingContact${i}" name="siblingContact${i}" required>
            </div>
            <div class="form-group">
                <label for="siblingIcPassport${i}">IC/Passport Number</label>
                <input type="text" id="siblingIcPassport${i}" name="siblingIcPassport${i}" required>
            </div>
        `;
        siblingsContainer.appendChild(siblingDiv);
    }
});

// Form validation
function validateForm() {
    const submitBtn = document.querySelector('.submit-btn');
    // Keep submit button always enabled
    submitBtn.disabled = false;
}

// Add validation listeners
staffForm.addEventListener('change', validateForm);

// Initialize form validation on page load
document.addEventListener('DOMContentLoaded', validateForm);

// Handle race selection
function handleRaceChange() {
    const raceSelect = document.getElementById('race');
    const otherRaceContainer = document.getElementById('otherRaceContainer');
    const otherRaceInput = document.getElementById('otherRace');
    
    if (raceSelect.value === 'Other') {
        otherRaceContainer.style.display = 'block';
        otherRaceInput.required = true;
    } else {
        otherRaceContainer.style.display = 'none';
        otherRaceInput.required = false;
        otherRaceInput.value = ''; // Clear the input when hidden
    }
}

// Handle religion selection
function handleReligionChange() {
    const religionSelect = document.getElementById('religion');
    const otherReligionContainer = document.getElementById('otherReligionContainer');
    const otherReligionInput = document.getElementById('otherReligion');
    
    if (religionSelect.value === 'Other') {
        otherReligionContainer.style.display = 'block';
        otherReligionInput.required = true;
    } else {
        otherReligionContainer.style.display = 'none';
        otherReligionInput.required = false;
        otherReligionInput.value = ''; // Clear the input when hidden
    }
}

// Handle disability radio buttons
hasDisabilityRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === 'yes') {
            disabilityDetailsContainer.style.display = 'block';
            document.getElementById('disabilityDetails').required = true;
        } else {
            disabilityDetailsContainer.style.display = 'none';
            document.getElementById('disabilityDetails').required = false;
            document.getElementById('disabilityDetails').value = '';
        }
    });
});

// Handle marital status radio buttons
maritalStatusRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === 'married') {
            partnerInfoContainer.style.display = 'block';
            document.getElementById('partnerName').required = true;
            document.getElementById('partnerContact').required = true;
            document.getElementById('partnerIcPassport').required = true;
        } else {
            partnerInfoContainer.style.display = 'none';
            document.getElementById('partnerName').required = false;
            document.getElementById('partnerContact').required = false;
            document.getElementById('partnerIcPassport').required = false;
            document.getElementById('partnerName').value = '';
            document.getElementById('partnerContact').value = '';
            document.getElementById('partnerIcPassport').value = '';
        }
    });
});

// Handle file uploads
passportPhoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        passportFileName.textContent = file.name;
    } else {
        passportFileName.textContent = 'No file chosen';
    }
});

selfiePhoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        selfieFileName.textContent = file.name;
    } else {
        selfieFileName.textContent = 'No file chosen';
    }
});

// Update form submission
staffForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const siblings = [];
    const count = parseInt(siblingsCount.value) || 0;
    
    for (let i = 0; i < count; i++) {
        siblings.push({
            name: document.getElementById(`siblingName${i}`).value,
            contact: document.getElementById(`siblingContact${i}`).value,
            icPassport: document.getElementById(`siblingIcPassport${i}`).value
        });
    }

    // Handle race value
    const raceSelect = document.getElementById('race');
    const raceValue = raceSelect.value === 'Other' 
        ? document.getElementById('otherRace').value 
        : raceSelect.value;

    // Handle religion value
    const religionSelect = document.getElementById('religion');
    const religionValue = religionSelect.value === 'Other' 
        ? document.getElementById('otherReligion').value 
        : religionSelect.value;

    // Handle disability value
    const hasDisability = document.querySelector('input[name="hasDisability"]:checked');
    const disabilityValue = hasDisability ? hasDisability.value : 'no';
    const disabilityDetails = disabilityValue === 'yes' 
        ? document.getElementById('disabilityDetails').value 
        : '';

    // Handle marital status and partner information
    const maritalStatus = document.querySelector('input[name="maritalStatus"]:checked').value;
    const partnerInfo = maritalStatus === 'married' ? {
        name: document.getElementById('partnerName').value,
        contact: document.getElementById('partnerContact').value,
        icPassport: document.getElementById('partnerIcPassport').value
    } : null;

    // Handle file uploads
    const passportFile = passportPhoto.files[0];
    const selfieFile = selfiePhoto.files[0];

    // Create FormData object
    const formData = new FormData();
    formData.append('firstName', document.getElementById('firstName').value);
    formData.append('lastName', document.getElementById('lastName').value);
    formData.append('bloodGroup', document.getElementById('bloodGroup').value);
    formData.append('birthDate', document.getElementById('birthDate').value);
    formData.append('birthTime', document.getElementById('birthTime').value);
    formData.append('phoneNumber', document.getElementById('phoneNumber').value);
    formData.append('fatherName', document.getElementById('fatherName').value);
    formData.append('fatherPhone', document.getElementById('fatherPhone').value);
    formData.append('motherName', document.getElementById('motherName').value);
    formData.append('motherPhone', document.getElementById('motherPhone').value);
    formData.append('currentAddress', document.getElementById('currentAddress').value);
    formData.append('parentAddress', document.getElementById('parentAddress').value);
    formData.append('race', raceValue);
    formData.append('religion', religionValue);
    formData.append('email', document.getElementById('email').value);
    formData.append('siblings', JSON.stringify(siblings));
    formData.append('icPassport', document.getElementById('icPassport').value);
    formData.append('jobTitle', document.getElementById('jobTitle').value);
    formData.append('schoolName', document.getElementById('schoolName').value);
    formData.append('emergencyContact', document.getElementById('emergencyContact').value);
    formData.append('hasDisability', disabilityValue);
    formData.append('disabilityDetails', disabilityDetails);
    formData.append('maritalStatus', maritalStatus);
    formData.append('partnerInfo', JSON.stringify(partnerInfo));
    formData.append('submissionDate', new Date().toISOString());
    formData.append('passportPhoto', passportFile);
    formData.append('selfiePhoto', selfieFile);

    try {
        const staffRef = ref(database, 'staff');
        await push(staffRef, formData);
        showSuccessMessage();
        staffForm.reset();
        siblingsContainer.innerHTML = '';
        partnerInfoContainer.style.display = 'none';
        passportFileName.textContent = 'No file chosen';
        selfieFileName.textContent = 'No file chosen';
        handleRaceChange();
        handleReligionChange();
        validateForm();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
    }
});

// Admin login
loginBtn.addEventListener('click', () => {
    if (adminPassword.value === ADMIN_PASSWORD) {
        adminModal.style.display = 'none';
        showResponses();
    } else {
        alert('Incorrect password!');
    }
});

// Function to display responses with search
function displayResponses(data) {
    responsesList.innerHTML = '';
    
    if (data) {
        const searchTerm = searchInput.value.toLowerCase();
        Object.entries(data).forEach(([key, value]) => {
            if (value.firstName.toLowerCase().includes(searchTerm)) {
                const responseCard = document.createElement('div');
                responseCard.className = 'response-card';
                
                let siblingsHtml = '';
                if (value.siblings && value.siblings.length > 0) {
                    siblingsHtml = `
                        <p><strong>Siblings:</strong></p>
                        <ul>
                            ${value.siblings.map(sibling => `
                                <li>${sibling.name} (${sibling.contact}) - IC/Passport: ${sibling.icPassport}</li>
                            `).join('')}
                        </ul>
                    `;
                }

                let partnerHtml = '';
                if (value.maritalStatus === 'married' && value.partnerInfo) {
                    partnerHtml = `
                        <p><strong>Partner Information:</strong></p>
                        <p>Name: ${value.partnerInfo.name}</p>
                        <p>Contact: ${value.partnerInfo.contact}</p>
                        <p>IC/Passport: ${value.partnerInfo.icPassport}</p>
                    `;
                }

                let photosHtml = '';
                if (value.passportPhoto || value.selfiePhoto) {
                    photosHtml = `
                        <div class="response-photos">
                            ${value.passportPhoto ? `
                                <div class="photo-container">
                                    <p><strong>Passport/IC Photo:</strong></p>
                                    <img src="${value.passportPhoto}" alt="Passport/IC Photo" class="response-photo">
                                </div>
                            ` : ''}
                            ${value.selfiePhoto ? `
                                <div class="photo-container">
                                    <p><strong>Selfie Photo:</strong></p>
                                    <img src="${value.selfiePhoto}" alt="Selfie Photo" class="response-photo">
                                </div>
                            ` : ''}
                        </div>
                    `;
                }

                responseCard.innerHTML = `
                    <h3>${value.firstName} ${value.lastName}</h3>
                    <p><strong>Blood Group:</strong> ${value.bloodGroup}</p>
                    <p><strong>Birth Date:</strong> ${new Date(value.birthDate).toLocaleDateString()}</p>
                    <p><strong>Birth Time:</strong> ${value.birthTime || '00:00'}</p>
                    <p><strong>Phone Number:</strong> ${value.phoneNumber}</p>
                    <p><strong>Email:</strong> ${value.email}</p>
                    <p><strong>Current Address:</strong> ${value.currentAddress}</p>
                    <p><strong>Parent's Address:</strong> ${value.parentAddress || 'Same as current address'}</p>
                    <p><strong>Race:</strong> ${value.race}</p>
                    <p><strong>Religion:</strong> ${value.religion}</p>
                    <p><strong>Father's Name:</strong> ${value.fatherName}</p>
                    <p><strong>Father's Phone:</strong> ${value.fatherPhone}</p>
                    <p><strong>Mother's Name:</strong> ${value.motherName}</p>
                    <p><strong>Mother's Phone:</strong> ${value.motherPhone}</p>
                    ${siblingsHtml}
                    ${partnerHtml}
                    <p><strong>IC/Passport:</strong> ${value.icPassport}</p>
                    ${photosHtml}
                    <p><strong>Job Title:</strong> ${value.jobTitle}</p>
                    <p><strong>School Name:</strong> ${value.schoolName}</p>
                    <p><strong>Emergency Contact:</strong> ${value.emergencyContact}</p>
                    <p><strong>Disability:</strong> ${value.hasDisability === 'yes' ? 'Yes - ' + value.disabilityDetails : 'No'}</p>
                    <p><strong>Submitted:</strong> ${new Date(value.submissionDate).toLocaleString()}</p>
                `;
                responsesList.appendChild(responseCard);
            }
        });
    } else {
        responsesList.innerHTML = '<p>No responses yet.</p>';
    }
}

// Search functionality
searchInput.addEventListener('input', () => {
    const staffRef = ref(database, 'staff');
    onValue(staffRef, (snapshot) => {
        const data = snapshot.val();
        displayResponses(data);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === adminModal) {
        adminModal.style.display = 'none';
    }
    if (e.target === successMessage) {
        hideSuccessMessage();
    }
}); 
