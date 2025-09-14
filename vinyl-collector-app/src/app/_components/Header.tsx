import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { auth } from '~/server/auth';
import { HydrateClient } from "~/trpc/server";

export default async function Header() {
  const session = await auth();

  return (
    <nav className='sticky top-0 border-b-1 border-primary-300'>
      <HydrateClient>
        <div className="flex items-center justify-around gap-4 py-1">
          <div className="flex items-center gap-2">
            <Image height={37} width={37} alt="Logo" src="/images/LogoTransparent.svg" />
            <p className='text-primary-400 text-2xl font-light'>Track Record</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className={"rounded-full bg-primary-400 border-primary-400 pr-6 py-1 text-primary-100 no-underline transition flex items-center gap-2 hover:text-primary-400 hover:bg-primary-100 border-2 ease-in-out duration-300" + (session ? " pl-0" : " pl-6")}
            >
              
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  width={30}
                  height={30}
                  className="rounded-full ml-1"
                  unoptimized // Remove if you configure domains in next.config.js
                />
              )}
              {session ? "Logout" : "Login"}
            </Link>
          </div>
        </div>
      </HydrateClient>
    </nav>
  );
}