import React, { useState, useEffect } from 'react';
import { auth, db } from '../database';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import '../css/general.css';
import '../css/auth.css';

const Register = () => {
    const [userType, setUserType] = useState('');
    const [specializationType, setSpecializationType] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [subSpecialization, setSubSpecialization] = useState('');
    const [ssn, setSSN] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [age, setAge] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const navigate = useNavigate();

    const generalSpecialties = [
        "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "Hematology",
        "Immunology", "Infectious Disease", "Nephrology", "Neurology", "Oncology",
        "Ophthalmology", "Orthopedics", "Otolaryngology (ENT)", "Pediatrics", "Psychiatry",
        "Pulmonology", "Radiology", "Rheumatology", "Urology", "Anesthesiology",
        "Pathology", "Obstetrics and Gynecology (OB/GYN)", "Plastic Surgery",
        "Emergency Medicine", "Family Medicine", "Geriatrics", "General Surgery",
        "Internal Medicine", "Sports Medicine", "Allergy and Immunology"
    ];

    const specialistSpecialties = [
        "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "Hematology",
        "Immunology", "Infectious Disease", "Nephrology", "Neurology", "Oncology",
        "Ophthalmology", "Orthopedics", "Otolaryngology (ENT)", "Pediatrics", "Psychiatry",
        "Pulmonology", "Radiology", "Rheumatology", "Urology", "Anesthesiology",
        "Pathology", "Obstetrics and Gynecology (OB/GYN)", "Plastic Surgery",
        "Emergency Medicine", "Family Medicine", "Geriatrics", "General Surgery",
        "Internal Medicine", "Sports Medicine", "Allergy and Immunology",
        "Hepatology", "Vascular Surgery", "Neonatology", "Palliative Care",
        "Reproductive Endocrinology and Infertility", "Interventional Radiology",
        "Sleep Medicine", "Critical Care Medicine", "Occupational Medicine",
        "Clinical Genetics"
    ];

    const subspecialties = {
        Cardiology: ["Interventional Cardiology", "Electrophysiology", "Pediatric Cardiology", "Heart Failure and Transplant Cardiology", "Preventive Cardiology"],
        Dermatology: ["Cosmetic Dermatology", "Dermatopathology", "Pediatric Dermatology", "Mohs Surgery", "Immunodermatology"],
        Endocrinology: ["Diabetology", "Thyroid Disorders", "Adrenal Disorders", "Pituitary Disorders", "Reproductive Endocrinology"],
        Gastroenterology: ["Hepatology", "Inflammatory Bowel Disease", "Pancreatology", "Endoscopy", "Pediatric Gastroenterology"],
        Hematology: ["Malignant Hematology", "Coagulation Disorders", "Anemia", "Bone Marrow Transplantation", "Pediatric Hematology"],
        Immunology: ["Immunodeficiency Disorders", "Autoimmune Diseases", "Allergy", "Transplant Immunology", "Pediatric Immunology"],
        InfectiousDisease: ["Viral Infections", "Bacterial Infections", "Fungal Infections", "Parasitic Infections", "Travel Medicine"],
        Nephrology: ["Chronic Kidney Disease", "Dialysis", "Kidney Transplantation", "Glomerular Diseases", "Pediatric Nephrology"],
        Neurology: ["Stroke", "Epilepsy", "Neurodegenerative Diseases", "Movement Disorders", "Pediatric Neurology"],
        Oncology: ["Breast Cancer", "Lung Cancer", "Gastrointestinal Cancer", "Hematologic Oncology", "Pediatric Oncology"],
        Ophthalmology: ["Retinal Surgery", "Corneal Diseases", "Glaucoma", "Pediatric Ophthalmology", "Oculoplastic Surgery"],
        Orthopedics: ["Sports Medicine", "Spine Surgery", "Hand Surgery", "Pediatric Orthopedics", "Joint Replacement Surgery"],
        OtolaryngologyENT: ["Head and Neck Surgery", "Otology/Neurotology", "Rhinology", "Laryngology", "Pediatric ENT"],
        Pediatrics: ["Developmental Pediatrics", "Pediatric Emergency Medicine", "Pediatric Pulmonology", "Pediatric Cardiology", "Pediatric Endocrinology"],
        Psychiatry: ["Child and Adolescent Psychiatry", "Forensic Psychiatry", "Psychosomatic Medicine", "Geriatric Psychiatry", "Addiction Psychiatry"],
        Pulmonology: ["Chronic Obstructive Pulmonary Disease (COPD)", "Asthma", "Interstitial Lung Disease", "Pulmonary Hypertension", "Pediatric Pulmonology"],
        Radiology: ["Diagnostic Radiology", "Interventional Radiology", "Neuroradiology", "Pediatric Radiology", "Breast Imaging"],
        Rheumatology: ["Rheumatoid Arthritis", "Lupus", "Spondyloarthritis", "Vasculitis", "Pediatric Rheumatology"],
        Urology: ["Urologic Oncology", "Pediatric Urology", "Female Urology", "Male Infertility", "Endourology"],
        Anesthesiology: ["Cardiac Anesthesia", "Pediatric Anesthesia", "Obstetric Anesthesia", "Pain Management", "Critical Care Anesthesia"],
        Pathology: ["Anatomic Pathology", "Clinical Pathology", "Molecular Pathology", "Forensic Pathology", "Dermatopathology"],
        ObstetricsGynecologyOBGYN: ["Maternal-Fetal Medicine", "Gynecologic Oncology", "Reproductive Endocrinology", "Urogynecology", "Pediatric and Adolescent Gynecology"],
        PlasticSurgery: ["Craniofacial Surgery", "Hand Surgery", "Burn Surgery", "Aesthetic Surgery", "Microsurgery"],
        EmergencyMedicine: ["Pediatric Emergency Medicine", "Toxicology", "Disaster Medicine", "Sports Medicine", "Emergency Medical Services (EMS)"],
        FamilyMedicine: ["Geriatric Medicine", "Adolescent Medicine", "Sports Medicine", "Palliative Care", "Preventive Medicine"],
        Geriatrics: ["Geriatric Psychiatry", "Geriatric Cardiology", "Geriatric Neurology", "Geriatric Endocrinology", "Geriatric Oncology"],
        GeneralSurgery: ["Trauma Surgery", "Colorectal Surgery", "Hepatobiliary Surgery", "Breast Surgery", "Endocrine Surgery"],
        InternalMedicine: ["Hospital Medicine", "Geriatric Medicine", "Palliative Care", "Infectious Disease", "Endocrinology"],
        SportsMedicine: ["Orthopedic Sports Medicine", "Primary Care Sports Medicine", "Sports Cardiology", "Sports Nutrition", "Sports Psychology"],
        AllergyAndImmunology: ["Pediatric Allergy", "Clinical Immunology", "Asthma", "Drug Allergy", "Food Allergy"],
        Hepatology: ["Viral Hepatitis", "Liver Transplantation", "Cirrhosis", "Fatty Liver Disease", "Pediatric Hepatology"],
        VascularSurgery: ["Endovascular Surgery", "Venous Surgery", "Pediatric Vascular Surgery", "Aortic Surgery", "Peripheral Vascular Surgery"],
        Neonatology: ["Neonatal Intensive Care", "Neonatal Cardiology", "Neonatal Neurology", "Neonatal Pulmonology", "Neonatal Surgery"],
        PalliativeCare: ["Pediatric Palliative Care", "Geriatric Palliative Care", "Oncology Palliative Care", "Palliative Psychiatry", "Pain Management"],
        ReproductiveEndocrinologyAndInfertility: ["Assisted Reproductive Technology", "Hormonal Disorders", "Recurrent Pregnancy Loss", "Male Infertility", "Polycystic Ovary Syndrome (PCOS)"],
        InterventionalRadiology: ["Vascular Interventions", "Oncology Interventions", "Neurointerventions", "Musculoskeletal Interventions", "Pediatric Interventions"],
        SleepMedicine: ["Sleep Apnea", "Insomnia", "Narcolepsy", "Restless Legs Syndrome", "Pediatric Sleep Disorders"],
        CriticalCareMedicine: ["Surgical Critical Care", "Neurological Critical Care", "Cardiovascular Critical Care", "Pediatric Critical Care", "Trauma Critical Care"],
        OccupationalMedicine: ["Industrial Medicine", "Environmental Medicine", "Travel Medicine", "Aviation Medicine", "Military Medicine"],
        ClinicalGenetics: ["Cancer Genetics", "Cardiovascular Genetics", "Neurogenetics", "Metabolic Genetics", "Prenatal Genetics"]
    };

    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
        setSpecializationType('');
        setSpecialization('');
        setSubSpecialization('');
    };

    const handleSpecializationTypeChange = (event) => {
        setSpecializationType(event.target.value);
        setSpecialization('');
        setSubSpecialization('');
    };

    const handleSpecializationChange = (event) => {
        const selectedSpecialization = event.target.value;
        setSpecialization(selectedSpecialization);
        setSubSpecialization('');
    };

    const handleSubSpecializationChange = (event) => {
        setSubSpecialization(event.target.value);
    };

    const handleSSNChange = (event) => {
        setSSN(event.target.value);
    };

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleAgeChange = (event) => {
        setAge(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    useEffect(() => {
        // Check if the user is already logged in
        const userIsLoggedIn = localStorage.getItem('userIsLoggedIn');
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (userIsLoggedIn && userData) {
            // Navigate to the appropriate home page
            if (userData.role === 'doctor') {
                navigate('/doctors/home');
            } else if (userData.role === 'sick') {
                navigate('/sicks/home');
            }
        }
    }, [navigate]);

    const handleRegister = async (event) => {
        event.preventDefault();
    
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            console.log("User created: ", user); // Debugging line
            console.log("Firestore instance in handleRegister: ", db); // Debugging line
    
            // Prepare user data
            const userData = {
                name,
                email,
                phoneNumber,
                age,
                address,
                uid: user.uid,
                photoProfileUrl: 'https://i.pinimg.com/564x/4e/22/be/4e22beef6d94640c45a1b15f4a158b23.jpg',
                role: userType,
            };
    
            if (userType === 'doctor') {
                userData.specializationType = specializationType;
                userData.specialization = specialization;
                userData.subSpecialization = subSpecialization;
                userData.numberOfPatients = 0; 
                userData.ReservationSicks = [];
    
                // Add doctor to Firestore
                await setDoc(doc(db, 'doctors', user.uid), userData);
                console.log("Doctor document created in Firestore"); // Debugging line
            } else if (userType === 'sick') {
                userData.ssn = ssn;
    
                // Add sick user to Firestore
                await setDoc(doc(db, 'sicks', user.uid), userData);
                console.log("Sick document created in Firestore"); // Debugging line
            }
    
            // Handle successful registration
            setMessage('Registration successful!');
            setMessageType('success');
            setTimeout(() => {
                navigate('/login');
            }, 1200);
        } catch (error) {
            // Handle registration errors
            console.error('Error during registration:', error.message);
            setMessage(`Error: ${error.message}`);
            setMessageType('error');
        }
    };
    

    return (
        <div className="signup">
            <div className="wrapper">
                <h2>Submit a Request</h2>
                <form className="signup-form" onSubmit={handleRegister}>
                    <div className="input-box">
                        <input type="text" id="name" placeholder="Enter your full name" value={name} onChange={handleNameChange} required />
                    </div>
                    <div className="input-box">
                        <input type="email" id="email" placeholder="Enter your email" className="signup-email" value={email} onChange={handleEmailChange} required />
                    </div>
                    <div className="input-box">
                        <input type="password" id="password" placeholder="Enter your password" value={password} onChange={handlePasswordChange} required />
                    </div>
                    <div className="input-box">
                        <input type="tel" id="phoneNumber" placeholder="Enter your phone number" pattern="(06|05|07)[0-9]{8}" value={phoneNumber} onChange={handlePhoneNumberChange} required />
                    </div>
                    <div className="input-box">
                        <input type="number" id="age" placeholder="Enter your age" value={age} onChange={handleAgeChange} required />
                    </div>
                    <div className="input-box">
                        <select id="user-type" value={userType} onChange={handleUserTypeChange} required>
                            <option value="" disabled style={{ display: 'none' }} hidden>Your Type</option>
                            <option value="sick">Sick</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>

                    {userType === 'doctor' && (
                        <>
                            <div className="input-box">
                                <select id="specialization-type" value={specializationType} onChange={handleSpecializationTypeChange} required>
                                    <option value="" disabled hidden>Select Doctor Type</option>
                                    <option value="general">General</option>
                                    <option value="specialist">Specialist</option>
                                </select>
                            </div>
                            {specializationType === 'general' && (
                                <div className="input-box">
                                    <select id="general-specialization" value={specialization} onChange={handleSpecializationChange} required>
                                        <option value="" disabled hidden>Select Field of Interest</option>
                                        {generalSpecialties.map((spec) => (
                                            <option key={spec} value={spec}>{spec}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {specializationType === 'specialist' && (
                                <div className="input-box">
                                    <select id="specialist-specialization" value={specialization} onChange={handleSpecializationChange} required>
                                        <option value="" disabled>Select Specialist Specialization</option>
                                        {specialistSpecialties.map((spec) => (
                                            <option key={spec} value={spec}>{spec}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {specializationType === 'specialist' && specialization && (
                                <div className="input-box">
                                    <select id="subSpecialization" value={subSpecialization} onChange={handleSubSpecializationChange} required>
                                        <option value="" disabled hidden>Select Subspecialization</option>
                                        {subspecialties[specialization] && subspecialties[specialization].map((subSpec) => (
                                            <option key={subSpec} value={subSpec}>{subSpec}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="input-box">
                                <input type="text" id="address" placeholder="Enter your address" value={address} onChange={handleAddressChange} required />
                            </div>
                        </>
                    )}

                    {userType === 'sick' && (
                        <>
                            <div className="input-box">
                                <input type="text" id="ssn" placeholder="Enter your social insurance Number" value={ssn} onChange={handleSSNChange} required />
                            </div>
                            <div className="input-box">
                                <input type="text" id="address" placeholder="Enter your Street, City, State" value={address} onChange={handleAddressChange} required />
                            </div>
                        </>
                    )}

                    <div className="policy">
                        <input type="checkbox" required />
                        <h3>I accept all terms & conditions</h3>
                    </div>

                    <div className="input-box button">
                        <input type="submit" value="Register Now" />
                    </div>

                    <div className="err" style={{ color: messageType === 'success' ? 'green' : 'red' }}>
                        {message}
                    </div>

                    <div className="text">
                        <h3>Already have an account? <a href="/login">Login now</a></h3>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
