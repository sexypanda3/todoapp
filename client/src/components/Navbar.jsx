import React from 'react'
import Auth from '../helpers/auth'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <div className='container px-2 py-5 mx-auto'>
            <div className="flex items-center justify-between">
                <h1 className="title">To Do List</h1>

                <div className="flex items-center gap-3">
                    {
                        Auth.isAuthenticated() ? (
                            <>
                                <button className='link flex items-center gap-1' onClick={() => Auth.logout()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                    </svg>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to='/signin' className='link'>Signin</Link>
                                <Link to='/signup' className='link'>Signup</Link>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar