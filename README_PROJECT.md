# Sistem Absensi Face Recognition

Aplikasi web fullstack untuk sistem presensi mahasiswa dengan teknologi pengenalan wajah menggunakan CNN dan anti-spoofing.

## 🏗️ Teknologi Stack

### Frontend
- **Next.js 15** - React framework dengan App Router
- **TypeScript** - Type safety dan better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library yang modern dan accessible
- **Clerk** - Authentication dan user management
- **react-webcam** - Camera access untuk face capture

### Backend
- **Flask** - Python web framework
- **CNN Model** - Face recognition dengan TensorFlow/PyTorch
- **Anti-spoofing** - Pencegahan kecurangan saat absensi
- **CORS** - Cross-origin resource sharing

### Database
- **Supabase** - PostgreSQL database dengan real-time capabilities
- **Row Level Security (RLS)** - Keamanan data tingkat baris

## 📁 Struktur File Frontend

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page utama
│   ├── daftar/page.tsx          # Halaman pendaftaran mahasiswa
│   ├── absen/page.tsx           # Halaman absensi dengan face recognition
│   ├── profil/page.tsx          # Profil dan statistik mahasiswa
│   ├── riwayat/page.tsx         # Riwayat kehadiran lengkap
│   ├── izin/page.tsx            # CRUD sistem izin/sakit
│   ├── layout.tsx               # Root layout dengan Clerk provider
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # shadcn/ui components
│   └── theme-provider.tsx       # Theme management
├── lib/
│   ├── supabase.ts              # Supabase client configuration
│   └── utils.ts                 # Utility functions
└── middleware.ts                # Route protection dengan Clerk
```

## 📄 Penjelasan Halaman

### 1. Landing Page (`/`)
- **Deskripsi**: Halaman utama dengan 3 opsi utama
- **Fitur**:
  - Langsung Absen: Direct ke halaman absensi
  - Pendaftaran: Registrasi mahasiswa baru
  - Riwayat Kehadiran: Akses ke history presensi
- **Components**: Hero section, action cards, feature highlights

### 2. Halaman Pendaftaran (`/daftar`)
- **Deskripsi**: Registrasi mahasiswa dengan face data collection
- **Fitur**:
  - Form data diri (NIM, nama, kelas, semester)
  - Integrasi kamera untuk capture wajah
  - Multiple image capture untuk ML training
  - Validasi data sebelum submit
- **Components**: Form validation, webcam integration, progress indicator
- **Backend Integration**: POST `/api/register`

### 3. Halaman Absensi (`/absen`)
- **Deskripsi**: Core attendance dengan face recognition
- **Fitur**:
  - Pilihan absen masuk/pulang
  - Real-time face verification
  - Anti-spoofing detection
  - Hasil verifikasi dengan data mahasiswa
  - Notifikasi success/error
- **Components**: Webcam integration, verification flow, result display
- **Backend Integration**: POST `/api/verify`

### 4. Halaman Profil (`/profil`)
- **Deskripsi**: Manajemen profil dan statistik personal
- **Fitur**:
  - Edit profil mahasiswa
  - Statistik kehadiran real-time
  - Riwayat absensi terbaru
  - Performance analytics
  - Quick actions untuk absensi
- **Components**: Profile form, stats cards, attendance charts
- **Tabs**: Profile Info, Attendance History, Statistics

### 5. Halaman Riwayat (`/riwayat`)
- **Deskripsi**: Comprehensive attendance history dan analytics
- **Fitur**:
  - Filter berdasarkan tanggal dan status
  - Detail log masuk/pulang per hari
  - Monthly summaries dengan charts
  - Semester performance analytics
  - Export functionality
- **Components**: Data tables, filters, charts, calendar view
- **Tabs**: Daily History, Monthly Summary, Semester Stats

### 6. Halaman Izin/Sakit (`/izin`)
- **Deskripsi**: CRUD system untuk leave requests
- **Fitur**:
  - Create izin/sakit requests
  - Read/List all requests
  - Edit pending requests
  - Delete requests
  - Status tracking (pending/approved/rejected)
  - File attachment support
- **Components**: Form dialogs, CRUD operations, status badges
- **Backend Integration**: Full CRUD API endpoints

## 🔐 Autentikasi & Authorization

### Clerk Integration
- **Sign Up/In**: Modal-based authentication
- **Protected Routes**: Middleware untuk route protection
- **User Sessions**: Persistent authentication
- **Profile Management**: Clerk user data integration

### Route Protection
- Public Routes: `/`, `/daftar`
- Protected Routes: `/absen`, `/profil`, `/riwayat`, `/izin`
- Redirect logic untuk unauthenticated users

## 🎨 UI/UX Design Principles

### Design System
- **Color Scheme**: Blue primary dengan semantic colors (green/success, yellow/warning, red/error)
- **Typography**: Geist font family dengan clear hierarchy
- **Spacing**: Consistent spacing dengan Tailwind classes
- **Components**: shadcn/ui untuk consistency dan accessibility

### Responsive Design
- **Mobile-first approach**
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid layouts**: Adaptive grid systems
- **Touch-friendly**: Appropriate touch targets untuk mobile

### User Experience
- **Loading states**: Skeletons dan spinners
- **Error handling**: User-friendly error messages
- **Success feedback**: Clear success notifications
- **Micro-interactions**: Hover states dan transitions

## 🚀 Cara Menjalankan Aplikasi

### Prerequisites
```bash
Node.js 18+
NPM atau Yarn
```

### Installation
```bash
# Clone repository
git clone <repository-url>
cd face-attendance

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan credentials Anda
```

### Environment Variables
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Flask Backend (nanti)
NEXT_PUBLIC_FLASK_API_URL=http://localhost:5000
```

### Development
```bash
# Jalankan development server
npm run dev

# Buka http://localhost:3000
```

## 📊 Database Schema (Supabase)

### Tables
1. **profiles**
   - id (UUID, Primary Key)
   - clerk_id (String, Foreign Key ke Clerk)
   - nim (String, Unique)
   - nama (String)
   - kelas (String: pagi/malam)
   - semester (String: 1-8)
   - face_embeddings (JSON)
   - created_at (Timestamp)

2. **attendance_logs**
   - id (UUID, Primary Key)
   - profile_id (Foreign Key)
   - type (String: masuk/pulang)
   - timestamp (Timestamp)
   - location (String)
   - face_image_url (String)
   - created_at (Timestamp)

3. **leave_requests**
   - id (UUID, Primary Key)
   - profile_id (Foreign Key)
   - type (String: izin/sakit)
   - reason (Text)
   - date (Date)
   - duration (String)
   - status (String: pending/approved/rejected)
   - attachment_url (String)
   - reject_reason (Text)
   - created_at (Timestamp)

## 🔮 Future Enhancements

### Backend Development
- Flask API dengan CNN model integration
- Face recognition endpoint
- Anti-spoofing implementation
- Image processing pipeline

### Advanced Features
- Real-time notifications
- Admin dashboard
- Export ke PDF/Excel
- Face data retraining
- Location-based attendance
- Multi-language support

### Performance Optimization
- Image compression
- Caching strategies
- Database indexing
- CDN integration

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: Ini adalah frontend-only implementation. Backend Flask API dan model CNN akan diimplementasikan dalam tahap selanjutnya.