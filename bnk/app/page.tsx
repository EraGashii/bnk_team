import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
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

      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[600px]">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Landing illustration"
          layout="fill"
          objectFit="cover"
          className="mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-[url('../images/bank.jpeg')] bg-cover bg-center">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl font-bold text-white md:text-6xl">
              Welcome to MyBank
            </h2>
            <p className="text-lg text-white mt-4 max-w-3xl">
              Simplify your banking with MyBank ON – your trusted companion for
              seamless, fast, and secure financial management.
            </p>
          </div>
        </div>
      </div>

      {/* Introducing MyBank ON Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Introducing MyBank ON</h3>
          <p className="text-lg text-gray-700 mb-12">
            Bank anytime, anywhere with MyBank ON! Our easy-to-use app lets you
            make payments, monitor finances, and enjoy convenient banking on the
            go.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-4">✔️</div>
              <h4 className="text-xl font-bold">Simply</h4>
              <p className="text-gray-600 mt-2 text-center">
                Easily access services and make payments directly from your
                phone or computer. Enjoy hassle-free transactions at your
                fingertips.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="text-xl font-bold">Fast and Always Improving</h4>
              <p className="text-gray-600 mt-2 text-center">
                We work every day to make this experience as comfortable and
                flexible as possible for our customers.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-bold">Safe</h4>
              <p className="text-gray-600 mt-2 text-center">
                Protecting your data is a top priority for MyBank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Account Opening Section */}
      <section className="bg-yellow-50 py-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Left Section - App Image */}
          <div className="flex justify-center">
            <Image
           src="/images/bank.jpeg"
              alt="MyBank App"
              width={350}
              height={700}
              className="rounded-lg shadow-lg"
            />
          </div>
          {/* Right Section - Content */}
          <div>
            <h3 className="text-3xl font-bold mb-6">
              Open an Account Completely Through Mobile
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              Open a current account today by downloading the MyBank ON app.
              Proceed with the registration process entirely within the app, and
              in just a few minutes, enjoy the advantages of becoming a valued
              MyBank customer.
            </p>
            <Button className="bg-red-600 text-white px-6 py-3 rounded-md">
              Download MyBank ON
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
