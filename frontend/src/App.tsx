import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AdminProductPage } from "./pages/AdminProductPage";
import { TableListPage } from "./pages/TableListPage";
import { PricingManagementPage } from "./pages/PricingManagementPage";
import { TableProvider } from "./contexts/TableContext";
import { LayoutDashboard, Boxes, DollarSign, Menu, X } from "lucide-react";
import { useState } from "react";

// Tauri global tipini tanımla
declare global {
  interface Window {
    __TAURI__?: {
      shell: {
        open: (url: string) => Promise<void>;
      };
    };
  }
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenWebsite = async () => {
    try {
      // Tauri masaüstü uygulamasında external link açmak için
      if (window.__TAURI__) {
        // Tauri ortamında - varsayılan tarayıcıda aç
        await window.__TAURI__.shell.open(
          "https://sirac-ozgultekin.vercel.app/"
        );
      } else {
        // Web tarayıcısında - yeni sekmede aç
        window.open("https://sirac-ozgultekin.vercel.app/", "_blank");
      }
    } catch (error) {
      console.error("Website açılırken hata:", error);
      // Fallback
      window.open("https://sirac-ozgultekin.vercel.app/", "_blank");
    }
  };

  return (
    <TableProvider>
      <Router>
        <div className="min-h-screen bg-[#111827] text-white">
          {/* Desktop Navbar */}
          <nav className="bg-[#1f2937] px-4 md:px-8 py-4">
            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-3 items-center">
              <div className="text-lg lg:text-xl font-bold flex items-center gap-2">
                <img
                  src="/ezon.png"
                  alt="E-Zone Logo"
                  className="w-8 h-8 lg:w-10 lg:h-10"
                />
                <span className="italic font-mono">Ezan Cafe</span>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleOpenWebsite}
                  className="text-xs lg:text-sm text-gray-400 hover:text-gray-200 transition-colors cursor-pointer bg-transparent border-none"
                >
                  SİRACSOFT © 2025
                </button>
              </div>
              <div className="flex justify-end gap-2 lg:gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 lg:px-4 py-1.5 rounded text-xs lg:text-sm"
                >
                  <LayoutDashboard size={14} /> Masalar
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white px-2 lg:px-4 py-1.5 rounded text-xs lg:text-sm"
                >
                  <Boxes size={14} /> Ürünler
                </Link>
                <Link
                  to="/pricing"
                  className="flex items-center gap-1 bg-green-700 hover:bg-green-600 text-white px-2 lg:px-4 py-1.5 rounded text-xs lg:text-sm"
                >
                  <DollarSign size={14} /> Fiyatlandırma
                </Link>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold flex items-center gap-2">
                  <span className="bg-gray-400 p-1 rounded-full">🎮</span>
                  <span className="italic font-mono">Ezan Cafe</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white p-2"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>

              {/* Mobile Menu */}
              {isMobileMenuOpen && (
                <div className="mt-4 space-y-2">
                  <Link
                    to="/"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={16} /> Tables
                  </Link>
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Boxes size={16} /> Products
                  </Link>
                  <Link
                    to="/pricing"
                    className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded text-sm w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <DollarSign size={16} /> Pricing
                  </Link>
                  <button
                    onClick={handleOpenWebsite}
                    className="text-sm text-gray-400 hover:text-gray-200 transition-colors cursor-pointer bg-transparent border-none w-full text-center py-2"
                  >
                    SİRACSOFT © 2025
                  </button>
                </div>
              )}
            </div>
          </nav>

          <main className="p-4 md:p-8 min-h-[calc(100vh-140px)]">
            <Routes>
              <Route path="/" element={<TableListPage />} />
              <Route path="/admin" element={<AdminProductPage />} />
              <Route path="/pricing" element={<PricingManagementPage />} />
            </Routes>
          </main>

          {/* Minimal Footer */}
          <footer className="bg-[#1f2937] border-t border-zinc-700/50 px-4 md:px-8 py-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Left side - Logo & Brand */}
              <div className="flex items-center gap-3">
                <img src="/ezon.png" alt="E-Zone Logo" className="w-6 h-6" />
                <span className="text-sm text-gray-300 font-medium">
                  E-Zone PlayStation Cafe
                </span>
              </div>

              {/* Center - Quick Info */}
              <div className="hidden md:flex items-center gap-6 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Gaming Center
                </span>
                <span>•</span>
                <span>PS3 • PS4 • PS5</span>
                <span>•</span>
                <span>Oyun ve Kafe Hizmetleri</span>
              </div>

              {/* Right side - Copyright */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleOpenWebsite}
                  className="text-xs text-gray-400 hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
                >
                  SİRACSOFT
                </button>
                <span className="text-xs text-gray-500">© 2025</span>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </TableProvider>
  );
}

export default App;
