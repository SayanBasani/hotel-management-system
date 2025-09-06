import React from 'react'
import { NavLink } from 'react-router'

export default function TopNav() {
  return (
    <nav className='flex bg-blue-500 text-white p-4 items-center'>
      <span className='text-xl font-bold'>Logo</span>
        <ul className='flex space-x-4 ml-auto'>
            <NavLink to='/' className={({ isActive }) => isActive ? 'underline' : ''}>
                <li className='hover:underline cursor-pointer'>Home</li>
            </NavLink>
            <NavLink to='/about' className={({ isActive }) => isActive ? 'underline' : ''}>
                <li className='hover:underline cursor-pointer'>About</li>
            </NavLink>
            <NavLink to='/contact' className={({ isActive }) => isActive ? 'underline' : ''}>
                <li className='hover:underline cursor-pointer'>Contact</li>
            </NavLink>
        </ul>
        <ul className='flex space-x-4 ml-auto'>
            <NavLink to='/login' className={({ isActive }) => isActive ? 'underline' : ''}>
                <li className='hover:underline cursor-pointer'>Login</li>
            </NavLink>
            <NavLink to='/signup' className={({ isActive }) => isActive ? 'underline' : ''}>
                <li className='hover:underline cursor-pointer'>Sign Up</li>
            </NavLink>
        </ul>
    </nav>
  )
}
