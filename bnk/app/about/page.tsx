'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Building2, Heart, Lightbulb, Users } from "lucide-react"
import Image from "next/image"
import NavbarComponent from "@/components/NavbarComponent"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarComponent />
      
      <main className="flex-grow container mx-auto px-4 py-16 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Our Story</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            At MyBank, we are more than just a bank – we're a community-driven partner focused on providing innovative financial solutions. Whether you're saving for your future, buying a home, or managing your everyday expenses, we're here to help you succeed.
          </p>
        </div>

        {/* Image and Vision Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-xl">
            {/* <Image */}
            {/*   src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" */}
            {/*   alt="Our team at work" */}
            {/*   fill */}
            {/*   className="object-cover" */}
            {/*   priority */}
            {/* /> */}
          </div>
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Our Vision</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To be the most trusted and innovative banking partner for our customers. We aim to provide simple, accessible, and secure banking services that empower individuals and businesses alike.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Integrity</h3>
                <p className="text-muted-foreground text-center">
                  Always do the right thing for our customers
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <Lightbulb className="h-6 w-6 text-secondary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Innovation</h3>
                <p className="text-muted-foreground text-center">
                  Constantly seeking new solutions for better banking
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Customer Focus</h3>
                <p className="text-muted-foreground text-center">
                  Putting your needs first and foremost
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-destructive/10 rounded-full">
                    <Heart className="h-6 w-6 text-destructive" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Community</h3>
                <p className="text-muted-foreground text-center">
                  Giving back and supporting the communities we serve
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-16" />

        {/* Mission Statement */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Join Our Journey</h2>
          <p className="text-muted-foreground">
            Experience banking that puts you first. At MyBank, we're committed to providing seamless, fast, and secure financial solutions that help you achieve your goals.
          </p>
        </div>
      </main>

      <footer className="py-6 text-center text-muted-foreground">
        <p>&copy; 2025 BankApp. All rights reserved.</p>
      </footer>
    </div>
  )
}
