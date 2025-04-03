import { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [nomorWa, setNomorWa] = useState("");
    const [kodeUnik, setKodeUnik] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);
    const [isCameraStarted, setIsCameraStarted] = useState(false);

    // Fungsi untuk menangani unggahan gambar QR Code
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            setMessage("Harap unggah gambar QR Code terlebih dahulu.");
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        try {
            // Proses gambar QR Code untuk mengekstrak kode unik
            const qrResult = await QrScanner.scanImage(imageUrl, { returnDetailedScanResult: true });
            if (qrResult) {
                console.log("Hasil QR dari unggahan:", qrResult);
                processQrCode(qrResult.data);
            }
        } catch (error) {
            console.error("Error saat membaca QR Code dari gambar:", error);  // Log error
            setMessage("Gagal membaca QR Code. Pastikan gambar jelas!");
        }
    };

    // Fungsi untuk mulai memindai QR Code menggunakan kamera
    const startScanning = () => {
        if (qrScannerRef.current) {
            qrScannerRef.current.stop();
        }

        // Membuat instansi baru QrScanner dengan elemen video
        qrScannerRef.current = new QrScanner(videoRef.current, (result) => {
            console.log("Hasil QR dari kamera:", result);  // Log debug
            processQrCode(result.data);
        });

        // Mulai pemindai dengan elemen video
        qrScannerRef.current.start().catch((error) => {
            console.error("Error mengakses kamera:", error);  // Log error
            setMessage("Gagal mengakses kamera. Pastikan perangkat memiliki akses ke kamera.");
        });

        setIsCameraStarted(true);
    };

    // Fungsi untuk menangkap gambar dari video dan memprosesnya
    const captureImageFromCamera = async () => {
        if (!videoRef.current) {
            setMessage("Video kamera tidak ditemukan.");
            return;
        }

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Mengambil frame dari video
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Mengonversi gambar ke URL dan memprosesnya dengan QrScanner
        const imageUrl = canvas.toDataURL("image/png");
        try {
            const qrResult = await QrScanner.scanImage(imageUrl, { returnDetailedScanResult: true });
            if (qrResult) {
                console.log("Hasil QR dari gambar kamera:", qrResult);
                processQrCode(qrResult.data);
            }
        } catch (error) {
            console.error("Error saat membaca QR Code dari gambar kamera:", error);
            setMessage("Gagal membaca QR Code dari gambar kamera.");
        }
    };

    // Fungsi untuk memproses dan mengekstrak kode unik dari QR Code
    const processQrCode = (qrLink) => {
        if (qrLink) {
            console.log("Link QR yang diekstrak:", qrLink);
            const extractedKodeUnik = qrLink.split("/").pop();

            if (qrLink.startsWith("https://wa.me/qr/") && extractedKodeUnik) {
                setKodeUnik(extractedKodeUnik);
                setMessage("QR Code valid!");
                console.log("QR Code valid!");
            } else {
                setMessage("QR Code tidak valid. Pastikan format QR Code benar.");
                console.log("QR Code tidak valid, format salah");
            }
        } else {
            setMessage("QR Code tidak valid. Pastikan format QR Code benar.");
            console.log("Data QR Code tidak valid");
        }
    };

    // Fungsi untuk menangani registrasi pengguna
    const handleRegister = async () => {
        if (!kodeUnik || !nomorWa) {
            setMessage("Harap lengkapi Nomor WhatsApp dan Kode Unik terlebih dahulu!");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/api/users/register",
                {
                    kodeUnik: kodeUnik,
                    nomorWa: nomorWa
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log(response.data);
            navigate("/home");
        } catch (error) {
            console.error("Error registrasi:", error);
            setMessage("Gagal registrasi: " + (error.response?.data || "Server error"));
        }
    };

    useEffect(() => {
        // Cek apakah browser mendukung akses kamera
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setMessage("Browser ini tidak mendukung akses kamera.");
            return;
        }
    }, []);

    return (
        <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Registrasi</h2>

            {/* Input untuk Nomor WhatsApp */}
            <input
                type="text"
                placeholder="Nomor WhatsApp"
                className="border p-2 w-full mb-3"
                value={nomorWa}
                onChange={(e) => setNomorWa(e.target.value)}
            />

            {/* Input untuk Kode Unik (diisi otomatis setelah pemindaian QR) */}
            <input
                type="text"
                placeholder="Kode Unik"
                className="border p-2 w-full mb-3"
                value={kodeUnik}
                readOnly
            />

            {/* Unggah Gambar QR Code */}
            <label className="block mb-3">Unggah QR Code</label>
            <input
                type="file"
                accept="image/*"
                className="border p-2 w-full mb-3"
                onChange={handleImageUpload}
            />

            {/* Tombol untuk Memindai QR Code dari Kamera */}
            <button
                onClick={startScanning}
                className="bg-green-500 text-white p-2 w-full rounded-md mb-3"
            >
                Pindai QR Code dari Kamera
            </button>

            {/* Tombol untuk mengambil gambar dari video */}
            {isCameraStarted && (
                <button
                    onClick={captureImageFromCamera}
                    className="bg-yellow-500 text-white p-2 w-full rounded-md mb-3"
                >
                    Ambil Gambar QR Code
                </button>
            )}

            {/* Elemen video untuk memindai QR Code menggunakan kamera */}
            <div className="mb-3">
                <video ref={videoRef} className="w-full h-64 border" />
            </div>

            {/* Tombol Registrasi */}
            <button
                onClick={handleRegister}
                className="bg-blue-500 text-white p-2 w-full rounded-md"
            >
                Daftar
            </button>

            {/* Tampilan Pesan */}
            {message && <p className="mt-3 text-center text-red-500">{message}</p>}
        </div>
    );
};

export default Register;