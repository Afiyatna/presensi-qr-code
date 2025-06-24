// Google Apps Script untuk Presensi Online
// Paste kode ini ke Google Apps Script Editor

// ID Google Spreadsheet - Ganti dengan ID spreadsheet Anda
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Presensi';

// Fungsi untuk menangani request POST (menerima data presensi)
function doPost(e) {
  try {
    // Parse JSON data dari request
    const data = JSON.parse(e.postData.contents);
    
    // Validasi data yang diperlukan
    if (!data.nama || !data.kelompok || !data.qrData) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Data tidak lengkap'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Simpan data ke spreadsheet
    const result = savePresensiData(data);
    
    if (result.success) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: 'Presensi berhasil dicatat',
          data: result.data
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: result.message
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fungsi untuk menangani request GET (mengambil data presensi)
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getData') {
      const data = getPresensiData();
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          data: data
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Action tidak valid'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fungsi untuk menyimpan data presensi ke spreadsheet
function savePresensiData(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Jika sheet belum ada, buat sheet baru
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Buat header
      sheet.getRange(1, 1, 1, 6).setValues([
        ['ID', 'Timestamp', 'Nama', 'Kelompok', 'QR Code', 'User Agent']
      ]);
      // Format header
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
    }
    
    // Generate ID unik
    const id = Date.now().toString();
    
    // Format timestamp
    const timestamp = new Date(data.timestamp || new Date()).toLocaleString('id-ID');
    
    // Siapkan data untuk disimpan
    const rowData = [
      id,
      timestamp,
      data.nama,
      data.kelompok,
      data.qrData,
      data.userAgent || ''
    ];
    
    // Tambahkan data ke sheet
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, 1, 6).setValues([rowData]);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 6);
    
    return {
      success: true,
      data: {
        id: id,
        timestamp: timestamp,
        nama: data.nama,
        kelompok: data.kelompok,
        qrData: data.qrData
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Gagal menyimpan data: ' + error.toString()
    };
  }
}

// Fungsi untuk mengambil data presensi dari spreadsheet
function getPresensiData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return [];
    }
    
    // Ambil semua data kecuali header
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return [];
    }
    
    // Convert data ke format yang diinginkan
    const presensiData = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      presensiData.push({
        id: row[0],
        timestamp: row[1],
        nama: row[2],
        kelompok: row[3],
        qrData: row[4],
        userAgent: row[5],
        status: 'success'
      });
    }
    
    return presensiData;
    
  } catch (error) {
    console.error('Error getting presensi data:', error);
    return [];
  }
}

// Fungsi untuk setup spreadsheet (jalankan sekali untuk setup awal)
function setupSpreadsheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Jika sheet sudah ada, hapus dan buat ulang
    if (sheet) {
      spreadsheet.deleteSheet(sheet);
    }
    
    // Buat sheet baru
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    
    // Buat header
    const headers = ['ID', 'Timestamp', 'Nama', 'Kelompok', 'QR Code', 'User Agent'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setHorizontalAlignment('center');
    
    // Set column widths
    sheet.setColumnWidth(1, 100); // ID
    sheet.setColumnWidth(2, 150); // Timestamp
    sheet.setColumnWidth(3, 200); // Nama
    sheet.setColumnWidth(4, 120); // Kelompok
    sheet.setColumnWidth(5, 150); // QR Code
    sheet.setColumnWidth(6, 300); // User Agent
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    console.log('Spreadsheet berhasil disetup!');
    
  } catch (error) {
    console.error('Error setting up spreadsheet:', error);
  }
}

// Fungsi untuk generate QR Code test (untuk testing)
function generateTestQRCode() {
  const testData = {
    nama: 'Test User',
    kelompok: 'Muda-mudi A',
    qrData: 'TEST_QR_' + Date.now(),
    timestamp: new Date().toISOString(),
    userAgent: 'Test Browser'
  };
  
  const result = savePresensiData(testData);
  console.log('Test QR Code result:', result);
  return result;
}

// Fungsi untuk membersihkan data lama (hapus data lebih dari 30 hari)
function cleanupOldData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    let rowsToDelete = [];
    
    for (let i = data.length - 1; i > 0; i--) { // Start from bottom, skip header
      const timestamp = new Date(data[i][1]);
      if (timestamp < thirtyDaysAgo) {
        rowsToDelete.push(i + 1); // +1 because sheet rows are 1-indexed
      }
    }
    
    // Delete rows in reverse order to maintain indices
    for (let i = rowsToDelete.length - 1; i >= 0; i--) {
      sheet.deleteRow(rowsToDelete[i]);
    }
    
    console.log(`Deleted ${rowsToDelete.length} old records`);
    
  } catch (error) {
    console.error('Error cleaning up old data:', error);
  }
}

// Trigger untuk auto-cleanup setiap minggu
function createCleanupTrigger() {
  ScriptApp.newTrigger('cleanupOldData')
    .timeBased()
    .everyWeeks(1)
    .create();
} 