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
} from "../../employeeApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface Employee {
EmployeeId: number;
  Name: string;
  Surname: string;
}

interface Contract {
  ContractId: number;
  Name: string;
  Title: string;
  Description: string;
  EmployeeId: number;
  Employee?: Employee;
}

const EmployeeContractManager: React.FC = () => {
  const [tab, setTab] = useState<"Contract" | "Employee">("Contract");
  const [Employee, setEmployee] = useState<Employee[]>([]);
  const [Contract, setContract] = useState<Contract[]>([]);
  const [ContractData, setContractData] = useState({ Name: "",Title: "", Description: "", EmployeeId: "" });
  const [EmployeeName, setEmployeeName] = useState<string>("");
  const [EmployeeSurname, setEmployeeSurname] = useState<string>("");
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployee();
    loadContract();
  }, []);

  const loadEmployee = async () => {
    const data = await fetchEmployee();
    setEmployee(data);
  };

  const loadContract = async () => {
    const data = await fetchContract();
    setContract(data);
  };

  const handleContractInput = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setContractData({ ...ContractData, [e.target.name]: e.target.value });
  };

  const handleAddContract = async () => {
    await addContract(ContractData);
    setContractData({ Name: "", Title: "",Description: "", EmployeeId: "" });
    loadContract();
  };

  const handleDeleteContract = async (id: number) => {
    await deleteContract(id);
    loadContract();
  };

  const handleAddEmployee = async () => {
    if (!EmployeeName.trim() || !EmployeeSurname.trim()) {
      return alert("Both name and surname are required");
    }
  
    await addEmployee(EmployeeName, EmployeeSurname); // pass both
    setEmployeeName("");
    setEmployeeSurname("");
    loadEmployee();
  };

  const handleUpdateEmployee = async () => {
    if (editEmployee) {
      await updateEmployee(editEmployee.EmployeeId, EmployeeName,EmployeeSurname);
      setEditEmployee(null);
      setEmployeeName("");
      setEmployeeSurname("");
      loadEmployee();
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this Employee?")) {
      await deleteEmployee(id);
      loadEmployee();
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === "Contract" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("Contract")}
        >
          Contract
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "Employee" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("Employee")}
        >
          Employee
        </button>
      </div>

      {tab === "Contract" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-black">Contract Management</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" name="Name" placeholder="Name" value={ContractData.Name} onChange={handleContractInput} className="border px-3 py-2 w-1/4" />
            <input type="text" name="Title" placeholder="Title" value={ContractData.Title} onChange={handleContractInput} className="border px-3 py-2 w-1/4" />
            <input type="text" name="Description" placeholder="Description" value={ContractData.Description} onChange={handleContractInput} className="border px-3 py-2 w-1/4" />
            <select name="EmployeeId" value={ContractData.EmployeeId} onChange={handleContractInput} className="border px-3 py-2 w-1/4">
              <option value="">Select Employee</option>
              {Employee.map((t) => <option key={t.EmployeeId} value={t.EmployeeId}>{t.Name}</option>)}
            </select>
            <button onClick={handleAddContract} className="bg-blue-500 text-white px-4 rounded">+ Add</button>
          </div>

          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left text-black">#</th>
                <th className="p-2 text-left text-black">Title</th>
                <th className="p-2 text-left text-black">Description</th>
                <th className="p-2 text-left text-black">Employee</th>
                <th className="p-2 text-center text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Contract.map((p, i) => (
                <tr key={p.ContractId} className="border-t text-black">
                  <td className="p-2 ">{i + 1}</td>
                  <td className="p-2 text-black">{p.Name}</td>
                  <td className="p-2 text-black">{p.Title}</td>
                  <td className="p-2 text-black">{p.Description}</td>
                  <td className="p-2 text-black">{p.Employee?.Name || "N/A"}</td>
                  <td className="p-2 text-center">
                    <button className="text-red-500 hover:text-red-600" onClick={() => handleDeleteContract(p.ContractId)}>
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Employee" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-black">Employee Management</h2>
          <div className="flex mb-4">
            <input
              type="text"
              className="border px-3 py-2 mr-2 w-full"
              placeholder="Enter Employee name"
              value={EmployeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
            <input
  type="text"
  className="border px-3 py-2 mr-2 w-full"
  placeholder="Enter Employee surname"
  value={EmployeeSurname}
  onChange={(e) => setEmployeeSurname(e.target.value)}
/>

            {editEmployee ? (
              <button className="bg-yellow-500 text-white px-4 rounded" onClick={handleUpdateEmployee}>Update</button>
            ) : (
              <button className="bg-green-500 text-white px-4 rounded" onClick={handleAddEmployee}>Add</button>
            )}
          </div>

          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left text-black">#</th>
                <th className="p-2 text-left text-black" >Employee Name</th>
                <th className="p-2 text-left text-black" >Employee Surname</th>
                <th className="p-2 text-center text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Employee.map((Employee, i) => (
                <tr key={Employee.EmployeeId} className="border-t text-black">
                  <td className="p-2 text-black">{i + 1}</td>
                  <td className="p-2 text-black">{Employee.Name}</td>
                  <td className="p-2 text-black">{Employee.Surname}</td>
                  <td className="p-2 text-center space-x-3">
                    <button
                      className="text-yellow-500 hover:text-yellow-600"
                      onClick={() => {
                        setEditEmployee(Employee);
                        setEmployeeName(Employee.Name);
                        setEmployeeSurname(Employee.Surname);
                      }}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteEmployee(Employee.EmployeeId)}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeContractManager;
