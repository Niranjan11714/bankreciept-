'use client'; // Mark this component as a Client Component

import React, { useState, useEffect } from 'react';
import '../styles/option1.css'; // Assuming you save the CSS in this file
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CurrencySlip = () => {
    // New state for JSON input and fetched data
    const [jsonInput, setJsonInput] = useState('');
    const [fetchedData, setFetchedData] = useState(null);

    // State for form fields
    const [branch, setBranch] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [dateLeft, setDateLeft] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [cashChequeDetails, setCashChequeDetails] = useState('');
    const [amount, setAmount] = useState(0);
    const [amountInWords, setAmountInWords] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [accountNumberRight, setAccountNumberRight] = useState('');
    const [dateRight, setDateRight] = useState('');
    const [drawnOnBranch, setDrawnOnBranch] = useState('');
    const [chequeNo, setChequeNo] = useState('');
    const [chequeAmount, setChequeAmount] = useState(0);

    // Denominations state
    const denominations = [
        { value: 2000 },
        { value: 500 },
        { value: 200 },
        { value: 100 },
        { value: 50 },
        { value: 20 },
        { value: 10 },
        { value: 5 },
        { value: 2 },
        { value: 1 }
    ];

    // State to hold quantities for each denomination
    const [denominationQuantities, setDenominationQuantities] = useState(
        denominations.reduce((acc, denom) => {
            acc[denom.value] = 0;
            return acc;
        }, {})
    );

    // State to hold amounts for each denomination
    const [denominationAmounts, setDenominationAmounts] = useState({});

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setDateLeft(today);
        setDateRight(today);
    }, []);

    const handleDenominationChange = (value, qty) => {
        qty = parseInt(qty) || 0; // Ensure quantity is a number
        setDenominationQuantities(prev => ({ ...prev, [value]: qty }));
        
        const amount = value * qty;
        setDenominationAmounts(prev => ({ ...prev, [`amount_${value}`]: amount }));
        
        calculateTotalAmount();
    };

    const calculateTotalAmount = () => {
        const total = Object.values(denominationAmounts).reduce((acc, val) => acc + (val || 0), 0);
        setTotalAmount(total);
        convertAmountToWords(total);
    };

    const convertAmountToWords = (amount) => {
        if (amount === 0) return 'Zero Rupees';
        
        // Logic to convert number to words goes here...
        
        // Example placeholder for the final word representation
        setAmountInWords('Converted Amount in Words'); 
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Select the element to capture
    const input = document.getElementById('currency-slip'); // Ensure this ID matches your container's ID

    // Use html2canvas to take a snapshot of the form
    const canvas = await html2canvas(input, {
        scale: 2, // Adjust scale for higher resolution
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4'); // Create PDF in portrait mode

    // Calculate dimensions to fit the image into the PDF
    const imgWidth = 595.28; // A4 width in points
    const pageHeight = 841.89; // A4 height in points
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height to maintain aspect ratio
    let heightLeft = imgHeight;

    let position = 0;

    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // If the image is longer than a page, add more pages
    while (heightLeft >= 0) {
        position = heightLeft - imgHeight; // Set the position for the new page
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    // Trigger download
    pdf.save('currency_slip.pdf');
};


    const handleFetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/accounts/${jsonInput}`);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            
            if (data.length > 0) {
                setFetchedData(data[0]); // Set the fetched data
                setBranch(data[0].branch);
                setAccountNumber(data[0].accountNumber);
                setMobileNumber(data[0].mobileNumber);
            } else {
                alert('No account found with the provided account number.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please check the console.');
        }
    };

    return (
        <div>
            <div className="fetch-input">
                <input
                    type="text"
                    placeholder="Enter Account Number"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                />
                <button onClick={handleFetchData}>Fetch Data</button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="slip-container" id="currency-slip"> {/* Added ID here */}
                    {/* Left Side */}
                    <div className="slip-section">
                        <div className="header">भारतीय स्टेट बैंक<br />State Bank of India</div>
                        <table>
                            <tbody>
                                <tr>
                                    <td>जमा पर्ची Pay in Slip</td>
                                    <td>अंतरण<br />Transfer</td>
                                </tr>
                                <tr>
                                    <td>शाखा Branch</td>
                                    <td><input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} required /></td>
                                </tr>
                                <tr>
                                    <td>खाता क्र A/C No.</td>
                                    <td><input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required /></td>
                                </tr>
                                <tr>
                                    <td>दिनांक Date</td>
                                    <td><input type="date" value={dateLeft} onChange={(e) => setDateLeft(e.target.value)} required /></td>
                                </tr>
                                <tr>
                                    <td>मोबाइल नंबर Mobile No.</td>
                                    <td><input type="number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required /></td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Cash/Cheque Details */}
                        <p>के खाते में जमा के लिए<br />For the credit of the account of 0</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td>रोकड़/चैक का विवरण<br />Details of Cash Cheque</td>
                                    <td>राशि<br />Amount ₹</td>
                                </tr>
                                <tr>
                                    <td><input type="text" value={cashChequeDetails} onChange={(e) => setCashChequeDetails(e.target.value)} required /></td>
                                    <td><input type="number" step="0.01" value={amount} onChange={(e) => {setAmount(e.target.value); convertAmountToWords(e.target.value);}} required /></td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Amount in Words */}
                        <p>₹ शब्दों में<br />In Words:</p>
                        <p><input type="text" value={amountInWords} readOnly required /></p>

                        {/* Total Amount */}
                        <table>
                            <tbody>
                                <tr>
                                    <td>कुल<br />Total ₹<input type="number" step="0.01" value={totalAmount} readOnly /></td>
                                </tr>
                            </tbody>
                        </table>

                    </div>

                    {/* Right Side */}
                    <div className="slip-section">
                        {/* Header */}
                        <div className="header">भारतीय स्टेट बैंक<br />State Bank of India</div>

                        {/* Account Number and Date */}
                        <table>
                            <tbody>
                                <tr>
                                    <td>जमा पर्ची Pay in Slip</td>
                                    <td>अंतरण<br />Transfer</td>
                                </tr>
                                <tr>
                                    <td>खाता क्र A/C No.</td>
                                    <td><input type="text" value={accountNumberRight} onChange={(e) => setAccountNumberRight(e.target.value)} required /></td>
                                </tr>
                                <tr>
                                    <td>दिनांक Date</td>
                                    <td><input type="date" value={dateRight} onChange={(e) => setDateRight(e.target.value)} required /></td>
                                </tr>
                            </tbody>
                        </table>

                        {/* For the credit of account */}
                        <p>के खाते में जमा के लिए<br />For the credit of the account of 0</p>

                        {/* Drawn on Branch and Cheque Details */}
                        <table className="cash-details">
                            <tbody>
                                <tr className="small-text">
                                    <td>अदाकर्ता शाखा<br />Drawn on Branch</td>
                                    <td>चैक क्र<br />Cheque No.</td>
                                    <td>राशि<br />Amount ₹</td></tr>

                                {/* Input Fields for Drawn Branch and Cheque Details */}
                                <tr className="small-text">
                                    <td><input type="text" value={drawnOnBranch} onChange={(e) => setDrawnOnBranch(e.target.value)} required /></td>
                                    <td><input type="text" value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} required /></td>
                                    <td><input type="number" step="0.01" value={chequeAmount} onChange={(e) => setChequeAmount(e.target.value)} required /></td></tr></tbody></table>

                        {/* Denominations Table */}
                        {denominations.map(({ value }) => (
                            <div key={value} className="denomination-row">
                                {value} x 
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Qty"
                                    onChange={(e) => handleDenominationChange(value, e.target.value)}
                                />
                                &nbsp;
                                {denominationAmounts[`amount_${value}`] || 0}
                            </div>
                        ))}

                        {/* Submit Button */}
                        <button type="submit">Submit</button>
                    </div>
                </div>

                {/* Denominations Table Footer */}
                {/* You can add additional functionality or buttons here */}
            </form>
        </div>
    );
};

export default CurrencySlip;
