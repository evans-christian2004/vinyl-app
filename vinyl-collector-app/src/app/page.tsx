import Link from "next/link";

import  VinylsGrid from "~/app/_components/VinylsGrid";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
  }

  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2">
            
            <h3 className="text-2xl font-bold">Vinyls</h3>
            <VinylsGrid/>
          </div>
        </div>
      </main>
  );
}
