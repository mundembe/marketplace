import Navbar from "../component/Navbar";

export default function LayoutWithNavbar({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        {children}
      </main>
      <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Marketplace. All rights reserved.
      </footer>
    </div>
  );
}
