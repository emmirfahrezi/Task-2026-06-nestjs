<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Urbansolv Backend (NestJS Modular)</h1>

<p align="center">
  Sebuah proyek backend berskala industri yang dibangun menggunakan arsitektur <b>NestJS Modular</b>. Proyek ini mendemonstrasikan implementasi keamanan tingkat lanjut, validasi ketat, pencatatan log otomatis, dokumentasi interaktif, dan komunikasi real-time.
</p>

---

## 🛠️ Tech Stack & Ekosistem

Aplikasi ini tidak sekadar menggunakan NestJS dasar, melainkan sudah dipersenjatai dengan tumpukan teknologi modern:

- **Framework Utama**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database ORM**: [Prisma](https://www.prisma.io/) (Untuk interaksi database yang *Type-Safe*)
- **Validasi Data**: [Zod](https://zod.dev/) & ZodValidationPipe (Detektor X-Ray pencegah data kotor)
- **Logger Otomatis**: [Winston](https://github.com/winstonjs/winston) (Sistem *logging* format JSON)
- **Dokumentasi API**: Swagger terintegrasi dengan **Stoplight Elements** (UI yang cantik)
- **Komunikasi Real-Time**: [Socket.io](https://socket.io/) (WebSocket Gateway untuk *broadcast* instan)

## 📁 Struktur Arsitektur (Modular)

Proyek ini dipisahkan menjadi beberapa "Kerajaan" (Modul) yang mandiri agar kode tidak berantakan saat aplikasi membesar:

- `src/common/`: Modul Global (Gudang senjata yang berisi Prisma, Logger, Zod Pipe, Error Filter, dan WebSocket Gateway).
- `src/user/`: Modul khusus untuk manajemen entitas Pengguna.
- `src/divisi/`: Modul khusus untuk manajemen entitas Departemen/Divisi.

Setiap modul memiliki **Controller** (Penerima tamu), **Service** (Koki yang memasak logika bisnis), dan **DTO** (Kontrak pengiriman data).

---

## 🚀 Panduan Instalasi & Persiapan

Pastikan Anda sudah meng-install [Bun](https://bun.sh/) di komputer Anda sebelum memulai.

### 1. Install Dependencies
Buka terminal di dalam folder proyek ini, lalu jalankan:
```bash
bun install
```

### 2. Persiapan Database (Prisma)
Aplikasi ini membutuhkan database. Setelah Anda mengatur koneksi database di file `.env`, jalankan perintah berikut untuk mensinkronkan tabel:
```bash
bunx prisma generate
bunx prisma migrate dev
```

### 3. Menjalankan Server
Untuk mode *development* (otomatis restart saat kode diubah):
```bash
bun run start:dev
```
Server akan menyala di **http://localhost:3000**.

---

## 🧪 Panduan Pengujian (Testing the App)

### 1. Dokumentasi API Interaktif (Stoplight)
Tidak perlu menebak-nebak *endpoint* apa saja yang tersedia. Kami telah menyediakan halaman dokumentasi canggih tempat Anda bisa membaca skema sekaligus menembak API secara langsung.
👉 **Buka di Browser**: [http://localhost:3000/docs](http://localhost:3000/docs)

### 2. Monitor WebSocket (Real-Time)
Setiap kali ada Divisi baru atau User baru yang dibuat, server akan memancarkan notifikasi secara *real-time*.
- Buka file **`test-socket.html`** yang ada di folder *root* proyek ini melalui *browser* Anda.
- Pastikan statusnya "Terhubung".
- Cobalah membuat User/Divisi baru melalui halaman `/docs` di atas.
- Saksikan pesan masuk secara ajaib ke halaman HTML Anda tanpa perlu menekan tombol *Refresh*!

---

## 👨‍💻 Author
Dibangun dan dirancang secara profesional oleh **Emmir Fahrezi** sebagai bagian dari misi pengembangan keahlian NestJS *Advanced*.
