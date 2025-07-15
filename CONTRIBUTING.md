# Berkontribusi ke Cashflow Management

Kami sangat menghargai masukan Anda! Kami ingin membuat kontribusi ke proyek ini semudah dan setransparan mungkin, baik itu:

- Melaporkan bug
- Mendiskusikan keadaan kode saat ini
- Mengirimkan perbaikan
- Mengusulkan fitur baru
- Menjadi maintainer

## Proses Development

Kami menggunakan GitHub untuk hosting kode, melacak issues dan permintaan fitur, serta menerima pull request.

### Pull Request

1. Fork repo dan buat branch Anda dari `main`.
2. Jika Anda menambahkan kode yang harus ditest, tambahkan test.
3. Jika Anda mengubah API, perbarui dokumentasi.
4. Pastikan test suite berhasil.
5. Pastikan kode Anda linting.
6. Kirimkan pull request tersebut!

### Setup Development

1. **Clone repository**

   ```bash
   git clone https://github.com/jutionck/cashflow-management.git
   cd cashflow-management
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Jalankan development server**

   ```bash
   pnpm dev
   ```

4. **Buka browser**
   Navigasi ke [http://localhost:3000](http://localhost:3000)

## Gaya Kode

### Panduan TypeScript

- Gunakan TypeScript untuk semua file baru
- Definisikan interface dan tipe yang tepat
- Hindari tipe `any` jika memungkinkan
- Gunakan nama variabel dan fungsi yang bermakna

### Panduan Komponen React

- Gunakan komponen fungsional dengan hooks
- Ikuti prinsip single responsibility
- Gunakan proper prop typing dengan interface
- Implementasikan error boundary yang tepat jika diperlukan

### Konvensi Penamaan File

- Gunakan kebab-case untuk nama file: `transaction-form.tsx`
- Gunakan PascalCase untuk nama komponen: `TransactionForm`
- Gunakan camelCase untuk fungsi dan variabel: `handleSubmit`

### Format Kode

Kami menggunakan Prettier dan ESLint untuk format kode:

```bash
# Jalankan linting
pnpm lint

# Perbaiki masalah linting
pnpm lint --fix
```

## Panduan Struktur Proyek

### Organisasi Komponen

```
app/components/
├── transaction-form.tsx      # Komponen dengan tanggung jawab tunggal
├── transaction-list.tsx      # Nama yang jelas dan deskriptif
├── budget-management.tsx     # Komponen spesifik fitur
└── import-export.tsx         # Fungsionalitas terkait yang dikelompokkan
```

### Definisi Tipe

- Simpan semua tipe di direktori `app/types/`
- Gunakan nama interface yang deskriptif
- Ekspor tipe yang mungkin digunakan kembali
- Dokumentasikan tipe kompleks dengan komentar

```typescript
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  isRecurring?: boolean;
  recurringFrequency?: 'monthly' | 'weekly' | 'yearly';
  tags?: string[];
}
```

## Panduan Testing

### Menulis Test

- Tulis unit test untuk fungsi utilitas
- Tulis integration test untuk komponen
- Test edge case dan kondisi error
- Mock dependensi eksternal

### Menjalankan Test

```bash
# Jalankan semua test
pnpm test

# Jalankan test dalam watch mode
pnpm test:watch

# Jalankan test dengan coverage
pnpm test:coverage
```

## Development Fitur

### Menambah Fitur Baru

1. **Buat issue** yang mendeskripsikan fitur
2. **Diskusikan pendekatan** di komentar issue
3. **Buat feature branch** dari `main`
4. **Implementasikan fitur** mengikuti panduan
5. **Tambahkan test** untuk fungsionalitas baru
6. **Perbarui dokumentasi** sesuai kebutuhan
7. **Kirimkan pull request**

### Penamaan Feature Branch

- `feature/add-expense-categories`
- `bugfix/fix-budget-calculation`
- `improvement/enhance-chart-performance`

## Laporan Bug

Kami menggunakan GitHub issues untuk melacak bug publik. Laporkan bug dengan [membuka issue baru](https://github.com/jutionck/cashflow-management/issues).

### Laporan Bug yang Baik Mencakup:

- Ringkasan cepat dan/atau latar belakang
- Langkah untuk mereproduksi
  - Spesifik!
  - Berikan contoh kode jika bisa
- Apa yang Anda harapkan terjadi
- Apa yang sebenarnya terjadi
- Catatan (mungkin termasuk mengapa Anda pikir ini mungkin terjadi, atau hal yang sudah Anda coba yang tidak berhasil)

### Template Laporan Bug

```markdown
**Deskripsikan bug**
Deskripsi yang jelas dan ringkas tentang apa bugnya.

**Untuk Mereproduksi**
Langkah untuk mereproduksi perilaku:

1. Pergi ke '...'
2. Klik pada '....'
3. Scroll ke bawah ke '....'
4. Lihat error

**Perilaku yang diharapkan**
Deskripsi yang jelas dan ringkas tentang apa yang Anda harapkan terjadi.

**Screenshot**
Jika berlaku, tambahkan screenshot untuk membantu menjelaskan masalah Anda.

**Desktop (harap lengkapi informasi berikut):**

- OS: [contoh iOS]
- Browser [contoh chrome, safari]
- Version [contoh 22]

**Konteks tambahan**
Tambahkan konteks lain tentang masalah di sini.
```

## Dokumentasi

### Update README

- Jaga README tetap up to date dengan fitur baru
- Sertakan contoh penggunaan yang jelas
- Perbarui instruksi instalasi jika dependensi berubah
- Tambahkan screenshot untuk fitur visual

### Dokumentasi Kode

- Gunakan komentar JSDoc untuk fungsi kompleks
- Dokumentasikan prop komponen dengan interface TypeScript
- Sertakan contoh penggunaan dalam komentar komponen

````typescript
/**
 * Komponen form transaksi untuk membuat dan mengedit transaksi
 *
 * @param onSubmit - Fungsi callback yang dipanggil saat form disubmit
 * @param onCancel - Fungsi callback yang dipanggil saat form dibatalkan
 * @param editTransaction - Objek transaksi opsional untuk mode edit
 *
 * @example
 * ```tsx
 * <TransactionForm
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 *   editTransaction={transaction}
 * />
 * ```
 */
interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  editTransaction?: Transaction;
}
````

## Panduan Performa

### Performa React

- Gunakan `useMemo` dan `useCallback` untuk kalkulasi yang mahal
- Implementasikan prop key yang tepat untuk item list
- Hindari re-render yang tidak perlu dengan dependency array yang tepat
- Gunakan React.memo untuk komponen yang tidak perlu update sering

### Ukuran Bundle

- Hindari mengimpor seluruh library ketika hanya fungsi spesifik yang diperlukan
- Gunakan dynamic import untuk komponen besar yang tidak selalu diperlukan
- Monitor ukuran bundle dengan `pnpm build` dan analisis output

## Panduan Keamanan

### Validasi Input

- Validasi semua input pengguna di sisi client dan server
- Sanitasi data sebelum pemrosesan
- Gunakan tipe TypeScript untuk menangkap error terkait tipe lebih awal

### Penanganan Data

- Jangan simpan data sensitif di localStorage
- Validasi import CSV secara menyeluruh
- Tangani upload file dengan aman

## Panduan Aksesibilitas

### Komponen UI

- Gunakan elemen HTML semantik
- Implementasikan label ARIA yang tepat
- Pastikan navigasi keyboard berfungsi
- Test dengan screen reader
- Pertahankan rasio kontras warna

### Form

- Berikan pesan error yang jelas
- Gunakan label form yang tepat
- Implementasikan feedback validasi form
- Dukung navigasi keyboard

## Lisensi

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah Lisensi MIT.

## Pertanyaan?

Jangan ragu untuk membuka issue dengan label pertanyaan, atau hubungi maintainer secara langsung.

Terima kasih telah berkontribusi! 🎉
