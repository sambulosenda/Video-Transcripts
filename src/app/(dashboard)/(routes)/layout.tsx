import NavBar from "@/components/nav-bar";
import SideNavbar from "@/components/side-bar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <SideNavbar />
      </div>
      <main className="md:pl-72 h-full">
        <NavBar />
        {children}
      </main>
    </div>
  );
}
