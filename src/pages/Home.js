import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Home = () => {
    return (
        <Layout>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Selamat Datang di WhatsApp QR Absensi
                </h1>
                <p className="text-gray-600 mb-6">
                    Gunakan sistem ini untuk melakukan absensi dengan QR Code secara mudah dan cepat.
                </p>

                <div className="flex flex-col gap-4 w-full">
                    <Link to="/absensi">
                        <button className="w-full bg-green-500 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-600 transition">
                            Absensi
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="w-full bg-gray-500 text-white py-3 rounded-md text-lg font-semibold hover:bg-gray-600 transition">
                            Register User
                        </button>
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default Home;