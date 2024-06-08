import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import Footer from '../Header-Footer/Footer';


const Index = () => {
  document.title = "Medics"; // Change the title of the web page


  const form = useRef();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !message) {
            setErrorMsg("Please fill out all required fields!");
            return;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            setErrorMsg("Email is not valid!");
            return;
        } else if (message.length < 50) {
            setErrorMsg("Message must be at least 50 characters long!");
            return;
        }

        emailjs.sendForm('service_kq1krts', 'template_k4vvg4p', form.current, 'qYdIncuJkZZg7bVPb')
            .then(
                () => {
                    setErrorMsg("Email sent successfully!");
                    
                },
                (error) => {
                    console.error('Failed to send email:', error.text);
                    setErrorMsg("Failed to send email.");
                }
            );
    };

  return (
    <div>
      <section className="home pd-y">
            <div className="container">
                <div className="home-content">
                    <h1 className="home-title">Your Trusted Medical Partner</h1>
                    <p className="home-desc">Welcome to Medics, where we are dedicated to providing quality healthcare services to our patients. We offer a range of medical treatments and procedures, delivered by experienced doctors and healthcare professionals. Whether you need routine check-ups, specialized treatments, or expert medical advice, we are here to support your health and well-being.</p>
                    <div className="home-img">
                        <img src="../public/home.webp" alt="home image" />
                    </div>
                    <a href="" className="start-btn">BOOK NOW</a>
                </div>
            </div>
        </section>


        <section className="services pd-y">
        <div className="container">
            <div className="services-content">
                <h1 className="services-big-title">Our Medical Services</h1>
                <div className="services-item">
                    <h2 className="services-title">Primary Care</h2>
                    <p className="services-desc">Our primary care services focus on preventive care, diagnosis, and treatment of common medical conditions. We provide comprehensive healthcare for patients of all ages, ensuring their well-being and longevity.</p>
                </div>
                <div className="services-item">
                    <h2 className="services-title">Specialized Treatments</h2>
                    <p className="services-desc">We offer specialized treatments for various medical conditions, including cardiology, orthopedics, neurology, and more. Our expert team of specialists delivers personalized care to meet each patient's unique needs.</p>
                </div>
                <div className="services-item">
                    <h2 className="services-title">Health Education</h2>
                    <p className="services-desc">Our health education programs empower patients with knowledge and skills to manage their health effectively. From nutrition guidance to disease prevention strategies, we promote healthy lifestyles and disease awareness.</p>
                </div>
                <div className="services-item">
                    <h2 className="services-title">Telemedicine</h2>
                    <p className="services-desc">Our telemedicine services enable patients to access medical care remotely, from the comfort of their homes. Through virtual consultations and remote monitoring, we ensure continuity of care and convenience for our patients.</p>
                </div>
            </div>
        </div>
        </section> 

        <section className="read-more">
            <div className="container">
                <div className="read-more-content">
                    <div className="read-more-item">
                        <h2 className="read-more-title">Patient Success Stories</h2>
                        <p className="read-more-desc">Discover inspiring stories of patients who have overcome health challenges with our medical care and support. From chronic conditions to acute illnesses, our team is committed to helping patients live healthier, happier lives.</p>
                        <ul>
                            <li><i className='bx bxs-right-arrow'></i>Personalized treatment plans</li>
                            <li><i className='bx bxs-right-arrow'></i>Improved quality of life</li>
                        </ul>
                        <a href="" className="start-btn">GET STARTED</a>
                    </div>
                    <div className="read-more-item">
                        <div className="read-item-img">
                            <img src="../public/read-more-1.webp" alt="read more image" />
                        </div>
                    </div>
                    <div className="read-more-item">
                        <div className="read-item-img">
                            <img src="../public/read-more-2.webp" alt="read more image" />
                        </div>
                    </div>
                    <div className="read-more-item">
                        <h2 className="read-more-title" style={{marginLeft: "60px"}}>Improving Patient Outcomes</h2>
                        <p className="read-more-desc" style={{marginLeft: "60px"}}>Learn how our patient-centered approach and advanced medical technologies have led to improved outcomes for individuals facing various health challenges. From innovative treatments to compassionate care, we are dedicated to achieving the best possible results for our patients.</p>
                        <ul style={{marginLeft: "60px"}}>
                            <li><i className='bx bxs-right-arrow'></i>Advanced medical technologies</li>
                            <li><i className='bx bxs-right-arrow'></i>Compassionate patient care</li>
                        </ul>
                        <a href="" className="start-btn" style={{marginLeft: "60px"}}>GET STARTED</a>
                    </div>
                </div>
            </div>
        </section> 

        <section className="send-msg pd-y">
            <div className="container">
                <div className="send-msg-content">
                    <div className="send-msg-item">
                        <div className="send-msg-map">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5991.031199746522!2d6.890710708857448!3d36.849210271720665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f1c5da7d76cbbf%3A0x9f270fb24da2df34!2sUniversity%2020%20August%201955!5e0!3m2!1sen!2sfr!4v1717591632311!5m2!1sen!2sfr" width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
                        </div>
                    </div>
                    <div className="send-msg-item">
                        <h4 className="send-msg-title">Ready to Schedule an Appointment?</h4>
                        <p className="send-msg-desc">Please feel free to call us or fill out the form below to request an appointment. Our team will get back to you as soon as possible to confirm your appointment.</p>
                        <form onSubmit={handleSubmit} id="myForm" className="myform" ref={form} noValidate>
                            <input type="text" placeholder="Name" name='user_name' value={name} onChange={(e) => setName(e.target.value)} required />
                            <input type="email" placeholder="Email*" name='user_email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <textarea placeholder="Message*" name='message' value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                            <input type="submit" value="Send" />
                            <div className="send-msg-err" id="errorMsg">{errorMsg}</div>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <Footer />
    </div>
  );
};

export default Index;