// app/option1/page.js
'use client'; // Mark this component as a Client Component

import React from 'react';
import dynamic from 'next/dynamic';
import CurrencySlip from '../components/CurrencySlip';

// Dynamically import CashDepositSlip with SSR disabled
const CashDepositSlip = dynamic(() => import('../components/CurrencySlip'), { ssr: false });

const CashDepositSlipPage = () => {
    return (
        <div>
            <CurrencySlip />
        </div>
    );
};

export default CashDepositSlipPage;