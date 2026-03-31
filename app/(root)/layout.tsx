import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";


export default  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col">
      <Topbar />
      <main className="flex flex-row">
        <LeftSidebar/>
        <section className="flex min-h-screen flex-1 flex-col items-center bg-dark-1 px-6 pb-10 pt-28 max-md:pb-32 sm:px-10">
          <div className="w-full max-w-4xl">{children}</div>
        </section>
        <RightSidebar />
      </main>
      <Bottombar />
    </div>
  );
}
