import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-bg overflow-x-hidden">
      <Sidebar />
      {/* 
        On mobile/tablet: Navbar is visible, so we need pt-32. 
        On XL: Sidebar is visible, Navbar is hidden, so we need pt-12 or similar. 
      */}
      <main className="flex-1 p-6 md:p-12 pt-32 lg:pt-12 transition-all relative">
        {children}
      </main>
    </div>
  );
}
