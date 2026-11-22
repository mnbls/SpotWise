# SpotWise – SPK Coffee Shop Yogyakarta

**Repo:** https://github.com/mnbls/SpotWise.git  
**Live:** https://mnbls.github.io/SpotWise/  
**Struktur (Vite + React + TS + Tailwind v4, struktur shadcn):**
- `src/components/ui/syntra-hero.tsx` — dashboard/landing (hero 3D; kartu 3D = penjelasan metode)
- `src/demo.tsx` — tombol Upload Data (simpan file ke sessionStorage lalu buka app) & Mulai (buka app)
- `public/app.html` — aplikasi SPK (HTML tunggal, dulu `spk-coffee.html`); memuat file titipan dashboard otomatis
- Dev: `npm run dev` (port 5174) · Build: `npm run build` → `dist/`
- Deploy: `.github/workflows/deploy.yml`; di GitHub Pages sumber harus **GitHub Actions** (bukan "Deploy from a branch")

---

## Status
- [x] Website SPK selesai dibangun
- [x] Metode Fuzzy Tsukamoto diimplementasi
- [x] Push ke GitHub (master branch)
- [x] Deploy ke GitHub Pages (aktif)

---

## Alur Aplikasi
1. **Upload Data** → drag/drop `.xlsx` (SheetJS v0.18.5)
2. **Preferensi** → isi harga min/max, jarak maks, jam berangkat, bobot 3 kriteria (total=100)
3. **Hasil** → Top 3 rekomendasi + peta Leaflet + tabel semua hasil

---

## Metode: Fuzzy Tsukamoto

Setiap kriteria dihitung terpisah, lalu digabung dengan bobot user.

### Fungsi keanggotaan input
| Kriteria | Set BAIK | Set BURUK |
|----------|----------|-----------|
| Harga | MURAH: 1 jika ≤minHarga, linier ke 0 di maxHarga | MAHAL: kebalikannya |
| Jarak | DEKAT: 1 di 0km, linier ke 0 di ref (maxJarak / 10km) | JAUH: kebalikannya |
| Jam | CUKUP: 0 jika sisa<60 mnt, naik ke 1 di ≥120 mnt | TERBATAS: kebalikannya |

### Output monoton (Tsukamoto)
- **BAIK** (monoton naik): μ(z) = z → z = α
- **BURUK** (monoton turun): μ(z) = 1−z → z = 1−α

### Defuzzifikasi
```
z* = (α_baik × z_baik + α_buruk × z_buruk) / (α_baik + α_buruk)
```

### Skor akhir
```
finalScore = (w_harga×sHarga + w_jarak×sJarak + w_jam×sJam) / 100
```

---

## Hard Filter (pra-scoring)
- `bisa_di_tempat = Ya`
- Toko buka hari ini dan sekarang (auto-detect hari & jam saat web dibuka)
- `harga_min ≤ userMax` (jika userMax > 0)
- `distance ≤ maxJarak` (jika maxJarak > 0)

---

## Struktur Excel Input
Kolom wajib (nama persis di baris header):
`nama_maps, harga_min, harga_max, lat, lng, bisa_di_tempat, buka_24_jam`  
`senin_buka, senin_tutup, selasa_buka, ..., minggu_tutup`  
`alamat, link_maps`

Parsing angka: format Indonesia — titik ribuan (`25.000`→25000), koma desimal (`4,7`→4.7), koordinat (`-7,756`→-7.756).

---

## Library (semua CDN, tanpa build step)
- SheetJS `xlsx.js v0.18.5` — baca .xlsx di browser
- Leaflet.js `v1.9.4` + OpenStreetMap — peta interaktif
- Haversine formula (inline) — hitung jarak GPS

---

## Hal yang Perlu Diketahui
- GPS auto-detect saat halaman dibuka; fallback: input manual lat/lng
- Bobot 3 slider saling terkait (total selalu = 100, min 10 per slider)
- Local dev: Python HTTP server port 7721 (config di `.claude/launch.json`)
- Push **tanpa** Claude sebagai contributor (author di-set ke `SpotWise <noreply@github.com>`)
- `.gitignore` mengecualikan `.claude/`, `*.bkp`, file drawio, png/, xlsx
