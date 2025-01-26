"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)

  const steps = [
    { title: "Create your account", step: 1 },
    { title: "Enter your details", step: 2 },
    { title: "Finishing Up", step: 3 },
  ]

  const handleFirstFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProgress(0)
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer)
          setStep(2)
          return 100
        }
        return oldProgress + 10
      })
    }, 200)
  }

  const handleSecondFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProgress(0)
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer)
          setStep(3)
          return 100
        }
        return oldProgress + 10
      })
    }, 200)
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="relative flex-1 bg-primary md:w-1/2">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Banking illustration"
          layout="fill"
          objectFit="cover"
          className="mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <h1 className="text-4xl font-bold text-white md:text-6xl">Join BNK</h1>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-8 md:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold">Create your account</h2>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="relative">
            <div className="flex items-center justify-between">
              {steps.map(({ title, step: stepNumber }, index) => (
                <div key={stepNumber} className="flex flex-col items-center z-10 w-full">
                  <div className="flex items-center relative">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                        step >= stepNumber ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span className="text-white font-medium">{stepNumber}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`absolute top-1/2 left-full w-16 h-1 -translate-y-1/2 ${
                        step > stepNumber ? "bg-primary" : "bg-muted"
                      }`} />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm text-center px-2 ${
                      step === stepNumber ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="form1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleFirstFormSubmit} className="mt-8 space-y-6">
                  <div className="space-y-4 rounded-md shadow-sm">
                    {/* First Name Field */}
                    <div>
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        name="first-name"
                        type="text"
                        autoComplete="given-name"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="surname">Surname</Label>
                      <Input
                        id="surname"
                        name="surname"
                        type="text"
                        autoComplete="family-name"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email-address">Email address</Label>
                      <Input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Button type="submit" className="w-full">
                      Next
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="form2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSecondFormSubmit} className="mt-8 space-y-6">
                  <div className="space-y-4 rounded-md shadow-sm">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" type="text" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="postal-code">Postal Code</Label>
                      <Input id="postal-code" name="postal-code" type="text" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input id="phone-number" name="phone-number" type="tel" required className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Button type="submit" className="w-full">
                      Sign up
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="mt-8 space-y-6 text-center"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h3 className="text-2xl font-bold text-primary mb-4">Account Under Review</h3>
                  <p className="text-gray-600">
                    Your account creation is being reviewed by our team. Once approved, you will gain access to your
                    account and receive your Account and Credit Card details.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="w-24 h-24 mx-auto mb-4">
                    <svg className="animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">
                    This process may take up to 24 hours. We appreciate your patience.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {progress > 0 && progress < 100 && <Progress value={progress} className="w-full" />}
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium text-primary hover:text-primary/80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
