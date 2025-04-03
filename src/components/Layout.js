import React from "react";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <header className="bg-blue-600 text-white py-4 text-center text-lg font-semibold">
                WhatsApp QR Absensi
            </header>

            {/* Konten utama */}
            <main className="flex-grow flex items-center justify-center p-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center py-3 mt-auto">
                © 2025 WhatsApp QR Absensi - All Rights Reserved
            </footer>
        </div>
    );
};

export default Layout;