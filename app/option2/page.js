'use client'; // Mark this component as a Client Component

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import CashDepositSlip with SSR disabled
const CashDepositSlip = dynamic(() => import('../components/cashDeposit'), { ssr: false });

const CashDepositSlipPage = () => {
    return (
        <div>
            <CashDepositSlip />
        </div>
    );
};

export default CashDepositSlipPage;