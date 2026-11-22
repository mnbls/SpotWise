# SpotWise – SPK Rekomendasi Tempat (Fuzzy Tsukamoto)

**Repo:** https://github.com/mnbls/SpotWise.git  
**Live:** https://mnbls.github.io/SpotWise/

## Struktur (Vite + React + TS + Tailwind v4, struktur shadcn)
- `src/components/ui/syntra-hero.tsx` — dashboard/landing: hero 3D, kartu 3D = penjelasan metode, tombol Upload Data & Mulai
- `src/demo.tsx` — Upload Data menyimpan file ke `sessionStorage`; Mulai nonaktif sampai ada file, lalu membuka app
- `app.html` (root) — aplikasi SPK (HTML + JS biasa, tampilan di-restyle kontributor lain). Entry HTML kedua Vite (`vite.config.ts`), jadi skrip bento ikut ter-bundle di dev dan build. Memuat file titipan dashboard otomatis dan langsung ke langkah Preferensi
- `src/components/ui/analytics-bento.tsx` — "Ringkasan Analisis" di halaman Hasil (4 kartu SVG, tanpa library chart). Dipasang sebagai React island di `#bentoRoot` lewat `src/bento-entry.tsx` (`window.SpotwiseBento.mount/unmount`), di dalam shadow DOM agar CSS Tailwind tidak bentrok dengan CSS app. Gayanya di `src/bento.css` (token palet beranda). Datanya dihitung di `buildBentoData()` di `app.html` dari `results`
- Dev: `npm run dev` (port 5174) · Build: `npm run build` → `dist/`
- Deploy: `.github/workflows/deploy.yml`. Di GitHub Pages, sumber harus **GitHub Actions** (bukan "Deploy from a branch")

## Status
- [x] Aplikasi SPK dengan Fuzzy Tsukamoto, 4 kriteria
- [x] Dashboard 3D, muat satu layar di zoom 100% pada desktop
- [x] Alur: upload di dashboard → Mulai → Preferensi → Hasil
- [ ] Push commit terbaru ke GitHub dan pastikan sumber Pages = GitHub Actions

## Alur Aplikasi
1. **Beranda** → satu-satunya tempat upload (`.xlsx`); Mulai nonaktif sampai file ada. File disimpan di `sessionStorage` (`spk_upload`)
2. **Preferensi** (langkah 1 di app) → rentang harga, jarak maks, jam pulang, lokasi (GPS/manual), bobot 4 kriteria (total 100)
3. **Hasil** (langkah 2 di app) → Top 3 + peta Leaflet + Ringkasan Analisis + tabel semua hasil

`app.html` tidak punya halaman upload. Dibuka tanpa file, ia langsung mengarahkan ke `index.html`. "← Beranda" mempertahankan file; "Ganti Data" menghapusnya.

## Pipeline Pemrosesan
1. **Filter keras** (buang yang tidak lolos): `bisa_di_tempat = Ya`, sedang buka (hari & jam saat web dibuka), `harga_min ≤ harga maks`, `jarak ≤ jarak maks` (0 = semua jarak)
2. **Skor Tsukamoto** per kriteria
3. **Skor akhir terbobot**, lalu diurutkan dari tertinggi

## Metode: Fuzzy Tsukamoto
Output monoton: **BAIK** μ(z)=z → z=α · **BURUK** μ(z)=1−z → z=1−α

| Kriteria | Set BAIK | Set BURUK |
|----------|----------|-----------|
| Harga | MURAH: 1 jika ≤ harga min, turun linier ke 0 di harga maks | MAHAL: kebalikannya |
| Jarak | DEKAT: 1 di 0 km, turun linier ke 0 di batas (jarak maks, atau 10 km) | JAUH: kebalikannya |
| Jam | CUKUP: 0 jika sisa < 60 mnt, naik ke 1 di ≥ 120 mnt | TERBATAS: kebalikannya |
| Popularitas | Rating BAGUS (≥4,5) AND ulasan BANYAK (≥500) | Rating BURUK (≤3,0) OR ulasan SEDIKIT (≤50) |

```
z* = (α_baik × z_baik + α_buruk × z_buruk) / (α_baik + α_buruk)
skor akhir = (w_harga·sHarga + w_jarak·sJarak + w_jam·sJam + w_popularitas·sPopularitas) / 100
```
Bobot default 35 / 30 / 20 / 15.

## Struktur Excel Input
Kolom wajib: `nama_maps, harga_min, harga_max, rating, jumlah_ulasan, lat, lng, bisa_di_tempat, buka_24_jam`, `senin_buka … minggu_tutup`, `alamat, link_maps`.  
Format angka Indonesia: titik ribuan (`25.000`→25000), koma desimal (`4,7`→4.7, koordinat `-7,756`→-7.756).

## Library
- Dashboard: React 19, motion, lucide-react, Tailwind v4 (lewat npm)
- App: SheetJS `xlsx.js v0.18.5` dan Leaflet `v1.9.4` + OpenStreetMap (lewat CDN)
- Jarak: rumus Haversine (inline)

## Hal yang Perlu Diketahui
- GPS auto-detect saat app dibuka; fallback: input manual lat/lng
- Bobot 4 slider saling terkait (total selalu 100, minimum 10 per slider)
- `sessionStorage` kunci `spk_upload` dipakai untuk menitipkan file dari dashboard ke app
- Commit tanpa Claude sebagai contributor (author `SpotWise <noreply@github.com>`, tanpa trailer Co-Authored-By)
- `.gitignore` mengecualikan `.claude/`, `node_modules/`, `dist/`, `*.bkp`, `*.drawio`, `png/`, `*.xlsx`
