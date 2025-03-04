import { useEffect, useState } from 'react'
import axios from 'axios'

export function useAuth() {
  const [auth, setAuth] = useState({ isAuthenticated: false, user: null, loading: true })

  useEffect(() => {
    axios.get('http://localhost:4000/user/verify', { withCredentials: true })
      .then(response => {
        setAuth({ isAuthenticated: true, user: response.data.user, loading: false })
      })
      .catch(() => {
        setAuth({ isAuthenticated: false, user: null, loading: false })
      })
  }, [])

  return auth
}
