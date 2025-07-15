# 💰 Sistem Manajemen Arus Kas

Aplikasi manajemen keuangan pribadi yang komprehensif dibangun dengan **Next.js 15**, **TypeScript**, dan **Tailwind CSS**. Kelola pendapatan, pengeluaran, anggaran, dan tujuan keuangan Anda dalam satu tempat.

![Cashflow Management](https://img.shields.io/badge/Next.js-15.2.4-blue?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-blue?style=flat-square&logo=tailwindcss)

## 🚀 Fitur

### 📊 Manajemen Transaksi

- ✅ **Tambah, Edit, Hapus Transaksi** - Operasi CRUD lengkap untuk transaksi keuangan
- ✅ **Transaksi Berulang** - Atur pendapatan/pengeluaran berulang mingguan, bulanan, atau tahunan
- ✅ **Kategori Transaksi** - Organisir transaksi dengan kategori yang telah ditentukan
- ✅ **Tag Transaksi** - Tambahkan tag khusus untuk organisasi dan filtering yang lebih baik
- ✅ **Filter Lanjutan** - Filter berdasarkan jenis, kategori, rentang tanggal, dan istilah pencarian

### 💳 Manajemen Anggaran

- ✅ **Pengaturan Anggaran Bulanan** - Tetapkan batas pengeluaran untuk setiap kategori pengeluaran
- ✅ **Pelacakan Anggaran Real-time** - Pantau pengeluaran terhadap batas anggaran
- ✅ **Peringatan Anggaran Visual** - Peringatan berkode warna saat mendekati atau melebihi anggaran
- ✅ **Analitik Anggaran** - Ikhtisar komprehensif kinerja anggaran

### 🎯 Tujuan Keuangan

- ✅ **Pembuatan & Pelacakan Tujuan** - Tetapkan dan pantau objektif keuangan
- ✅ **Berbagai Kategori Tujuan** - Dana Darurat, Liburan, Rumah, Mobil, Pendidikan, dll.
- ✅ **Visualisasi Progres** - Bar progres visual dan persentase penyelesaian
- ✅ **Manajemen Deadline** - Lacak tenggat waktu tujuan dengan peringatan terlambat

### 📈 Analitik Lanjutan

- ✅ **Berbagai Jenis Grafik** - Grafik batang, grafik garis, dan grafik pie
- ✅ **Metrik Kesehatan Keuangan** - Tingkat tabungan, rasio pengeluaran, analitik transaksi
- ✅ **Rincian Kategori** - Analisis distribusi pendapatan/pengeluaran yang detail
- ✅ **Analisis Tren** - Tren dan pola arus kas bulanan

### 📁 Manajemen Data

- ✅ **Import/Export CSV** - Impor transaksi dari file CSV dengan validasi
- ✅ **Backup Data** - Ekspor semua data untuk backup dan analisis
- ✅ **Template Import** - Unduh template CSV untuk kemudahan import data
- ✅ **Penanganan Error** - Validasi komprehensif selama proses import

## 🛠️ Stack Teknologi

- **Framework Frontend**: Next.js 15.2.4
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **Komponen UI**: Radix UI primitives
- **Grafik**: Recharts
- **Penanganan Tanggal**: date-fns
- **Ikon**: Lucide React
- **Development**: ESLint, Prettier

## 📁 Struktur Proyek

```
cashflow-management/
├── app/
│   ├── components/
│   │   ├── transaction-form.tsx      # Form pembuatan/edit transaksi
│   │   ├── transaction-list.tsx      # Daftar transaksi dengan filter
│   │   ├── cashflow-chart.tsx        # Visualisasi grafik
│   │   ├── budget-management.tsx     # Pengaturan dan pelacakan anggaran
│   │   ├── financial-goals.tsx       # Manajemen tujuan keuangan
│   │   └── import-export.tsx         # Fungsi import/export data
│   ├── types/
│   │   └── transaction.ts            # Definisi tipe TypeScript
│   ├── utils/
│   │   └── currency.ts               # Utilitas format mata uang
│   ├── globals.css                   # Gaya global
│   ├── layout.tsx                    # Layout aplikasi
│   └── page.tsx                      # Komponen halaman utama
├── components/
│   ├── ui/                          # Komponen UI yang dapat digunakan kembali
│   └── theme-provider.tsx           # Konfigurasi tema
├── hooks/                           # Custom React hooks
├── lib/                            # Library utilitas
└── public/                         # Aset statis
```

## 🚀 Memulai

### Prasyarat

- Node.js 18+
- npm, yarn, atau pnpm package manager

### Instalasi

1. **Clone repository**

   ```bash
   git clone https://github.com/jutionck/cashflow-management.git
   cd cashflow-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Jalankan development server**

   ```bash
   npm run dev
   # atau
   yarn dev
   # atau
   pnpm dev
   ```

4. **Buka browser**
   Navigasi ke [http://localhost:3000](http://localhost:3000)

### Script yang Tersedia

- `npm run dev` - Jalankan development server
- `npm run build` - Build aplikasi production
- `npm run start` - Jalankan production server
- `npm run lint` - Jalankan ESLint untuk kualitas kode

## 📱 Panduan Penggunaan

### 1. Mengelola Transaksi

**Menambah Transaksi:**

1. Klik tombol "Add Transaction"
2. Isi detail transaksi:
   - Tanggal, Deskripsi, Jumlah
   - Jenis (Pendapatan/Pengeluaran)
   - Kategori
   - Tag (opsional)
   - Pengaturan berulang (opsional)
3. Klik "Add Transaction" untuk menyimpan

**Mengedit Transaksi:**

1. Pergi ke tab Transaksi
2. Klik ikon edit (✏️) pada transaksi manapun
3. Modifikasi detail dalam form
4. Klik "Update Transaction" untuk menyimpan perubahan

### 2. Mengatur Anggaran

**Membuat Anggaran Bulanan:**

1. Navigasi ke tab Budget
2. Klik "Set Budget"
3. Pilih kategori dan tetapkan batas bulanan
4. Sistem akan otomatis melacak pengeluaran Anda terhadap anggaran ini

**Memantau Kinerja Anggaran:**

- Hijau: Di bawah anggaran (pengeluaran baik)
- Kuning: Peringatan (80-100% anggaran terpakai)
- Merah: Melebihi anggaran (melebihi batas)

### 3. Tujuan Keuangan

**Membuat Tujuan:**

1. Pergi ke tab Goals
2. Klik "Add Goal"
3. Atur detail tujuan:
   - Judul dan deskripsi
   - Jumlah target
   - Jumlah saat ini (jika ada)
   - Deadline
   - Kategori
4. Lacak progres dan perbarui jumlah saat Anda menabung

### 4. Analitik & Laporan

**Lihat Wawasan Keuangan:**

- **Tab Overview**: Ringkasan cepat dengan metrik kunci
- **Tab Analytics**: Grafik dan rincian detail
- **Metrik Kesehatan Keuangan**: Tingkat tabungan, rasio pengeluaran

**Ekspor Data:**

1. Pergi ke tab Import/Export
2. Klik "Export CSV" untuk mengunduh data transaksi Anda
3. Gunakan untuk backup atau analisis eksternal

### 5. Mengimpor Data

**Proses Import CSV:**

1. Unduh template CSV terlebih dahulu
2. Isi data transaksi Anda
3. Upload file CSV
4. Tinjau preview import
5. Konfirmasi untuk mengimpor semua transaksi yang valid

## 🎨 Kustomisasi

### Menambah Kategori Baru

Perbarui array kategori di komponen yang sesuai:

```typescript
// Di transaction-form.tsx dan budget-management.tsx
const expenseCategories = [
  'Rumah/Sewa',
  'Makanan',
  'Transportasi',
  'Listrik/Air',
  'Kesehatan',
  'Hiburan',
  'Belanja',
  'Pengeluaran Lain',
  'Kategori Baru Anda', // Tambahkan di sini
];
```

### Memodifikasi Format Mata Uang

Perbarui format mata uang di `app/utils/currency.ts`:

```typescript
export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};
```

### Konfigurasi Tailwind

Proyek ini menggunakan konfigurasi Tailwind khusus. Modifikasi `tailwind.config.ts` untuk menyesuaikan:

- Warna
- Spacing
- Tipografi
- Breakpoint

## 📞 Dukungan

Jika Anda memiliki pertanyaan atau memerlukan bantuan:

1. Periksa halaman [Issues](https://github.com/jutionck/cashflow-management/issues)
2. Buat issue baru dengan deskripsi detail
3. Bergabung dalam diskusi di repository

## 🙏 Penghargaan

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Recharts](https://recharts.org/) - Chart library
- [Lucide](https://lucide.dev/) - Icon library

---

**Dibangun dengan ❤️ untuk manajemen keuangan yang lebih baik**
