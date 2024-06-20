import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../database';
import '../../css/general.css';
import '../../css/home/home.css';
import Footer from '../../Header-Footer/Footer';

const VisitDoctorProfile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [buttonText, setButtonText] = useState('Book Appointment');
  const [buttonStyle, setButtonStyle] = useState({});
  const [likeStatus, setLikeStatus] = useState(null); // null: not rated, 1: liked, 0: disliked
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  const uid = window.location.pathname.split('/').pop(); // Extract UID from URL

  useEffect(() => {
    const fetchData = async () => {
      if (uid) {
        const docRef = doc(db, 'doctors', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setDoctorData(data);

          const userData = JSON.parse(localStorage.getItem('userData'));
          const userUID = userData.uid;

          if (data.ReservationSicks?.includes(userUID)) {
            setIsBooked(true);
            setButtonText('Done');
            setButtonStyle({ backgroundColor: 'green' });
          }

          const raters = data.raters || {};
          setLikeStatus(raters[userUID]);
          setLikeCount(Object.values(raters).filter(value => value === 1).length);
          setDislikeCount(Object.values(raters).filter(value => value === 0).length);
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No UID provided!');
      }
    };

    fetchData();
  }, [uid]);

  const handleBookAppointment = async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userUID = userData.uid;

    const docRef = doc(db, 'doctors', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const doctorData = docSnap.data();
      const updatedReservationSicks = doctorData.ReservationSicks ? [...doctorData.ReservationSicks, userUID] : [userUID];

      await updateDoc(docRef, {
        ReservationSicks: updatedReservationSicks,
      });

      setIsBooked(true);
      setButtonText('Done');
      setButtonStyle({ backgroundColor: 'green' });
    }
  };

  const handleLikeOrDislike = async (isLike) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userUID = userData.uid;

    const docRef = doc(db, 'doctors', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const doctorData = docSnap.data();
      const raters = doctorData.raters || {};
      const currentStatus = raters[userUID];

      if (currentStatus !== isLike) {
        raters[userUID] = isLike ? 1 : 0;

        if (currentStatus === undefined) {
          if (isLike) {
            setLikeCount(prev => prev + 1);
          } else {
            setDislikeCount(prev => prev + 1);
          }
        } else if (currentStatus === 1) {
          setLikeCount(prev => prev - 1);
          setDislikeCount(prev => prev + 1);
        } else {
          setDislikeCount(prev => prev - 1);
          setLikeCount(prev => prev + 1);
        }

        await updateDoc(docRef, { raters });
        setLikeStatus(isLike ? 1 : 0);
      } else {
        delete raters[userUID];

        if (currentStatus === 1) {
          setLikeCount(prev => prev - 1);
        } else {
          setDislikeCount(prev => prev - 1);
        }

        await updateDoc(docRef, { raters });
        setLikeStatus(null);
      }
    }
  };

  return (
    <div>
      {doctorData ? (
        <section className="profile-info">
          <div className="container">
            <div className="profile-info-content">
              <h1 className="profile-info-title"><b>{doctorData.name}'s Profile</b></h1>
              <div className="profile-info-item" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div className="profile-img-desc" style={{ marginTop: '100px', display: 'block' }}>
                  <img src={doctorData.photoProfileUrl} alt="profile" />
                </div>
              </div>
              <div className="profile-info-item infos">
                <p className="profile-info-infos name"><b>User Name:</b> {doctorData.name}</p>
                <p className="profile-info-infos email"><b>User Email:</b> {doctorData.email}</p>
                <p className="profile-info-infos phoneNumber"><b>User Phone Number:</b> {doctorData.phoneNumber}</p>
                <p className="profile-info-infos age"><b>User Age:</b> {doctorData.age}</p>
                <p className="profile-info-infos specialization">
                  <b>{doctorData.specializationType === 'general' ? 'Field of Interest' : 'Specialization'}:</b> {doctorData.specialization}
                </p>
                {doctorData.specializationType !== 'general' && (
                  <p className="profile-info-infos subSpecialization"><b>SubSpecialization:</b> {doctorData.subSpecialization}</p>
                )}
                <div className="like-or-dislike">
                  <label htmlFor="like" style={{ display: 'inline-block' }}>Likes :</label>
                  <i
                    className='bx bxs-like'
                    style={{ display: 'inline-block', color: likeStatus === 1 ? 'green' : 'black' }}
                    id="like"
                    onClick={() => handleLikeOrDislike(true)}
                  ></i>
                  <label className="like-count" style={{ display: 'inline-block', marginLeft: '40px' }}>
                    {likeCount}
                  </label>
                </div>
                <div className="like-or-dislike">
                  <label htmlFor="dislike" style={{ display: 'inline-block' }}>DisLikes :</label>
                  <i
                    className='bx bxs-dislike'
                    style={{ display: 'inline-block', top: '4px', color: likeStatus === 0 ? 'red' : 'black' }}
                    id="dislike"
                    onClick={() => handleLikeOrDislike(false)}
                  ></i>
                  <label className="dislike-count" style={{ display: 'inline-block', marginLeft: '40px' }}>
                    {dislikeCount}
                  </label>
                </div>
                <button
                  className="book-appointment-button start-btn"
                  style={buttonStyle}
                  onClick={handleBookAppointment}
                  disabled={isBooked}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <p className='loading pd-y'>Loading...</p>
      )}
      <Footer />
    </div>
  );
};

export default VisitDoctorProfile;
