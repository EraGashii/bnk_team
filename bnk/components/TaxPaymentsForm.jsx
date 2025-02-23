"use client";
import React, { useState } from 'react';
import axios from 'axios';

const TaxPaymentsForm = () => {
  const [payment, setPayment] = useState({
    taxpayerName: '',
    taxId: '',
    amount: '',
    date: ''
  });

  const handleChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/taxpayments', payment);
      alert('Payment successful');
    } catch (error) {
      alert('Error processing payment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-md shadow-md">
      <input type="text" name="taxpayerName" placeholder="Taxpayer Name"
        className="w-full bg-gray-700 text-white p-2 rounded mb-3"
        onChange={handleChange} required />
      
      <input type="text" name="taxId" placeholder="Tax ID"
        className="w-full bg-gray-700 text-white p-2 rounded mb-3"
        onChange={handleChange} required />

      <input type="number" name="amount" placeholder="Amount"
        className="w-full bg-gray-700 text-white p-2 rounded mb-3"
        onChange={handleChange} required />

      <input type="date" name="date"
        className="w-full bg-gray-700 text-white p-2 rounded mb-3"
        onChange={handleChange} required />

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Pay Tax
      </button>
    </form>
  );
};

export default TaxPaymentsForm;
