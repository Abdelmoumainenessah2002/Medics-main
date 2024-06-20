import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../../database';
import '../../css/general.css';
import '../../css/home/home.css';

const SicksManage = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [sickPatients, setSickPatients] = useState([]);
  const [acceptedSickPatients, setAcceptedSickPatients] = useState([]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData && userData.uid) {
        const doctorDocRef = doc(db, 'doctors', userData.uid);
        const doctorDocSnap = await getDoc(doctorDocRef);

        if (doctorDocSnap.exists()) {
          const doctorData = doctorDocSnap.data();
          setDoctorData(doctorData);
          fetchSickPatients(doctorData.ReservationSicks);
          fetchAcceptedSickPatients(doctorData.AcceptedSicks || []); // Ensuring it's an empty array if not present
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No UID provided!');
      }
    };

    const fetchSickPatients = async (sickUids) => {
      const sickDataPromises = sickUids.map(async (uid) => {
        const sickDocRef = doc(db, 'sicks', uid);
        const sickDocSnap = await getDoc(sickDocRef);
        return sickDocSnap.exists() ? { uid: sickDocSnap.id, ...sickDocSnap.data() } : null;
      });

      const sickData = await Promise.all(sickDataPromises);
      setSickPatients(sickData.filter(sick => sick !== null));
    };

    const fetchAcceptedSickPatients = async (sickUids) => {
      const sickDataPromises = sickUids.map(async (uid) => {
        const sickDocRef = doc(db, 'sicks', uid);
        const sickDocSnap = await getDoc(sickDocRef);
        return sickDocSnap.exists() ? { uid: sickDocSnap.id, ...sickDocSnap.data() } : null;
      });

      const sickData = await Promise.all(sickDataPromises);
      setAcceptedSickPatients(sickData.filter(sick => sick !== null));
    };

    fetchDoctorData();
  }, []);

  const handleAccept = async (sick) => {
    if (!doctorData) return;

    const userData = JSON.parse(localStorage.getItem('userData'));
    const doctorDocRef = doc(db, 'doctors', userData.uid);

    // Update Firestore
    await updateDoc(doctorDocRef, {
      ReservationSicks: arrayRemove(sick.uid),
      AcceptedSicks: arrayUnion(sick.uid),
    });

    // Update local state
    setSickPatients(sickPatients.filter(patient => patient.uid !== sick.uid));
    setAcceptedSickPatients([...acceptedSickPatients, sick]);

    // Open email client
    const emailBody = `Dear ${sick.name},\n\nYour appointment has been accepted by Dr. ${doctorData.name}.\n\nBest regards,\nDr. ${doctorData.name}`;
    window.location.href = `mailto:${sick.email}?subject=Appointment Accepted&body=${encodeURIComponent(emailBody)}`;
  };

  const handleDecline = async (sick) => {
    if (!doctorData) return;

    const userData = JSON.parse(localStorage.getItem('userData'));
    const doctorDocRef = doc(db, 'doctors', userData.uid);

    // Update Firestore
    await updateDoc(doctorDocRef, {
      ReservationSicks: arrayRemove(sick.uid),
    });

    // Update local state
    setSickPatients(sickPatients.filter(patient => patient.uid !== sick.uid));

    // Open email client
    const emailBody = `Dear ${sick.name},\n\nWe regret to inform you that your appointment request has been declined by Dr. ${doctorData.name}.\n\nBest regards,\nDr. ${doctorData.name}`;
    window.location.href = `mailto:${sick.email}?subject=Appointment Declined&body=${encodeURIComponent(emailBody)}`;
  };

  const handleDone = async (sick) => {
    if (!doctorData) return;

    const userData = JSON.parse(localStorage.getItem('userData'));
    const doctorDocRef = doc(db, 'doctors', userData.uid);

    // Fetch current numberOfPatients and increment by 1
    const doctorDocSnap = await getDoc(doctorDocRef);
    if (doctorDocSnap.exists()) {
      const currentNumberOfPatients = doctorDocSnap.data().numberOfPatients || 0;
      const newNumberOfPatients = currentNumberOfPatients + 1;

      // Update Firestore
      await updateDoc(doctorDocRef, {
        AcceptedSicks: arrayRemove(sick.uid), 
        numberOfPatients: newNumberOfPatients,
      });

      // Update local state
      setAcceptedSickPatients(acceptedSickPatients.filter(patient => patient.uid !== sick.uid));

      const updatedDoctorData = { ...doctorData, numberOfPatients: newNumberOfPatients };
      localStorage.setItem('userData', JSON.stringify(updatedDoctorData));
    }
  };

  const handleCancel = async (sick) => {
    if (!doctorData) return;

    const userData = JSON.parse(localStorage.getItem('userData'));
    const doctorDocRef = doc(db, 'doctors', userData.uid);

    // Update Firestore
    await updateDoc(doctorDocRef, {
      AcceptedSicks: arrayRemove(sick.uid),
    });

    // Update local state
    setAcceptedSickPatients(acceptedSickPatients.filter(patient => patient.uid !== sick.uid));

    
  };

  return (
    <div className='pd-y' style={{position: 'relative', background: '#2270e2'}}>
      <section className="sicks-manage">
        <div className="container">
          <div className="sicks-manage-content">
            <h3 className="sicks-manage-title">Manage Sicks Reservations</h3>
            <p className='sicks-manage-desc'>
              Explore patients who have booked an appointment with you, where you can either accept or decline
            </p>
            {sickPatients.map((sick, index) => (
              <div key={index} className="sicks-manage-item">
                <div className="sicks-manage-item-img">
                  <img src={sick.photoProfileUrl} alt="sick" />
                </div>
                <div className="sicks-manage-item-infos">
                  <a href={`/sick-profile/${sick.uid}`} className="sicks-manage-item-title">
                    <b>Sick Name:</b> {sick.name}
                  </a>
                  <p className="sicks-manage-item-address">
                    <b>Sick Address:</b> {sick.address}
                  </p>
                  <button className="start-btn accept-btn" onClick={() => handleAccept(sick)}>Accept</button>
                  <button className="start-btn decline-btn" onClick={() => handleDecline(sick)}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="accepted-sicks">
        <div className="container">
          <div className="accepted-sicks-content">
            <h3 className="accepted-sicks-title">Accepted Sicks Reservations</h3>
            <p className='accepted-sicks-desc'>
              These are the patients whose appointments you have accepted.
            </p>
            {acceptedSickPatients.map((sick, index) => (
              <div key={index} className="sicks-manage-item">
                <div className="sicks-manage-item-img">
                  <img src={sick.photoProfileUrl} alt="sick" />
                </div>
                <div className="sicks-manage-item-infos">
                  <a href={`/sick-profile/${sick.uid}`} className="sicks-manage-item-title">
                    <b>Sick Name:</b> {sick.name}
                  </a>
                  <p className="sicks-manage-item-address">
                    <b>Sick Address:</b> {sick.address}
                  </p>
                  <button className="start-btn done-btn" onClick={() => handleDone(sick)}>Done</button>
                  <button className="start-btn cancel-btn" onClick={() => handleCancel(sick)}>Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SicksManage;
