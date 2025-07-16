# Log Perubahan

Semua perubahan penting pada proyek ini akan didokumentasikan dalam file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-07-16

### 🎯 BREAKING CHANGES - One Device, One User Model

### Ditambahkan

- 👤 **Arsitektur One Device, One User**

  - Model pengguna yang disederhanakan: satu pengguna aktif per perangkat
  - Manajemen sesi pengguna yang lebih mudah dan aman
  - Interface yang dibersihkan tanpa kompleksitas switching pengguna
  - Isolasi data otomatis per pengguna dengan storage keys

- 🔧 **SSR-Safe LocalStorage Hooks**

  - Hook `useLocalStorageSSR` custom untuk mencegah hydration mismatch
  - State loading non-blocking yang tidak menghalangi interaksi UI
  - Pattern useRef untuk dependencies yang stabil
  - Type safety penuh dengan TypeScript generics

- 🎛️ **Manajemen Pengguna yang Disederhanakan**

  - Komponen user management yang diperbaharui
  - Fungsionalitas logout yang bersih
  - Opsi "Hapus & Reset Data" untuk memulai fresh
  - Welcome screen yang user-friendly untuk pengguna baru

- 📊 **Peningkatan Loading States**
  - Loading states yang tidak memblokir UI
  - Dashboard langsung muncul dengan data kosong
  - Progressive data loading untuk user experience yang lebih baik
  - Proper loading indicators di semua komponen

### Diperbaiki

- 🚫 **Hydration Errors**

  - Resolved React hydration mismatches antara server dan client
  - SSR-safe localStorage access dengan proper client-side checks
  - Stable rendering antara server dan client
  - Eliminasi "Text content does not match" errors

- 🔄 **Infinite Re-render Loops**

  - Fixed "Maximum update depth exceeded" errors
  - Stable dependencies menggunakan useRef pattern
  - Proper effect cleanup dan dependency management
  - Optimized re-rendering performance

- ⏳ **User Creation Flow Issues**
  - Resolved stuck loading screens saat membuat pengguna baru
  - Immediate navigation ke dashboard setelah user creation
  - Simplified loading logic yang prioritaskan user experience
  - Eliminated refresh requirements untuk akses dashboard

### Dihapus

- ❌ **Multi-User Support**

  - Dihapus kemampuan untuk switch antara multiple users
  - User list management tidak lagi diperlukan
  - Simplified interface tanpa user switching complexity
  - Fokus pada single user experience yang optimal

- 🗂️ **Complex User Management**
  - Dihapus dropdown user selection
  - Simplified user creation process
  - Removed user switching dialogs
  - Streamlined user management UI

### Teknis

- 🏗️ **Arsitektur yang Diperbaiki**

  - Hook-based state management yang lebih robust
  - Separation of concerns yang lebih baik
  - Component isolation dan modularity
  - Predictable state management

- 📈 **Performance Optimizations**

  - Reduced localStorage operations
  - Memoized expensive calculations
  - Stable component references
  - Optimized rendering cycles

- 📚 **Dokumentasi Lengkap**
  - README yang completely rewritten
  - TECHNICAL.md untuk developer documentation
  - Architecture overview dan implementation details
  - Troubleshooting guide dan best practices

## [0.2.0] - 2025-07-15

### Ditambahkan

- 🎯 **Manajemen Tujuan Keuangan**
  - Buat dan lacak tujuan keuangan dengan deadline
  - Berbagai kategori tujuan (Dana Darurat, Liburan, Rumah, dll.)
  - Pelacakan progres visual dengan progress bar
  - Peringatan deadline untuk tujuan yang terlambat dan akan datang
- 💳 **Sistem Manajemen Anggaran**
  - Pengaturan anggaran bulanan berdasarkan kategori
  - Pelacakan anggaran real-time dan peringatan
  - Indikator visual untuk kinerja anggaran (hijau/kuning/merah)
  - Ikhtisar anggaran dengan total, terpakai, dan sisa jumlah
- 📁 **Fungsionalitas Import/Export**
  - Import CSV dengan validasi data dan preview
  - Unduh template CSV untuk format yang tepat
  - Fungsionalitas export yang ditingkatkan
  - Penanganan error untuk proses import
- 📊 **Analitik yang Ditingkatkan**
  - Berbagai jenis grafik (Bar, Line, Pie charts)
  - Metrik kesehatan keuangan (tingkat tabungan, rasio pengeluaran)
  - Rincian kategori detail dengan persentase
  - Analisis tren arus kas bulanan
- ✨ **Peningkatan Transaksi**
  - Fungsionalitas edit transaksi
  - Dukungan transaksi berulang (mingguan, bulanan, tahunan)
  - Tag transaksi khusus
  - Form transaksi yang ditingkatkan dengan validasi

### Diperbaiki

- 🎨 **Peningkatan UI/UX**
  - Navigasi 6-tab (Overview, Transactions, Budget, Goals, Analytics, Import/Export)
  - Peningkatan desain responsif
  - Indikator visual dan kode warna yang lebih baik
  - Form modal dengan pengalaman pengguna yang ditingkatkan
- 🏗️ **Kualitas Kode**
  - Perbaikan masalah TypeScript di komponen chart
  - Pembersihan komponen UI yang tidak terpakai (menghapus 25 file yang tidak terpakai)
  - Definisi tipe yang ditingkatkan untuk Transaction, Budget, FinancialGoal
  - Arsitektur komponen modular

### Teknis

- Update ke Next.js 15.2.4
- Implementasi direktif 'use client' untuk komponen client-side
- Komponen chart yang ditingkatkan menggunakan Recharts
- Peningkatan type safety TypeScript

## [0.1.0] - 2025-01-15

### Ditambahkan

- 🚀 **Rilis Awal**
  - Manajemen transaksi dasar (tambah, hapus, daftar)
  - Pelacakan pendapatan vs pengeluaran
  - Visualisasi arus kas bulanan
  - Rincian kategori sederhana
  - Fungsionalitas export CSV
  - Filter rentang tanggal
  - Desain responsif dengan Tailwind CSS

### Teknis

- Setup framework Next.js 15
- Konfigurasi TypeScript
- Styling Tailwind CSS
- Komponen Radix UI
- Visualisasi chart dasar dengan Recharts
- Penanganan tanggal dengan date-fns

---

## Ringkasan Riwayat Versi

- **v0.2.0** - Ekspansi fitur utama dengan manajemen anggaran, tujuan keuangan, analitik, dan import/export
- **v0.1.0** - MVP awal dengan manajemen transaksi dasar dan visualisasi

## Fitur yang Akan Datang

### Direncanakan untuk v0.3.0

- 🔄 **Otomasi Transaksi Berulang**
  - Generasi otomatis transaksi berulang
  - Dashboard manajemen transaksi berulang
- 🏦 **Manajemen Akun**
  - Dukungan multi-akun (Checking, Savings, Credit Cards)
  - Pelacakan saldo akun
  - Transfer antar akun
- 📱 **Peningkatan Mobile**
  - Dukungan Progressive Web App (PWA)
  - Interface yang dioptimalkan untuk mobile
  - Fungsionalitas offline
- 🔔 **Notifikasi & Peringatan**
  - Peringatan pengeluaran berlebihan anggaran
  - Pengingat deadline tujuan
  - Laporan ringkasan bulanan
- 🌙 **Tema & Kustomisasi**
  - Dukungan dark mode
  - Kategori yang dapat dikustomisasi
  - Pemilihan mata uang

### Roadmap Jangka Panjang

- Integrasi akun bank
- Pelacakan investasi
- Pelaporan lanjutan
- Dukungan multi-user
- Sinkronisasi data
- Pengembangan aplikasi mobile

---

## Berkontribusi

Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk detail tentang cara berkontribusi ke proyek ini.

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.
