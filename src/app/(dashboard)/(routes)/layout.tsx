import NavBar from "@/components/nav-bar";


export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
     
      <main className=" h-full">
        <NavBar />
        {children}
      </main>
    </div>
  );
}
