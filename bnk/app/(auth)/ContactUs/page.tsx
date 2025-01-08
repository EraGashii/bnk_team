'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'; // Verify the import path

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
 
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar Section */}
      <nav className="bg-red-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">MyBank</h1>
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-white hover:underline">
              Online banking
            </Link>
            <Link href="/" className="text-white hover:underline">
              About us
            </Link>
            <Link href="/ContactUs" className="text-white hover:underline">
              Contact us
            </Link>
            <Link href="/sign-in">
              <Button className="bg-white text-red-600 px-4 py-2 rounded-md">
                Sign In
              </Button>
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white">
              <i className="material-icons">menu</i>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center bg-gray-50 p-6">
        <div className="relative grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {/* Background Shapes */}
          <div className="absolute -top-10 -left-10 w-96 h-96 bg-red-100 rounded-full opacity-30"></div>
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-red-100 rounded-full opacity-30"></div>

          {/* Left Section */}
          <div className="z-10 flex flex-col justify-center rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Let's get in touch</h2>
            <p className="text-gray-600 mb-4">bllabllaaa</p>
            <div className="space-y-3">
              <div className="flex items-center">
                <i className="material-icons text-red-600 mr-2">location_on</i>
                <span>Kline</span>
              </div>
              <div className="flex items-center">
                <i className="material-icons text-red-600 mr-2">email</i>
                <span>bank@gmail.com</span>
              </div>
              <div className="flex items-center">
                <i className="material-icons text-red-600 mr-2">phone</i>
                <span>044-489-488</span>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-gray-600 mb-2">Connect with us:</p>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded-full"></div>
                <div className="w-8 h-8 bg-red-600 rounded-full"></div>
                <div className="w-8 h-8 bg-red-600 rounded-full"></div>
                <div className="w-8 h-8 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="z-10 rounded-lg bg-red-100 p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Contact us</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-full border-2 border-red-500 bg-red-50 p-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-full border-2 border-red-500 bg-red-50 p-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-full border-2 border-red-500 bg-red-50 p-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-lg border-2 border-red-500 bg-red-50 p-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-red-800 text-white py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h4 className="text-lg font-bold mb-4">About MyBank</h4>
            <p className="text-white">
              MyBank is committed to providing seamless, fast, and secure
              financial solutions. Join us and experience hassle-free banking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-white hover:underline">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/ContactUs" className="text-white hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white"
              >
                <i className="material-icons">facebook</i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white"
              >
                <i className="material-icons">twitter</i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white"
              >
                <i className="material-icons">instagram</i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-white">
          © {new Date().getFullYear()} MyBank. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
