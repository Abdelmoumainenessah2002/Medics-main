import React, { useState, useEffect } from 'react';
import { auth, db } from '../../database'; 
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Footer from '../../Header-Footer/Footer';
import 'boxicons';

const SearchForDoctor = () => {
  const [searchType, setSearchType] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSubSpecialty, setSelectedSubSpecialty] = useState('');
  const [subSpecialties, setSubSpecialties] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [generalDoctors, setGeneralDoctors] = useState([]);
  const [specialistDoctors, setSpecialistDoctors] = useState([]);
  const [subSpecialistDoctors, setSubSpecialistDoctors] = useState([]);
  const [reservedDoctors, setReservedDoctors] = useState([]);
  const userUID = JSON.parse(localStorage.getItem('userData')).uid;

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

useEffect(() => {
  if (selectedSpecialty) {
    setSubSpecialties(subspecialties[selectedSpecialty] || []);
  }
}, [selectedSpecialty]);

useEffect(() => {
  const fetchReservations = async () => {
    const doctorsRef = collection(db, 'doctors');
    const querySnapshot = await getDocs(doctorsRef);
    const reservations = {};
    querySnapshot.forEach(doc => {
      reservations[doc.id] = doc.data().ReservationSicks || [];
    });
    setReservedDoctors(reservations);
  };

  fetchReservations();
}, []);

const handleSearchTypeChange = (e) => {
  setSearchType(e.target.value);
};

const handleSpecialtyChange = (e) => {
  setSelectedSpecialty(e.target.value);
  setSelectedSubSpecialty(''); // Reset subSpecialty when specialty changes
};

const handleSubSpecialtyChange = (e) => {
  setSelectedSubSpecialty(e.target.value);
};

const handleNameChange = (e) => {
  setDoctorName(e.target.value);
};

const handleSearch = async () => {
  const doctorsRef = collection(db, 'doctors');
  let q;

  if (searchType === 'name' && doctorName) {
    q = query(doctorsRef, where('name', '==', doctorName));
  } else if (searchType === 'specialization' && selectedSpecialty) {
    q = query(doctorsRef, where('specialization', '==', selectedSpecialty));
  }

  if (q) {
    const querySnapshot = await getDocs(q);
    const doctorList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const generals = [];
    const specialists = [];
    const subSpecialists = [];

    doctorList.forEach(doctor => {
      if (doctor.specializationType === 'general') {
        generals.push(doctor);
      } else if (doctor.specializationType === 'specialist') {
        if (doctor.subSpecialization === selectedSubSpecialty) {
          subSpecialists.push(doctor);
        } else {
          specialists.push(doctor);
        }
      }
    });

    setGeneralDoctors(generals);
    setSpecialistDoctors(specialists);
    setSubSpecialistDoctors(subSpecialists);
  }
};

const handleBookAppointment = async (doctorId) => {
  const doctorRef = doc(db, 'doctors', doctorId);
  await updateDoc(doctorRef, {
    ReservationSicks: arrayUnion(userUID)
  });
  setReservedDoctors(prev => ({
    ...prev,
    [doctorId]: [...(prev[doctorId] || []), userUID]
  }));
};

const hasUserReserved = (doctor) => {
  return reservedDoctors[doctor.id]?.includes(userUID);
};

return (
  <div>
    <section className="search" style={{ paddingTop: '11px' }}>
      <div className="search-content">
        <h1 className="search-title">View Doctors, Book an Appointment</h1>
        <p className="search-desc">Find the right doctor for you and book an appointment to maintain your health</p>
        <div className="search-input">
          <select className='type-search' value={searchType} onChange={handleSearchTypeChange}>
            <option value="" hidden>Type Of Search</option>
            <option value="name">Name</option>
            <option value="specialization">Specialization</option>
          </select>
          <div className="name-section" style={{ display: searchType === 'name' ? '' : 'none' }}>
            <input type="text" className='name-search' placeholder="Enter the name of doctor" value={doctorName} onChange={handleNameChange} />
            <i className='bx bx-search input-icon'></i>
            <button className='search-btn' onClick={handleSearch}>
              <i className='bx bx-search'></i>
            </button>
          </div>
          <div className="specialization-section" style={{ display: searchType === 'specialization' ? '' : 'none' }}>
            <select className='specialization-select' value={selectedSpecialty} onChange={handleSpecialtyChange}>
              <option value="" hidden>Specialization</option>
              {specialistSpecialties.map((specialty, index) => (
                  <option key={index} value={specialty}>{specialty}</option>
                ))}
            </select>
            <select className='sub-specialization-select' value={selectedSubSpecialty} onChange={handleSubSpecialtyChange}>
              <option value="" hidden>SubSpecialization</option>
              {subSpecialties.map((subSpecialty, index) => (
                <option key={index} value={subSpecialty}>{subSpecialty}</option>
              ))}
            </select>
            <button className='search-btn' onClick={handleSearch}>
              <i className='bx bx-search'></i>
            </button>
          </div>
        </div>
      </div>
      <div className="results-content">
        <h4 className="search-title" style={{ color: 'black', fontSize: '30px' }}>Largest Healthcare Network Across Algeria</h4>
        <p className="search-desc" style={{ color: 'black' }}>Find best doctors across specialities or names in your city.</p>
        <div className="container">
          <div className="specialization-option-results" style={{ display: generalDoctors.length > 0 || specialistDoctors.length > 0 || subSpecialistDoctors.length > 0 ? '' : 'none' }}>
            <div className="generals-doctors-content doctors-content" style={{ display: generalDoctors.length > 0 ? '' : 'none' }}>
              <h3 className="generals-big-title">General doctors interested in this field</h3>
              {generalDoctors.map((doctor, index) => (
                <div className="doctor-item" key={index}>
                  <div className="doctor-img">
                    <img src={doctor.photoProfileUrl} alt="img" />
                  </div>
                  <div className="general-doctor-info">
                    <h4 className="doctor-name">{doctor.name}</h4>
                    <p className="doctor-interested-field"><b>Interested-field:</b> {doctor.specialization}</p>
                    <p className="doctor-address"><b>Location:</b> {doctor.address}</p>
                    <button
                      className={`start-btn book-btn ${hasUserReserved(doctor) ? 'reserved' : ''}`}
                      style={{ backgroundColor: hasUserReserved(doctor) ? 'green' : '' }}
                      onClick={() => handleBookAppointment(doctor.id)}
                      disabled={hasUserReserved(doctor)}
                    >
                      {hasUserReserved(doctor) ? 'Done' : 'Book'}
                    </button>
                    <br />
                    <Link className='visit start-btn' to={`/sicks/home/visit-doctor-profile/${doctor.uid}`}>Visit profile</Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="specialist-doctors-content doctors-content" style={{ display: specialistDoctors.length > 0 ? '' : 'none', marginTop: '90px' }}>
              <h3 className="specialist-big-title">Specialist doctors do not have the same SubSpecialization</h3>
              {specialistDoctors.map((doctor, index) => (
                <div className="doctor-item" key={index}>
                  <div className="doctor-img">
                    <img src={doctor.photoProfileUrl} alt="img" />
                  </div>
                  <div className="special-doctor-info">
                    <h4 className="doctor-name">{doctor.name}</h4>
                    <p className="doctor-subspecialization"><b>SubSpecialization:</b> {doctor.subSpecialization}</p>
                    <p className="doctor-address"><b>Location:</b> {doctor.address}</p>
                    <button
                      className={`start-btn book-btn ${hasUserReserved(doctor) ? 'reserved' : ''}`}
                      style={{ backgroundColor: hasUserReserved(doctor) ? 'green' : '' }}
                      onClick={() => handleBookAppointment(doctor.id)}
                      disabled={hasUserReserved(doctor)}
                    >
                      {hasUserReserved(doctor) ? 'Done' : 'Book'}
                    </button>
                    <br />
                    <Link className='visit start-btn' to={`/sicks/home/visit-doctor-profile/${doctor.uid}`}>Visit profile</Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="specialist-doctors-content doctors-content" style={{ display: subSpecialistDoctors.length > 0 ? '' : 'none', marginTop: '90px' }}>
              <h3 className="specialist-big-title">Specialist doctors have the same SubSpecialization</h3>
              {subSpecialistDoctors.map((doctor, index) => (
                <div className="doctor-item" key={index}>
                  <div className="doctor-img">
                    <img src={doctor.photoProfileUrl} alt="img" />
                  </div>
                  <div className="special-doctor-info">
                    <h4 className="doctor-name">{doctor.name}</h4>
                    <p className="doctor-subspecialization"><b>SubSpecialization:</b> {doctor.subSpecialization}</p>
                    <p className="doctor-address"><b>Location:</b> {doctor.address}</p>
                    <button
                      className={`start-btn book-btn ${hasUserReserved(doctor) ? 'reserved' : ''}`}
                      style={{ backgroundColor: hasUserReserved(doctor) ? 'green' : '' }}
                      onClick={() => handleBookAppointment(doctor.id)}
                      disabled={hasUserReserved(doctor)}
                    >
                      {hasUserReserved(doctor) ? 'Done' : 'Book'}
                    </button>
                    <br />
                    <Link className='visit start-btn' to={`/sicks/home/visit-doctor-profile/${doctor.uid}`}>Visit profile</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);
};

export default SearchForDoctor;