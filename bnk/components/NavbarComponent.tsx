'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="py-6 sticky top-0 z-10 backdrop-blur-sm bg-background/80">
      <nav className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-3xl font-bold text-primary">
          BNK
        </Link>
        <div className="space-x-6">
          <Link 
            href="/about" 
            className={`text-lg transition-colors ${
              pathname === '/about'
                ? 'text-primary font-medium'
                : 'text-foreground hover:text-primary'
            }`}
          >
            About Us
          </Link>
          <Link 
            href="/login" 
            className={`text-lg transition-colors ${
              pathname === '/signin'
                ? 'text-primary font-medium'
                : 'text-foreground hover:text-primary'
            }`}
          >
            Sign In
          </Link>
        </div>
      </nav>
    </header>
  )
}
