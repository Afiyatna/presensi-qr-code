// Konfigurasi Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzj2gctKXDm7MotPwvZM2a1sbFCYDeBkTCYegdF7arqBciUdLZkfltpkwFK7_klTsQE/exec'; // Ganti dengan URL Google Apps Script Anda

// Variabel global
let html5QrcodeScanner;
let isScanning = false;

// DOM Elements
const btnStartScan = document.getElementById('btnStartScan');
const btnStopScan = document.getElementById('btnStopScan');
const btnSubmit = document.getElementById('btnSubmit');
const qrDataInput = document.getElementById('qrData');
const formPresensi = document.getElementById('formPresensi');
const statusMessage = document.getElementById('statusMessage');
const loadingSpinner = document.getElementById('loadingSpinner');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    btnStartScan.addEventListener('click', startQRScanner);
    btnStopScan.addEventListener('click', stopQRScanner);
    formPresensi.addEventListener('submit', handleFormSubmit);
    
    // Cek apakah browser mendukung kamera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showStatus('Browser Anda tidak mendukung akses kamera', 'error');
        btnStartScan.disabled = true;
    }
});

// Fungsi untuk memulai QR Scanner
function startQRScanner() {
    if (isScanning) return;
    
    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };
    
    html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        config,
        false
    );
    
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    
    btnStartScan.style.display = 'none';
    btnStopScan.style.display = 'block';
    isScanning = true;
    
    showStatus('Scanner QR Code aktif. Arahkan kamera ke QR Code', 'info');
}

// Fungsi untuk menghentikan QR Scanner
function stopQRScanner() {
    if (html5QrcodeScanner && isScanning) {
        html5QrcodeScanner.clear();
        isScanning = false;
    }
    
    btnStartScan.style.display = 'block';
    btnStopScan.style.display = 'none';
    
    showStatus('Scanner QR Code dihentikan', 'info');
}

// Callback ketika QR Code berhasil di-scan
function onScanSuccess(decodedText, decodedResult) {
    console.log('QR Code terdeteksi:', decodedText);
    
    // Validasi format QR Code (bisa disesuaikan dengan kebutuhan)
    if (isValidQRData(decodedText)) {
        qrDataInput.value = decodedText;
        btnSubmit.disabled = false;
        
        showStatus('QR Code berhasil di-scan! Silakan isi form dan kirim presensi', 'success');
        
        // Hentikan scanner setelah berhasil
        stopQRScanner();
    } else {
        showStatus('QR Code tidak valid. Silakan scan ulang', 'error');
    }
}

// Callback ketika QR Code gagal di-scan
function onScanFailure(error) {
    // Error handling untuk scan yang gagal
    console.warn('QR Code scan gagal:', error);
}

// Validasi data QR Code
function isValidQRData(data) {
    // Contoh validasi sederhana - bisa disesuaikan dengan format QR Code Anda
    // Misalnya: QR Code berisi kode acara atau ID presensi
    return data && data.length > 0 && data.trim() !== '';
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(formPresensi);
    const presensiData = {
        nama: formData.get('nama'),
        kelompok: formData.get('kelompok'),
        qrData: formData.get('qrData'),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    // Validasi data
    if (!presensiData.nama || !presensiData.kelompok || !presensiData.qrData) {
        showStatus('Mohon lengkapi semua data', 'error');
        return;
    }
    
    // Tampilkan loading
    showLoading(true);
    showStatus('Mengirim data presensi...', 'info');
    
    try {
        const response = await sendPresensiData(presensiData);
        
        if (response.success) {
            showStatus('Presensi berhasil dicatat!', 'success');
            resetForm();
        } else {
            showStatus('Gagal mencatat presensi: ' + response.message, 'error');
        }
    } catch (error) {
        console.error('Error sending presensi data:', error);
        showStatus('Terjadi kesalahan saat mengirim data', 'error');
    } finally {
        showLoading(false);
    }
}

// Fungsi untuk mengirim data ke Google Apps Script
async function sendPresensiData(data) {
    if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        // Simulasi response untuk testing
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            success: true,
            message: 'Data berhasil dikirim (simulasi)',
            data: data
        };
    }
    
    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error('Gagal mengirim data ke server: ' + error.message);
    }
}

// Reset form setelah berhasil
function resetForm() {
    formPresensi.reset();
    qrDataInput.value = '';
    btnSubmit.disabled = true;
}

// Fungsi untuk menampilkan status
function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    // Auto hide setelah 5 detik untuk success dan info
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'status-message';
        }, 5000);
    }
}

// Fungsi untuk menampilkan/menyembunyikan loading spinner
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
}

// Fungsi untuk generate QR Code (untuk testing)
function generateTestQRCode() {
    const testData = 'PRESENSI_' + Date.now();
    qrDataInput.value = testData;
    btnSubmit.disabled = false;
    showStatus('QR Code test berhasil di-generate!', 'success');
}

// Tambahkan tombol test untuk development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const testButton = document.createElement('button');
    testButton.textContent = 'Generate Test QR Code';
    testButton.className = 'btn-secondary';
    testButton.style.marginTop = '10px';
    testButton.onclick = generateTestQRCode;
    
    const qrScanner = document.getElementById('qrScanner');
    qrScanner.appendChild(testButton);
} 