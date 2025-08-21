import React from 'react'
import { Link, Navigate } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
        <button>
            <Link to="/register" className="flex justify-center items-center min-h-screen bg-gray-100">Register</Link>
        </button>
        <button>
            <Link to="/login" className="flex justify-center items-center min-h-screen bg-gray-100">Login</Link>
        </button>
    </div>
    
  )
}

export default HomePage