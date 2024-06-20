import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../database';
import '../../css/general.css';
import '../../css/home/home.css';
import Footer from '../../Header-Footer/Footer';

const SickProfile = () => {
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState('');



  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData) {
      setUserData(storedUserData);
      setProfileImage(storedUserData.photoProfileUrl);
      document.title = "Medics || " + storedUserData.name + "'s Profile";
    }
  }, []);

  const uploadImage = async (file) => {
    const types = ["image/jpeg", "image/png", "image/svg+xml"];

    if (!file) {
      alert("No file selected!");
      return;
    }

    if (types.indexOf(file.type) === -1) {
      alert("Type not supported!");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("The file size is too large!");
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const photoProfileUrl = reader.result;
      setProfileImage(photoProfileUrl);

      if (userData) {
        const updatedUserData = { ...userData, photoProfileUrl };
        setUserData(updatedUserData);
        localStorage.setItem('userData', JSON.stringify(updatedUserData));

        try {
          const docRef = doc(db, "sicks", userData.uid); // Corrected collection name
          await updateDoc(docRef, {
            photoProfileUrl
          });
          alert("Photo URL updated successfully!");
        } catch (error) {
          console.error("Error updating photo URL in Firestore:", error);
        }
      }
    };

    reader.onerror = () => {
      alert("Error reading the file!");
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    uploadImage(file);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <section className="profile-info">
        <div className="container">
          <div className="profile-info-content">
            <h1 className="profile-info-title"><b>{userData.name}'s Profile</b></h1>
            <div className="profile-info-item" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <div className="profile-img-desc" style={{ marginTop: '95px' }}>
                <img src={profileImage} alt="profile" />
              </div>
              <label htmlFor="input-file" className="changePhotoProfile">Update Image</label>
              <input type="file" accept="image/jpeg, image/png, image/jpg" className="" id="input-file" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
            <div className="profile-info-item infos">
              <p className="profile-info-infos uid"><b>Your ID:</b> {userData.uid}</p>
              <p className="profile-info-infos name"><b>Your Name:</b> {userData.name}</p>
              <p className="profile-info-infos email"><b>Your Email:</b> {userData.email}</p>
              <p className="profile-info-infos phoneNumber"><b>Phone Number:</b> {userData.phoneNumber}</p>
              <p className="profile-info-infos ssn"><b>SSN:</b> {userData.ssn}</p>
              <p className="profile-info-infos age"><b>Your Age:</b> {userData.age}</p>
              <p className="profile-info-infos address"><b>Address:</b> {userData.address}</p>
              <div className="err">{error}</div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SickProfile;