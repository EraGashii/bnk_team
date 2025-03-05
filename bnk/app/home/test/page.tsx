"use client"

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [taxPayments, setTaxPayments] = useState([]);

  useEffect(() => {
    async function fetchTaxPayments() {
      try {
        const response = await axios.get("http://localhost:4000/tax", { withCredentials: true });
        setTaxPayments(response.data);
      } catch (error) {
        console.error("Error fetching tax payments:", error);
      }
    }

    fetchTaxPayments();
  }, []);

  return (
    <div>
      <h1>My Tax Payments</h1>
      <ul>
        {taxPayments.map((tax) => (
          <li key={tax.id}>
            {tax.taxName} - ${tax.amount} - {tax.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
