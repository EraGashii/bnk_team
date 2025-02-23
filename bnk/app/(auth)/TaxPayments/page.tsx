"use client";
import React from 'react';
import TaxPaymentsForm from '../../../components/TaxPaymentsForm';


const TaxPayments = () => {
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Tax Payments</h1>
      <TaxPaymentsForm />
    </div>
  );
};

export default TaxPayments;
