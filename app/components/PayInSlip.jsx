// app/components/PayInSlip.js
'use client'; // Add this line to mark the component as a Client Component

import React from 'react';
import '../styles/options.css'; // Optional: For styling

const PayInSlip = () => { // Changed to uppercase
    return (
        <div className="container">
            <h1 style={{marginBottom: '10px'}}>SBI Bank Services</h1>
            <div style={{marginBottom: '10px'}} className="options">
                <div className="option" onClick={() => window.location.href='/option1'}>
                    <h2>Cash Deposit</h2>
                    <p>Deposit cash into your account</p>
                </div>
                <div className="option" onClick={() => window.location.href='/option2'}>
                    <h2>Fund Transfer</h2>
                    <p>Transfer funds to other accounts</p>
                </div>
            </div>
            <footer>
                &copy; 2024 SBI Bank. All rights reserved.
            </footer>
        </div>
    );
};

export default PayInSlip; // Exporting with uppercase