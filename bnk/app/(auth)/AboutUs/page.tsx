'use client'
import { Button } from '@/components/ui/button';
import Image from 'next/image'
import Link from 'next/link';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Section */}
      <nav className="bg-red-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">MyBank</h1>
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-white hover:underline">
              Online banking
            </Link>
            <Link href="/AboutUs" className="text-white hover:underline">
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
              <span className="material-icons">menu</span>
            </button>
          </div>
        </div>
      </nav>


      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <p className="text-lg text-gray-600 mt-4">
              At **MyBank**, we are more than just a bank – we're a community-driven partner focused on providing innovative financial solutions. Whether you’re saving for your future, buying a home, or managing your everyday expenses, we’re here to help you succeed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex justify-center">
       <img
           src="https://media.istockphoto.com/id/1443245439/photo/business-meeting-businesswoman-woman-office-portrait-job-career-happy-businessman-teamwork.jpg?s=612x612&w=0&k=20&c=1ZR02c1UKfGdBCNWzzKlrwrVZuEiOqnAKcKF4V_t038="
            alt="Our team"
            width={500}
             height={500}
             className="rounded-xl shadow-lg"
            />
            </div>
            <div>
               <h3 className="text-2xl font-semibold text-gray-900">Our Vision</h3>
              <p className="text-gray-600 mt-4">
                To be the most trusted and innovative banking partner for our customers. We aim to provide simple, accessible, and secure banking services that empower individuals and businesses alike.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8">Our Values</h3>
              <ul className="list-disc ml-6 mt-4 text-gray-600">
                <li>**Integrity** – Always do the right thing for our customers.</li>
                <li>**Innovation** – Constantly seeking new solutions for better banking.</li>
                <li>**Customer Focus** – Putting your needs first and foremost.</li>
                <li>**Community** – Giving back and supporting the communities we serve.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

   
        {/* Footer Section */}
        <footer className="bg-red-800 text-white py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h4 className="text-lg font-bold mb-4">About MyBank</h4>
            <p className="text-white-400">
              MyBank is committed to providing seamless, fast, and secure
              financial solutions. Join us and experience hassle-free banking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white-400 hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/AboutUs" className="text-white-400 hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-white-400 hover:underline">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/ContactUs" className="text-white-400 hover:underline">
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
                className="text-white-400 hover:text-white"
              >
                <span className="material-icons">facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white-400 hover:text-white"
              >
                <span className="material-icons">twitter</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white-400 hover:text-white"
              >
                <span className="material-icons">instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-white-400">
          © {new Date().getFullYear()} MyBank. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
