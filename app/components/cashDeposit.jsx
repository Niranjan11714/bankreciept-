'use client'; 
import React, { useState, useEffect } from 'react';
import '../styles/cashDepositslip.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CashDepositSlip = () => {
  const [quantities, setQuantities] = useState({
    2000: 0, 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [amountInWords, setAmountInWords] = useState('');
  
  const [accountNumber, setAccountNumber] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  
  // Set current date
  const [currentDate, setCurrentDate] = useState('');
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
  }, []);

  // Fetch user details based on account number
  const fetchUserDetails = async () => {
    if (!accountNumber) return;

    try {
      const response = await fetch(`http://localhost:5000/api/accounts/${accountNumber}`); // Your API endpoint
      const data = await response.json();
      
      if (response.ok && data.length > 0) {
        setUserDetails(data[0]); // Assuming data is an array and we want the first item
      } else {
        console.error('User not found or error fetching data:', data);
        setUserDetails(null); // Reset user details on error
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserDetails(null); // Reset user details on error
    }
  };

  // Function to handle quantity change
  const handleQuantityChange = (denomination, event) => {
    const newQuantities = { ...quantities, [denomination]: parseInt(event.target.value) || 0 };
    setQuantities(newQuantities);
    calculateTotalAmount(newQuantities);
  };

  // Function to calculate total amount
  const calculateTotalAmount = (newQuantities) => {
    let total = Object.keys(newQuantities).reduce((acc, denomination) => {
      return acc + denomination * newQuantities[denomination];
    }, 0);
    setTotalAmount(total);
    convertAmountToWords(total);
  };

  // Function to convert amount to words
  const convertAmountToWords = (amount) => {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

    if (amount === 0) return 'Zero';

    let word = '';
    let num = amount.toString();
    let digitGroups = [];
    
    while (num.length > 3) {
      digitGroups.unshift(num.slice(-3));
      num = num.slice(0, -3);
    }
    
    digitGroups.unshift(num);

    digitGroups.forEach((group, i) => {
      let groupValue = parseInt(group);
      if (groupValue === 0) return;
      let groupWord = '';

      if (groupValue > 99) {
        groupWord += units[Math.floor(groupValue / 100)] + ' Hundred ';
        groupValue %= 100;
      }

      if (groupValue > 10 && groupValue < 20) {
        groupWord += teens[groupValue - 11] + ' ';
      } else {
        groupWord += tens[Math.floor(groupValue / 10)] + ' ';
        groupWord += units[groupValue % 10] + ' ';
      }

      word += groupWord.trim() + ' ' + thousands[digitGroups.length - i - 1] + ' ';
    });

    setAmountInWords(word.trim() + ' Rupees Only');
  };

  // Function to handle form submission for PDF generation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Select the element to capture
    const input = document.getElementById('currency-slip'); 
    
    // Use html2canvas to take a snapshot of the form
    const canvas = await html2canvas(input, { scale: 2 });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4'); 
    
    // Calculate dimensions to fit the image into the PDF
    const imgWidth = 595.28; 
    const pageHeight = 841.89; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width; 
    let heightLeft = imgHeight;
    
    let position = 0;
    
    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // If the image is longer than a page, add more pages
    while (heightLeft >= 0) {
        position = heightLeft - imgHeight; 
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }
    
    // Trigger download
    pdf.save('cash_deposit_slip.pdf');
  };

  return (
    <div>
      {/* Account Number Input Above the Form */}
      <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'}} 
                className="fetch-input">
        <input
          style={{
            width: '250px',
            padding: '10px 15px',
            fontSize: '16px',
            border: '1px solid #000',
            borderRadius: '5px',
            marginTop: '10px',
            marginLeft: '8px',
            outline: 'none',
            transition: 'all 0.3s ease-in-out',
            boxShadow: '0 0 10px rgba(52, 152, 219, 0.1)',
            backgroundColor: '#fff',
            color: '#000',
            textAlign: 'center',
            ':focus': {
                borderColor: '#000',
                boxShadow: '0 0 15px rgba(52, 152, 219, 0.3)',
            },
            '::placeholder': {
                color: '#95a5a6',
            },
          }}
          type="text"
          placeholder="Enter Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <button style={{
                        backgroundColor: '#fff',
                        color: '#000',
                        padding: '5px 25px',
                        fontSize: '12px',
                        border: '1px solid #000',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '20px',
                        transition: 'all 0.3s ease',
                        display: 'block',
                        margin: '20px auto',
                        width: '180px',
                        boxShadow: '0 4px 6px rgba(46, 204, 113, 0.3)',
                        textTransform: 'uppercase',
                        position: 'relative',
                        overflow: 'hidden'
                    }} 
                    type="button" onClick={fetchUserDetails}>Fetch Details</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="slip-container" id="currency-slip">
          {/* Left side */}
          <div className="slip-section">
            <table>
              <tbody>
                <tr>
                  <td colSpan="2" className="center-align bold">
                    भारतीय स्टेट बैंक<br />State Bank of India
                  </td>
                </tr>
                <tr>
                  <td>जमा पर्ची Pay in Slip</td>
                  <td>रोकड़<br />Cash</td>
                </tr>
                <tr>
                  <td>शाखा Branch</td>
                  <td><input type="text" name="branch" value={userDetails ? userDetails.branch : ''} readOnly required /></td>
                </tr>
                <tr>
                  <td>खाता क्र A/C No.</td>
                  <td><input type="text" name="account_number" value={accountNumber} readOnly required /></td>
                </tr>
                <tr>
                  <td>दिनांक Date</td>
                  <td><input type="date" name="date" value={currentDate} readOnly required /></td>
                </tr>
                <tr>
                  <td>मोबाइल नंबर Mobile No.</td>
                  <td><input type="text" name="mobile_number" value={userDetails ? userDetails.mobileNumber : ''} readOnly required /></td>
                </tr>
              </tbody>
            </table>

            {/* Amount in Words */}
            <p>₹ शब्दों में<br />In Words:</p>
            <p><input type="text" id="amount_in_words" value={amountInWords} readOnly /></p>

            {/* Total Amount */}
            <table>
              <tbody>
                <tr>
                  <td>Total Amount ₹</td>
                  <td><input type="number" value={totalAmount} readOnly /></td>
                </tr>
              </tbody>
            </table>

          </div>

          {/* Right side */}
          <div className="slip-section">
            <table>
              <tbody>
                <tr>
                  <td colSpan="2" className="center-align bold">
                    भारतीय स्टेट बैंक<br />State Bank of India
                  </td>
                </tr>
                <tr>
                  <td>खाता क्र A/C No.</td>
                  {/* Displaying same account number for consistency */}
                  <td><input type="text" name="account_number_right" value={accountNumber} readOnly required /></td> 
                </tr>
                <tr>
                  <td>दिनांक Date</td>
                  {/* Same date for consistency */}
                  <td><input type="date" name="date_right" value={currentDate} readOnly required /></td> 
                </tr>
              </tbody>
            </table>

            {/* Denomination Table */}
            <table className="denomination-table">
              <thead>
                <tr>
                  <th>Cash Denomination</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {[2000, 500, 200, 100, 50, 20, 10, 5, 2, 1].map(denomination => (
                  <tr key={denomination}>
                    <td>x {denomination}</td>
                    <td><input 
                        type="number"
                        value={quantities[denomination]}
                        min="0"
                        onChange={(e) => handleQuantityChange(denomination, e)} 
                      />
                    </td>
                    {/* Read-only amount calculation */}
                    <td><input type="number" value={denomination * quantities[denomination]} readOnly /></td> 
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit Button */}
        
        <button 
        style={{
          backgroundColor: '#0066cc',
          color: 'white',
          padding: '10px 20px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
          transition: 'background-color 0.3s ease',
          display: 'block',
          margin: '20px auto',
          width: '175px'
      }}
         type="submit">Generate PDF</button> 
      </form> 
    </div>
  );
};

export default CashDepositSlip;
