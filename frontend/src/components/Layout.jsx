import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-10">
        {children}
      </div>
    </div>
  );
}