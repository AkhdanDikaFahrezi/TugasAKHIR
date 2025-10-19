"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Camera, 
  UserPlus, 
  History, 
  Clock, 
  Fingerprint,
  Calendar,
  LogIn,
  User
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Fingerprint className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Face Attendance
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sistem Absensi dengan Pengenalan Wajah
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Masuk
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center space-x-2">
                  <Link href="/profil">
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Profil
                    </Button>
                  </Link>
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Selamat Datang di Sistem Absensi
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sistem presensi modern dengan teknologi pengenalan wajah yang aman dan efisien
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <Camera className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">Langsung Absen</CardTitle>
              <CardDescription>
                Lakukan presensi masuk atau pulang dengan pengenalan wajah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/absen">
                <Button className="w-full" size="lg">
                  <Camera className="h-4 w-4 mr-2" />
                  Mulai Absen
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <UserPlus className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl">Pendaftaran</CardTitle>
              <CardDescription>
                Daftar sebagai pengguna baru dan lengkapi data diri Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/daftar">
                <Button className="w-full" variant="outline" size="lg">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Daftar Sekarang
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                <History className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">Riwayat Kehadiran</CardTitle>
              <CardDescription>
                Lihat statistik dan riwayat presensi Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/riwayat">
                <Button className="w-full" variant="outline" size="lg">
                  <History className="h-4 w-4 mr-2" />
                  Lihat Riwayat
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Real-time</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Proses presensi instan dengan pengenalan wajah real-time
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <Fingerprint className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Aman</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Teknologi anti-spoofing untuk mencegah kecurangan
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Terintegrasi</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Sistem terintegrasi dengan database cloud
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <User className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Mudah Digunakan</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Antarmuka user-friendly dan responsif
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
