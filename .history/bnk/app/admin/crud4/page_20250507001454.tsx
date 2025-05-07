"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
    fetchContract,
  fetchEmployee,
  addContract,
 deleteContract,
  addEmployee,
  updateEmployee,
 deleteEmployee,
} from "../../../PlanetApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

interface Employee {
    EmployeeId: number;
     Name: string;
    Surname: string;
 
}

interface Contract {
  id: number;
    Id: number;
    Title:string;
    Description:string;
   EmployeeId: number;
  Employee?:Employee;
}

const EmployeeContractManager: React.FC = () => {
  const [tab, setTab] = useState<"Contract" | "Employees">("Contract");
  const [Employees, setEmployees] = useState<Employee[]>([]);
  const [Contract, setContract] = useState<Contract[]>([]);
  const [ContractData, setContractData] = useState({  Name: "",  EmployeeId: "" });
  const [Name, setName] = useState<string>("");
  const [ Surname, setSurname] = useState<string>("");

  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
    loadContract();
  }, []);

  const loadEmployees = async () => {
    const data = await fetchEmployee();
    setEmployees(data);
  };

  const loadContract = async () => {
    const data = await fetchContract();
    setContract(data);
  };

  const handleContractInput = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setContractData({ ...ContractData, [e.target.name]: e.target.value });
  };

  const handleAddContract = async () => {
    const fixedData = {
        ...ContractData,
        EmployeeId: Number(ContractData.EmployeeId), // convert to number
      };
    await addContract(fixedData);
    setContractData({  Name:"", EmployeeId:"" });
    loadContract();
  };
  

  const handleDeleteContract = async (id: number) => {
   await deleteContract(id);
    loadContract();
  };

  const handleAddEmployee = async () => {
    if (!Name.trim()) return alert("Employee name is required");
    await addEmployee( Name,Type);
    setName("");
    setType("");
    loadEmployees();
  };

  const handleUpdateEmployee = async () => {
    if (editEmployee) {
      await updateEmployee(editEmployee.EmployeeId,Name,Type);
      setEditEmployee(null);
      setName("");
    setType("");
      loadEmployees();
    }
  };

  const handleDeleteEmployee = async (id:number) => {
    if (window.confirm("Are you sure you want to delete this Employee?")) {
        await  deleteEmployee(id);
      loadEmployees();
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] text-white p-6 space-y-8">
        <h2 className="text-2xl font-bold text-green-500">BankkApp Admin</h2>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block hover:text-green-400">Dashboard</Link>
          <Link href="/users" className="block hover:text-green-400">Users</Link>
          <Link href="/transactions" className="block hover:text-green-400">Transactions</Link>
          <Link href="/tax-payments" className="block hover:text-green-400">Tax Payments</Link>
          <Link href="/admin/crud" className="block hover:text-green-400">Crud</Link>
          <Link href="/admin/crud2" className="block hover:text-green-400">Crud2</Link>
          <Link href="/admin/crud3" className="block hover:text-green-400">Crud3</Link>
        </nav>
        <div className="mt-auto">
          <button className="text-sm hover:text-red-500">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Employee & Contract Management</h1>
        <div className="flex space-x-4 mb-6">
          <button className={`px-4 py-2 rounded ${tab === "Contract" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("Contract")}>Contract</button>
          <button className={`px-4 py-2 rounded ${tab === "Employees" ? "bg-green-600 text-white" : "bg-gray-700"}`} onClick={() => setTab("Employees")}>Employees</button>
        </div>

        {tab === "Contract" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Contract Management</h2>
            <div className="flex gap-2 mb-4">
              <input type="text" name="Name" placeholder="Name" value={ContractData.Name} onChange={handleContractInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4" />   
              <select name="EmployeeId" value={ContractData. EmployeeId} onChange={handleContractInput} className="bg-[#222] text-white border border-gray-700 px-3 py-2 w-1/4">
                <option value="">Select Employee</option>
                {Employees.map((t) => <option key={t.EmployeeId} value={t.EmployeeId}>{t.Name}</option>)}
              </select>
              <button onClick={handleAddContract} className="bg-green-500 text-white px-4 rounded">+ Add</button>
            </div>

            <table className="min-w-full border border-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 text-left">#</th>

                  <th className="p-2 text-left"> Name</th>
                  <th className="p-2 text-left">Employee</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#111]">
                {Contract.map((p, i) => (
                  <tr key={p.Id} className="border-t border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{p.Name}</td>
                    <td className="p-2">{p.Employee?.Name ||"N/A"}</td>
                    <td className="p-2">{p.Employee?.Type  ||"N/A"}</td>
                    <td className="p-2 text-center">
                      <button className="text-red-500 hover:text-red-600" onClick={() => handleDeleteContract(p.id)}>
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Employees" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Employees Management</h2>
            <div className="flex mb-4">
              <input
                type="text"
                className="bg-[#222] text-white border border-gray-700 px-3 py-2 mr-2 w-full"
                placeholder="Enter Employee name"
                value={Name }
                onChange={(e) => setName(e.target.value)}
              />
                  <input
                type="text"
                className="bg-[#222] text-white border border-gray-700 px-3 py-2 mr-2 w-full"
               placeholder="Enter department"
                value={Type}
                onChange={(e) => setType(e.target.value)}
              />
                              

              {editEmployee ? (
                <button className="bg-yellow-500 text-white px-4 rounded" onClick={handleUpdateEmployee}>Update</button>
              ) : (
                <button className="bg-green-500 text-white px-4 rounded" onClick={handleAddEmployee}>Add</button>
              )}
            </div>

            <table className="min-w-full border border-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Employee Name</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#111]">
                {Employees.map((Employee,i) => (
                  <tr key={Employee.EmployeeId} className="border-t border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{Employee.Name}</td>
                    <td className="p-2">{Employee.Type}</td>

                    <td className="p-2 text-center space-x-3">
                      <button className="text-yellow-500 hover:text-yellow-600" onClick={() => { setEditEmployee(Employee); setName(Employee.Name);setType(Employee.Type);}}>
                        <FiEdit size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-600" onClick={() => handleDeleteEmployee(Employee.EmployeeId)}>
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeContractManager;
