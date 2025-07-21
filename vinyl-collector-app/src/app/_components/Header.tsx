import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { auth } from '~/server/auth';
import { HydrateClient } from "~/trpc/server";



export default async function Header() {
  const session = await auth();
  if (session?.user) {
  }
  return (
    <div>
      <HydrateClient>
        <div className="flex items-center justify-center gap-4">
          {/* <p className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p> */}
          <div className="flex items-center gap-2">
            <Image height={35} width={35} alt='' src="/images/LogoTransparent.svg"/>
            <p>Track Record</p>
          </div>

          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-primary-400 px-10 py-3 text-primary-100 font-semibold no-underline transition"
          >
            {session ? "Logout" : "Login"}
          </Link>
        </div>
      </HydrateClient>
    </div>
  )
}
