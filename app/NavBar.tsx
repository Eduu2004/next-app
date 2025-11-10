"use client";
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const NavBar = () => {
  const { status, data: session } = useSession();


  return (
    <div className='flex bg-slate-200 p-5 space-x-3'>
        <Link href="/" className='mr-5'>Next.js</Link>
        <Link href="/users">Users</Link>
        { status === "loading" && <div>Loading...</div>}
        { status === "authenticated" &&
         <div>
            {session.user!.name}
            <Link href="/auth/change-password" className='ml-3'>Change Password</Link>
            <Link href="/api/auth/signout" className='ml-8'>Sign Out</Link>
          </div> }
        { status === "unauthenticated" &&<Link href="/api/auth/signin">Login</Link>}
    </div>
  )
}

export default NavBar