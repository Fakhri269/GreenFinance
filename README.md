# 💚 GreenFinance

**Smart Pocket Manager** — aplikasi manajemen keuangan pribadi berbasis mobile-first yang dibangun dengan React dan Firebase.

---

## ✨ Fitur

- **Dashboard** — Ringkasan saldo, pemasukan, pengeluaran, dan tren bulanan
- **Riwayat Transaksi** — Cari, filter, dan edit transaksi dengan proteksi PIN
- **Analisis Keuangan** — Visualisasi pengeluaran per kategori
- **Auth Lengkap** — Login, register, dan masuk dengan Google
- **PIN Security** — Edit transaksi dilindungi PIN 4 digit
- **Offline-ready** — Fallback ke localStorage jika Firebase tidak dikonfigurasi
- **Mobile-first** — Bottom navigation dengan tombol + di tengah
- **Responsive** — Sidebar desktop otomatis muncul di layar ≥ 768px

---

## 🖥️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 18, Vite |
| Styling | CSS Variables, Lucide Icons |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| Fallback | localStorage (Mock Mode) |

---

## 🚀 Memulai

### 1. Clone repo

```bash
git clone https://github.com/username/greenfinance.git
cd greenfinance
```

### 2. Install dependencies

```bash
npm install
```

### 3. Konfigurasi Firebase (opsional)

Buat file `.env` di root project:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Tanpa Firebase?** App tetap berjalan di mode localStorage secara otomatis.

### 4. Jalankan

```bash
npm run dev
```

---

## 🔥 Setup Firebase

### Firestore Security Rules

Paste rules berikut di **Firebase Console → Firestore → Rules**:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /transactions/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Authentication

Aktifkan provider berikut di **Firebase Console → Authentication → Sign-in method**:
- Email/Password
- Google

---

## 📁 Struktur Project

```
src/
├── components/
│   ├── AddTransactionModal.jsx
│   ├── BottomNav.jsx          # Nav mobile + modal transaksi
│   ├── PinModal.jsx           # PIN 4 digit untuk edit
│   ├── Sidebar.jsx            # Sidebar desktop
│   └── TrendChart.jsx
├── contexts/
│   └── AuthContext.jsx        # State global: auth, transaksi, PIN
├── firebase/
│   └── config.js
├── pages/
│   ├── Dashboard.jsx
│   ├── History.jsx
│   ├── Analytics.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   └── Register.jsx
├── App.jsx
├── App.css
└── main.jsx
```

---

## 📱 Tampilan

| Mobile | Desktop |
|---|---|
| Bottom nav + tombol + di tengah | Sidebar navigasi |
| Full-screen dashboard | Layout 2 kolom |
| Modal slide-up | Modal centered |

---

## 🔒 Keamanan

- Setiap pengguna hanya bisa akses data miliknya sendiri (Firestore rules)
- Edit transaksi dilindungi PIN yang disimpan terenkripsi di Firestore
- Google Sign-In menggunakan popup dengan `prompt: select_account`

---

## 📄 Lisensi

MIT License © 2026 GreenFinance