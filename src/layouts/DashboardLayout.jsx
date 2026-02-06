import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children, hideHeader = false }) {
  return (
    <div className="flex min-h-screen bg-bg overflow-x-hidden">
      {!hideHeader && <Navbar />}
      <Sidebar />
      {/* 
        On mobile/tablet: Navbar is visible, so we need pt-32. 
        On XL: Sidebar is visible, Navbar is hidden, so we need pt-12 or similar.
        If header is hidden, we remove the top padding compensation.
      */}
      <main className={`flex-1 p-4 md:p-8 transition-all relative ${hideHeader ? 'pt-4' : 'pt-28 lg:pt-8'}`}>
        {children}
      </main>
    </div>
  );
}
