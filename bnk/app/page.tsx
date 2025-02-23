'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import HexagonBackground from "@/components/HexagonBackground"
import AnimatedTransaction from "@/components/AnimatedTransaction"
import NavbarComponent from "@/components/NavbarComponent"
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HexagonBackground />
      <NavbarComponent />

      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-left max-w-2xl">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-lg">
               One click transfers for your needs
              </h1>
              <p className="text-2xl lg:text-3xl mb-12 text-foreground drop-shadow-md">
                Secure, simple, and smart banking solutions for your financial needs.
              </p>
              <Button
                size="lg"
                className="font-semibold text-xl px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Button>
            </div>
            <div className="lg:w-1/2 flex justify-center items-center">
              <AnimatedTransaction />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-muted-foreground">
        <p>&copy; 2025 BankApp. All rights reserved.</p>
      </footer>
    </div>
  )
}

