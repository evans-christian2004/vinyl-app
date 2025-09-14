import Link from "next/link";

import  VinylsGrid from "~/app/_components/VinylsGrid";
import { auth } from "~/server/auth";
import AddVinylForm from "./_components/AddVinylForm";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return (
        <main className="flex min-h-full flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4">
            <div className="flex flex-col items-center gap-2">
              <AddVinylForm/>
              <h3 className="text-2xl font-bold">Vinyls</h3>
              <VinylsGrid/>
            </div>
          </div>
        </main>
    );
  }
}
