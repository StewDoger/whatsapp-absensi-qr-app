const API_URL = "http://localhost:8080/api/attendance";

export const scanQR = async (qrCode) => {
    const response = await fetch(`${API_URL}/scan_qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode }),
    });
    return response.json();
};
