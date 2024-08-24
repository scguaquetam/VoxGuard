import React, {
  createContext,
  useState,
  useContext
} from 'react'
import { User } from '../models/User'


interface UserContextType {
  user: User | null
}
const UserContext = createContext<UserContextType | undefined>(undefined)


export const UserProvider = ({ children } : any) => {
  const [user, setUser] = useState<User | null>(null)

  const value = {
    user,
    setUser
  }
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
