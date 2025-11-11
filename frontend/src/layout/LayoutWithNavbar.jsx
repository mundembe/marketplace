import Navbar from "../component/Navbar";

export default function LayoutWithNavbar({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16"> {/* Adjust this padding to match your navbar height */}
        {children}
      </main>
    </>
  );
}
