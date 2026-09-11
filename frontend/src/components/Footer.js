import React from 'react';

export default function Footer() {
  return (
    <footer className="edumarket-footer">
      <div className="footer-grid-container">
        <div>
          <h4 className="footer-col-title">About</h4>
          <ul className="footer-links-list">
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>
        <div>
          <h4 className="footer-col-title">Group Companies</h4>
          <ul className="footer-links-list">
            <li>EduLearn Academy</li>
            <li>SkillPulse Tech</li>
            <li>CodeCraft Studio</li>
          </ul>
        </div>
        <div>
          <h4 className="footer-col-title">Help</h4>
          <ul className="footer-links-list">
            <li>Payments</li>
            <li>Shipping</li>
            <li>Cancellation & Returns</li>
          </ul>
        </div>
        <div>
          <h4 className="footer-col-title">Policy</h4>
          <ul className="footer-links-list">
            <li>Return Policy</li>
            <li>Terms of Use</li>
            <li>Security</li>
            <li>Privacy</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom-bar">
        <p>© 2026 EduMarket Learning Platform. All Rights Reserved.</p>
        <p>Designed for Professional Growth & Excellence</p>
      </div>
    </footer>
  );
}