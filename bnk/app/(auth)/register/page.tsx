"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { Formik, Form, Field, ErrorMessage } from "formik"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { signUpSchema } from "./validation-schema"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const steps = [
    { title: "Create your account", step: 1 },
    { title: "Enter your details", step: 2 },
    { title: "Finishing Up", step: 3 },
  ]

  const initialValues = {
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    postalCode: "",
    phoneNumber: "",
  }

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setError(null)
    setSubmitting(true)

    try {
      const response = await axios.post("http://localhost:4000/user/register", {
        name: values.name,
        surname: values.surname,
        email: values.email,
        password: values.password,
        address: values.address,
        postalCode: values.postalCode,
        phoneNumber: values.phoneNumber,
      })

      console.log("Registration successful:", response.data)
      setSuccessMessage("Registration successful! Your account is under review.")
      setStep(3)
    } catch (err) {
      let errorMessage = "An error occurred during registration"

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.message || errorMessage
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage
      }

      console.error("Error during registration:", errorMessage)
      setError(errorMessage)
    }

    setSubmitting(false)
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

          {error && <div className="text-center text-red-500 font-medium">{error}</div>}

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
                      <div
                        className={`absolute top-1/2 left-full w-16 h-1 -translate-y-1/2 ${
                          step > stepNumber ? "bg-primary" : "bg-muted"
                        }`}
                      />
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

          <Formik initialValues={initialValues} validationSchema={signUpSchema} onSubmit={handleSubmit}>
            {({ errors, touched, isSubmitting, validateForm }) => (
              <Form>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="form1"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mt-8 space-y-6">
                        <div className="space-y-4 rounded-md shadow-sm">
                          <div>
                            <Label htmlFor="name">First Name</Label>
                            <Field
                              as={Input}
                              id="name"
                              name="name"
                              type="text"
                              autoComplete="given-name"
                              className="mt-1"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="surname">Surname</Label>
                            <Field
                              as={Input}
                              id="surname"
                              name="surname"
                              type="text"
                              autoComplete="family-name"
                              className="mt-1"
                            />
                            <ErrorMessage name="surname" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="email">Email address</Label>
                            <Field
                              as={Input}
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              className="mt-1"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative mt-1">
                              <Field
                                as={Input}
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
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
                            <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Field
                              as={Input}
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              className="mt-1"
                            />
                            <ErrorMessage
                              name="confirmPassword"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Button
                            type="button"
                            className="w-full"
                            onClick={() => {
                              validateForm().then((errors) => {
                                if (
                                  Object.keys(errors).length === 0 ||
                                  Object.keys(errors).every(
                                    (key) => !["name", "surname", "email", "password", "confirmPassword"].includes(key),
                                  )
                                ) {
                                  setStep(2)
                                }
                              })
                            }}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
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
                      <div className="mt-8 space-y-6">
                        <div className="space-y-4 rounded-md shadow-sm">
                          <div>
                            <Label htmlFor="address">Address</Label>
                            <Field as={Input} id="address" name="address" type="text" className="mt-1" />
                            <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Field as={Input} id="postalCode" name="postalCode" type="text" className="mt-1" />
                            <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Field as={Input} id="phoneNumber" name="phoneNumber" type="tel" className="mt-1" />
                            <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                        </div>
                        <div>
                          <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Signing up..." : "Sign up"}
                          </Button>
                        </div>
                      </div>
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
                        <h3 className="text-2xl font-bold text-primary mb-4">
                          {successMessage || "Account Under Review"}
                        </h3>
                        <p className="text-gray-600">
                          {successMessage
                            ? "Thank you for registering! You will receive an email with further details."
                            : "Your account creation is being reviewed by our team. Once approved, you will gain access to your account and receive your Account and Credit Card details."}
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Form>
            )}
          </Formik>
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

