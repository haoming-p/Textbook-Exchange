import React from 'react'
import '../style.css'
import Login from './Login'

const Header = () => {
  return (
    <div className='flex justify-between items-center p-4 bg-white shadow-md'>
        <div>Textbook Exchange Logo</div>
        <div><Login /></div>
    </div>
  )
}

export default Header
