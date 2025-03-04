'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { Progress } from '@/components/ui/progress'
import { ThemeToggle } from '@/components/ThemeButtonTrigger'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/home')
    }
  }, [isAuthenticated, loading, router])

  const validateInputs = () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return false
    }
    setError('')
    return true
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateInputs()) return

    setIsLoading(true)
    setProgress(0)

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer)
          setIsLoading(false)
          return 100
        }
        return oldProgress + 10
      })
    }, 200)

    try {
      const response = await axios.post(
        'http://localhost:4000/user/login',
        {
          email,
          password,
        },
        { withCredentials: true }
      )

      router.push('/home')
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        if (err.response.data.error === 'Account is pending approval') {
          setError('The account is currently in review by our team. You will be notified upon approval.')
        } else if (err.response.data.error === 'Account has been declined') {
          setError('Your account request has been declined. Please contact support.')
        } else {
          setError(err.response.data.error)
        }
      } else {
        setError('Invalid email or password.')
      }
      setIsLoading(false)
      setProgress(0)
    }
  }

  if (loading || isAuthenticated) {
    return null
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
          <h1 className="text-4xl font-bold text-white md:text-6xl">BNK</h1>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-8 md:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold">Sign in to your account</h2>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSignIn} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <Label htmlFor="email-address">Email address</Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>

          {isLoading && <Progress value={progress} className="w-full" />}

          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-primary hover:text-primary/80">
                Sign up
              </Link>
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
