# SISTEM MANAJEMEN TURNAMEN BILLIARD  
### Versi Draft Flow dan Fitur – Panitia & Developer

---

## 1. Tujuan Sistem
Sistem ini dibuat untuk membantu panitia turnamen dalam mengatur jalannya pertandingan billiard secara terstruktur dan efisien.  
Melalui sistem ini:
- PIC (wasit) dapat mencatat skor dan mengelola pertandingan langsung dari HP.  
- Admin meja depan dapat memantau seluruh meja, menugaskan pertandingan, dan memanggil peserta dengan cepat.  
- Semua hasil pertandingan otomatis tersimpan dan langsung muncul di website publik turnamen.  

---

## 2. Peran dan Tanggung Jawab

| Peran | Tanggung Jawab |
|-------|----------------|
| **Admin Meja Depan** | Menentukan meja & turnamen aktif harian, menugaskan pertandingan, memantau seluruh meja, menandai WO atau pertandingan ditunda, mengganti PIC bila diperlukan. |
| **PIC Meja (Wasit)** | Menjalankan pertandingan, mencatat skor, memastikan alur pertandingan berjalan sesuai aturan, dan dapat mengajukan permintaan pergantian setelah pertandingan selesai. |
| **Pemandu Acara** | Mendampingi admin untuk memanggil peserta ke meja sesuai informasi dari sistem. |
| **Sistem** | Menyimpan status meja, mencatat hasil pertandingan, mencatat log aktivitas, dan memperbarui website publik secara otomatis. |

---

## 3. Alur Harian Turnamen

### A. Persiapan
- Admin membuka sistem dan memilih:
  - Turnamen yang akan dimainkan hari itu (bisa lebih dari satu, misalnya Single dan Double).  
  - Meja yang digunakan hari itu (jumlah meja dinamis).  
- Sistem menyimpan pengaturan tersebut dalam *session harian* dan menampilkan daftar meja aktif di dashboard admin.

### B. PIC Login ke Meja
- PIC membuka halaman sistem di HP.
- Memilih nama dari daftar PIC yang sudah terdaftar.  
- Memilih meja yang aktif untuk bertugas.  
- Setelah terhubung, meja tersebut berstatus “Aktif” di dashboard admin.  

Jika PIC ingin pindah meja:
- PIC harus keluar (logout) terlebih dahulu dari meja sebelumnya.  
- Meja tersebut akan berstatus “Tanpa PIC” sampai digantikan.

### C. Admin Menugaskan Pertandingan
- Admin memilih pertandingan yang siap dimainkan dari daftar jadwal (status pending).  
- Admin menugaskannya ke meja tertentu.  
- Pertandingan otomatis muncul di layar HP PIC meja tersebut.  
- Admin kemudian memanggil tim ke meja melalui MC/pemandu acara.  

### D. PIC Menjalankan Pertandingan
PIC mengelola jalannya pertandingan dari HP dengan tahapan tombol manual:
1. Mulai Pemanasan (5 menit).  
2. Mulai Game 1 (15 menit).  
3. Selesai Game 1.  
4. Mulai Game 2.  
5. Selesai Pertandingan.  

Selama pertandingan berlangsung:
- Data skor dicatat ke tabel sementara (`match_sessions_temp`).  
- Setelah selesai, PIC menekan **“Selesai Pertandingan”**.  
- Sistem memindahkan hasil ke tabel utama (`matches`), dan website publik otomatis menampilkan hasil pertandingan.

### E. Pergantian PIC
- Jika PIC ingin istirahat setelah pertandingan, tekan tombol **“Minta diganti setelah match ini”**.  
- Sistem mencatat permintaan tersebut dan memberi tanda di dashboard admin.  
- Setelah pertandingan selesai, meja otomatis berstatus “Butuh PIC Baru”.  
- Admin menugaskan PIC pengganti dari daftar PIC yang tersedia.  

### F. Monitoring Admin
Dashboard admin menampilkan seluruh status meja secara real-time (polling setiap 5–10 detik):
- Siapa PIC di setiap meja.  
- Pertandingan yang sedang berlangsung.  
- Hasil pertandingan yang sudah selesai.  
- Meja yang butuh PIC baru atau kosong.  

Contoh tampilan:

Meja | PIC | Status | Pertandingan
-- | -- | -- | --
1 | Andi | Sedang Bermain | Tim A vs Tim B
2 | Budi | Selesai (Tim C menang) | -
3 | - | Butuh PIC Baru | -


---

## 4. Penjadwalan, WO, dan Pertandingan Pengganti

### A. Tim Tidak Hadir
- Jika tim tidak hadir saat dipanggil, admin mencatat waktu panggilan pertama.  
- Tim diberi waktu tunggu maksimal **10 menit**.  
- Jika belum datang setelah 10 menit:
  - Pertandingan ditandai **WO (Walkover)**.  
  - Lawan otomatis menang.  
- Jika tim datang sebelum waktu habis, pertandingan tetap dijalankan.

### B. Permintaan Jadwal Ulang
- Tim yang sudah memberi konfirmasi tidak bisa hadir pada jam tertentu dapat dijadwal ulang.  
- Admin menandai pertandingan sebagai **Ditunda**.  
- Admin dapat menggantikan slot tersebut dengan pertandingan lain dari grup yang sudah siap.  
- Pertandingan ditunda akan kembali dimainkan di akhir antrean grup.

### C. Penggantian Pertandingan (Next Match)
- Jika meja sudah kosong tapi pertandingan berikutnya belum siap (tim belum hadir), admin bisa:
  - Menugaskan pertandingan lain dari grup yang sudah siap.  
- Hal ini tidak memengaruhi struktur grup karena masih tahap penyisihan.  

---

## 5. Log Aktivitas

Sistem mencatat semua kegiatan untuk keperluan audit dan evaluasi.

### A. Log Admin
- Menugaskan pertandingan.  
- Menandai WO atau tunda.  
- Mengubah skor (jika diperlukan).  
- Mengganti PIC.  

### B. Log PIC
- Login/Logout meja.  
- Mulai dan menyelesaikan pertandingan.  
- Input skor.  
- Permintaan ganti setelah pertandingan.  

Log disimpan dengan waktu, nama, dan meja terkait.

---

## 6. Mekanisme Sistem

- Sistem menggunakan **polling otomatis setiap 5–10 detik** untuk memperbarui status.  
- Tidak memerlukan koneksi internet cepat atau stabil.  
- Semua hasil pertandingan otomatis diperbarui di website publik begitu pertandingan selesai.  
- Data selama pertandingan berlangsung tetap tersimpan di tabel sementara (`match_sessions_temp`) agar tidak mengubah hasil publik sebelum pertandingan benar-benar selesai.

---

## 7. Struktur Data (Tabel Tambahan)

| Tabel | Fungsi |
|--------|--------|
| `pics` | Daftar PIC (wasit) resmi yang dapat dipilih di sistem. |
| `table_status` | Status setiap meja (PIC, pertandingan aktif, kondisi meja). |
| `match_sessions_temp` | Penyimpanan sementara data pertandingan sebelum selesai. |
| `pic_change_requests` | Catatan PIC yang meminta pergantian setelah pertandingan. |
| `tournament_day_sessions` | Pengaturan harian: meja aktif & turnamen aktif. |
| `activity_logs` | Catatan aktivitas PIC dan admin (audit log). |

---

## 8. Ringkasan Flow Utama

1. Admin menentukan turnamen dan meja aktif hari itu.  
2. PIC login ke meja masing-masing.  
3. Admin menugaskan pertandingan ke meja.  
4. PIC menjalankan pertandingan dan mencatat skor.  
5. Setelah pertandingan selesai, sistem memperbarui hasil ke website publik.  
6. Meja siap digunakan untuk pertandingan berikutnya.  
7. Jika PIC minta diganti, admin menugaskan PIC baru.  
8. Admin dan pemandu acara memantau seluruh meja dari dashboard utama.

---

## 9. Ringkasan Kasus Lapangan

| Situasi | Waktu Tunggu / Kondisi | Tindakan | Dampak |
|----------|------------------------|-----------|--------|
| Tim tidak hadir tanpa kabar | Maks. 10 menit | Tandai WO (lawan menang) | Pertandingan selesai |
| Tim minta jadwal ulang | - | Tandai Ditunda, pindah ke antrean belakang | Tidak ganggu grup |
| Meja kosong, tim belum siap | - | Mainkan pertandingan lain dari grup | Meja tetap aktif |
| PIC ingin istirahat | Setelah match selesai | Admin ganti PIC | Meja tetap bisa lanjut |
| Koneksi internet terganggu | - | Data disimpan sementara, dikirim saat koneksi kembali | Aman dari kehilangan data |

---

## 10. Tujuan Akhir
- Tidak ada meja yang menganggur.  
- Semua hasil pertandingan tercatat otomatis dan transparan.  
- Admin dan PIC memiliki alur kerja yang jelas dan efisien.  
- Data real-time dan website publik selalu sinkron.  
- Panitia bisa fokus ke jalannya turnamen tanpa repot pencatatan manual.

---

## 11. Rencana Pengembangan (Developer View)

| Fitur | Deskripsi | Status |
|--------|------------|---------|
| Konfigurasi harian (turnamen & meja aktif) | Menentukan meja & turnamen yang digunakan hari itu. | Baru |
| Login PIC tanpa akun | Pemilihan PIC dari daftar yang sudah terdaftar. | Baru |
| Dashboard admin dinamis | Menampilkan semua meja aktif dan statusnya. | Baru |
| Match assignment & control | Admin menugaskan match ke meja tertentu. | Baru |
| Input skor via HP PIC | Pencatatan skor selama pertandingan. | Baru |
| Sinkronisasi website publik | Update otomatis setelah pertandingan selesai. | Sudah ada |
| Log aktivitas admin & PIC | Catatan semua perubahan dan aksi di sistem. | Baru |
| Pengelolaan WO, Tunda, dan Jadwal Ulang | Aksi cepat untuk kasus lapangan. | Baru |
| Ganti PIC setelah match | Fitur permintaan dan penggantian PIC. | Baru |

---

## 12. Kesimpulan
Sistem ini dirancang untuk memudahkan koordinasi antara admin meja depan dan PIC meja di lapangan.  
Dengan mekanisme polling ringan, log aktivitas lengkap, dan update otomatis ke website publik, turnamen dapat berjalan lebih cepat, terpantau, dan tertib tanpa kehilangan fleksibilitas operasional di lapangan.
