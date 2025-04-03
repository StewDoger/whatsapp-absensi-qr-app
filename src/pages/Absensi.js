import { useState, useRef } from "react";
import QrScanner from "qr-scanner";  // Import library QR scanner
import { useNavigate } from "react-router-dom";  // Import useNavigate untuk navigasi

const Absensi = () => {
    const navigate = useNavigate();
    const [kodeUnik, setKodeUnik] = useState("");
    const [message, setMessage] = useState("");
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);
    const [isCameraStarted, setIsCameraStarted] = useState(false);

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

        qrScannerRef.current.start().catch((error) => {
            console.error("Error mengakses kamera:", error);  // Log error
            setMessage("Gagal mengakses kamera. Pastikan perangkat memiliki akses ke kamera.");
        });

        setIsCameraStarted(true);
    };

    // Fungsi untuk menangkap gambar QR Code dari kamera
    const captureImageFromCamera = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageUrl = canvas.toDataURL('image/png');
        const imgElement = new Image();
        imgElement.onload = () => {
            QrScanner.scanImage(imgElement, { returnDetailedScanResult: true })
                .then(result => {
                    console.log("Hasil QR dari gambar:", result);
                    processQrCode(result.data);
                })
                .catch(err => {
                    console.error("Error memindai QR dari gambar:", err);
                    setMessage("Gagal memindai QR Code dari gambar.");
                });
        };
        imgElement.src = imageUrl;
    };

    // Fungsi untuk memproses dan mengekstrak kode unik dari QR Code
    const processQrCode = (qrLink) => {
        if (qrLink) {
            console.log("Link QR yang diekstrak:", qrLink);
            const extractedKodeUnik = qrLink.split("/").pop();
            setKodeUnik(extractedKodeUnik);
            setMessage("QR Code berhasil dipindai!");
        } else {
            console.log("Data QR Code tidak valid");
            setMessage("QR Code tidak valid. Pastikan format QR Code benar.");
        }
    };

    // Fungsi untuk  absensi
    const handleAbsensi = async () => {
        if (!kodeUnik) {
            setMessage("Harap pindai QR Code terlebih dahulu!");
            return;
        }

        try {
            // Kirimkan permintaan absensi ke server
            const response = await fetch("http://localhost:8080/api/attendance/record", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    kodeUnik: kodeUnik,
                }),
            });
            if (response.ok) {
                setMessage("Absensi berhasil!");
                navigate("/home");
            } else {
                setMessage("Gagal absensi, coba lagi!");
            }
        } catch (error) {
            setMessage("Terjadi kesalahan, silakan coba lagi.");
            console.error("Error absensi:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Halaman Absensi</h2>

            {/* Input untuk Kode Unik (diisi otomatis setelah pemindaian QR) */}
            <input
                type="text"
                placeholder="Kode Unik"
                className="border p-2 w-full mb-3"
                value={kodeUnik}
                readOnly
            />

            {/* Tombol untuk Memindai QR Code dari Kamera */}
            <button
                onClick={startScanning}
                className="bg-green-500 text-white p-2 w-full rounded-md mb-3"
            >
                Pindai QR Code dari Kamera
            </button>

            {/* Tombol untuk menangkap gambar QR dari kamera */}
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

            {/* Tombol untuk mengirimkan absensi */}
            <button
                onClick={handleAbsensi}
                className="bg-blue-500 text-white p-2 w-full rounded-md"
            >
                Kirim Absensi
            </button>

            {/* Menampilkan pesan hasil absensi */}
            {message && <p className="mt-3 text-center">{message}</p>}
        </div>
    );
};

export default Absensi;