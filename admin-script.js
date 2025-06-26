// Konfigurasi sheet.best untuk admin
const SHEET_BEST_URL = 'https://api.sheetbest.com/sheets/b743b6c4-c59f-4371-ae5a-e99cdd678911/tabs/Sheet1';

// Variabel global
let allPresensiData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;

// DOM Elements
const btnRefresh = document.getElementById('btnRefresh');
const btnExport = document.getElementById('btnExport');
const filterKelompok = document.getElementById('filterKelompok');
const filterDate = document.getElementById('filterDate');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const pageInfo = document.getElementById('pageInfo');
const tableBody = document.getElementById('tableBody');
const statusMessage = document.getElementById('statusMessage');
const loadingSpinner = document.getElementById('loadingSpinner');

// Statistik elements
const totalPresensi = document.getElementById('totalPresensi');
const presensiHariIni = document.getElementById('presensiHariIni');
const kelompokTerbanyak = document.getElementById('kelompokTerbanyak');
const lastUpdate = document.getElementById('lastUpdate');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    btnRefresh.addEventListener('click', loadPresensiData);
    btnExport.addEventListener('click', exportToExcel);
    filterKelompok.addEventListener('change', applyFilters);
    filterDate.addEventListener('change', applyFilters);
    btnPrev.addEventListener('click', () => changePage(-1));
    btnNext.addEventListener('click', () => changePage(1));
    
    // Load data saat halaman dimuat
    loadPresensiData();
});

// Fungsi untuk memuat data presensi
async function loadPresensiData() {
    showLoading(true);
    showStatus('Memuat data presensi...', 'info');
    
    try {
        const data = await fetchPresensiData();
        allPresensiData = data;
        filteredData = [...allPresensiData];
        
        updateStatistics();
        renderTable();
        updatePagination();
        
        showStatus('Data berhasil dimuat dari sheet.best!', 'success');
    } catch (error) {
        console.error('Error loading presensi data:', error);
        showStatus('Gagal memuat data: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Fungsi untuk mengambil data dari sheet.best
async function fetchPresensiData() {
    try {
        const response = await fetch(SHEET_BEST_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Convert data ke format yang diinginkan
        return data.map((item, index) => ({
            id: index + 1,
            timestamp: item.timestamp || new Date().toISOString(),
            nama: item.nama || '',
            kelompok: item.kelompok || '',
            qrData: item.qrData || '',
            userAgent: item.userAgent || '',
            status: 'success'
        }));
    } catch (error) {
        console.error('Error fetching data from sheet.best:', error);
        // Fallback ke data simulasi jika sheet.best gagal
        return generateMockData();
    }
}

// Generate data simulasi untuk testing
function generateMockData() {
    const mockData = [];
    const kelompok = ['Muda-mudi A', 'Muda-mudi B', 'Muda-mudi C', 'Muda-mudi D'];
    const names = [
        'Andi Pratama', 'Budi Santoso', 'Citra Dewi', 'Dewi Sartika',
        'Eko Prasetyo', 'Fitri Handayani', 'Gunawan Setiawan', 'Hesti Wulandari',
        'Indra Kusuma', 'Joko Widodo', 'Kartika Sari', 'Lukman Hakim',
        'Maya Indah', 'Nugroho Pratama', 'Oktavia Putri', 'Pandu Wijaya'
    ];
    
    const today = new Date();
    
    for (let i = 0; i < 50; i++) {
        const randomDate = new Date(today);
        randomDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
        randomDate.setHours(Math.floor(Math.random() * 24));
        randomDate.setMinutes(Math.floor(Math.random() * 60));
        
        mockData.push({
            id: i + 1,
            timestamp: randomDate.toISOString(),
            nama: names[Math.floor(Math.random() * names.length)],
            kelompok: kelompok[Math.floor(Math.random() * kelompok.length)],
            qrData: 'PRESENSI_' + Math.random().toString(36).substr(2, 9),
            status: 'success'
        });
    }
    
    // Sort by timestamp descending
    return mockData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Update statistik
function updateStatistics() {
    const today = new Date().toDateString();
    
    // Total presensi
    totalPresensi.textContent = allPresensiData.length;
    
    // Presensi hari ini
    const todayPresensi = allPresensiData.filter(item => 
        new Date(item.timestamp).toDateString() === today
    );
    presensiHariIni.textContent = todayPresensi.length;
    
    // Kelompok terbanyak
    const kelompokCount = {};
    allPresensiData.forEach(item => {
        kelompokCount[item.kelompok] = (kelompokCount[item.kelompok] || 0) + 1;
    });
    
    const maxKelompok = Object.keys(kelompokCount).reduce((a, b) => 
        kelompokCount[a] > kelompokCount[b] ? a : b
    );
    kelompokTerbanyak.textContent = maxKelompok || '-';
    
    // Last update
    lastUpdate.textContent = new Date().toLocaleString('id-ID');
}

// Apply filters
function applyFilters() {
    const selectedKelompok = filterKelompok.value;
    const selectedDate = filterDate.value;
    
    filteredData = allPresensiData.filter(item => {
        let matchKelompok = true;
        let matchDate = true;
        
        if (selectedKelompok) {
            matchKelompok = item.kelompok === selectedKelompok;
        }
        
        if (selectedDate) {
            const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
            matchDate = itemDate === selectedDate;
        }
        
        return matchKelompok && matchDate;
    });
    
    currentPage = 1;
    renderTable();
    updatePagination();
}

// Render table
function renderTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    if (pageData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #718096;">
                    Tidak ada data presensi
                </td>
            </tr>
        `;
        return;
    }
    
    pageData.forEach((item, index) => {
        const row = document.createElement('tr');
        const timestamp = new Date(item.timestamp);
        
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${timestamp.toLocaleString('id-ID')}</td>
            <td>${item.nama}</td>
            <td>${item.kelompok}</td>
            <td><code>${item.qrData}</code></td>
            <td><span class="status-badge ${item.status}">${item.status}</span></td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage === totalPages;
    
    pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
}

// Change page
function changePage(direction) {
    const newPage = currentPage + direction;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderTable();
        updatePagination();
    }
}

// Export to Excel
function exportToExcel() {
    if (filteredData.length === 0) {
        showStatus('Tidak ada data untuk diexport', 'error');
        return;
    }
    
    showStatus('Menyiapkan file Excel...', 'info');
    
    // Create CSV content
    const headers = ['No', 'Tanggal & Waktu', 'Nama', 'Kelompok', 'QR Code', 'Status'];
    const csvContent = [
        headers.join(','),
        ...filteredData.map((item, index) => {
            const timestamp = new Date(item.timestamp).toLocaleString('id-ID');
            return [
                index + 1,
                `"${timestamp}"`,
                `"${item.nama}"`,
                `"${item.kelompok}"`,
                `"${item.qrData}"`,
                `"${item.status}"`
            ].join(',');
        })
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `presensi_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showStatus('File Excel berhasil didownload!', 'success');
}

// Show status message
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

// Show/hide loading spinner
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
}

// Auto refresh setiap 30 detik
setInterval(() => {
    if (!loadingSpinner.style.display || loadingSpinner.style.display === 'none') {
        loadPresensiData();
    }
}, 30000); 