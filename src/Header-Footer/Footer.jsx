import React from 'react';
import "../css/style.css"
const Footer = () => {
  return (
    <footer className="pd-y">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-item">
                        <h2 className="footer-title">Medics</h2>
                        <ul>
                            <li><a href="#"><i className='bx bxl-facebook-circle' style={{color: '#212121', transition: 'color 0.5s'}} onMouseOver={(e) => e.currentTarget.style.color = '#1877F2'} onMouseOut={(e) => e.currentTarget.style.color = '#212121'}></i></a></li>
                            <li><a href="#"><i className='bx bxl-twitter' style={{color: '#212121', transition: 'color 0.5s'}} onMouseOver={(e) => e.currentTarget.style.color = '#1DA1F2'} onMouseOut={(e) => e.currentTarget.style.color = '#212121'}></i></a></li>
                            <li><a href="#"><i className='bx bxl-youtube' style={{color: '#212121', transition: 'color 0.5s'}} onMouseOver={(e) => e.currentTarget.style.color = '#FF0000'} onMouseOut={(e) => e.currentTarget.style.color = '#212121'}></i></a></li>
                        </ul>
                    </div>

                    <div className="footer-item">
                        <h6 className="footer-item-title">Services</h6>
                        <p className="footer-item-links"><a href="#">How it works</a></p>
                        <p className="footer-item-links"><a href="#">Primary Care</a></p>
                        <p className="footer-item-links"><a href="#">Specialist Care</a></p>
                        <p className="footer-item-links"><a href="#">Emergency Services</a></p>
                        <p className="footer-item-links"><a href="#">Medical Research</a></p>
                        <p className="footer-item-links"><a href="#">Telemedicine</a></p>
                    </div>

                    <div className="footer-item">
                        <h6 className="footer-item-title">About</h6>
                        <p className="footer-item-links"><a href="#">Our Mission</a></p>
                        <p className="footer-item-links"><a href="#">Our Story</a></p>
                        <p className="footer-item-links"><a href="#">Meet the Team</a></p>
                        <p className="footer-item-links"><a href="#">Plans & Pricing</a></p>
                        <p className="footer-item-links"><a href="#">Careers</a></p>
                        <p className="footer-item-links"><a href="#">Live Chat</a></p>
                    </div>

                    <div className="footer-item">
                        <h6 className="footer-item-title">We accept all major credit cards for fast and easy payment.</h6>
                        <p className="footer-item-links">hello@medics-team.com</p>
                        <p className="footer-item-links" style={{margin: '10px 0'}}>25 Rue El-hadaïk, Skikda.</p>
                        <p className="footer-item-links">+213-795-24-13-82.</p>
                        <img src="../public/cards.webp" alt="cards" style={{display: 'block', marginTop: '10px'}} />
                    </div>
                </div>
            </div>
        </footer>
  );
};

export default Footer;