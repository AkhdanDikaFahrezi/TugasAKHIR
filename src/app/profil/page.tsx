"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Clock,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

// Mock data - nanti akan diambil dari backend
const mockStudentData = {
  nim: "1234567890",
  nama: "Ahmad Rizki Pratama",
  kelas: "Pagi",
  semester: "5",
  email: "ahmad.rizki@example.com",
  joinDate: "2024-01-15",
  totalAttendance: 145,
  thisMonthAttendance: 18,
  attendanceRate: 92.5
};

const mockAttendanceHistory = [
  { id: 1, date: "2024-10-18", type: "masuk", time: "07:45", location: "Kampus Utama" },
  { id: 2, date: "2024-10-18", type: "pulang", time: "18:30", location: "Kampus Utama" },
  { id: 3, date: "2024-10-17", type: "masuk", time: "07:52", location: "Kampus Utama" },
  { id: 4, date: "2024-10-17", type: "pulang", time: "17:45", location: "Kampus Utama" },
  { id: 5, date: "2024-10-16", type: "masuk", time: "08:10", location: "Kampus Utama" },
  { id: 6, date: "2024-10-16", type: "pulang", time: "18:15", location: "Kampus Utama" },
];

const mockMonthlySummary = [
  { month: "Januari", hadir: 20, izin: 1, sakit: 0, alfa: 0 },
  { month: "Februari", hadir: 18, izin: 2, sakit: 0, alfa: 0 },
  { month: "Maret", hadir: 22, izin: 0, sakit: 1, alfa: 0 },
  { month: "April", hadir: 20, izin: 1, sakit: 0, alfa: 0 },
  { month: "Mei", hadir: 19, izin: 2, sakit: 0, alfa: 1 },
  { month: "Juni", hadir: 21, izin: 0, sakit: 0, alfa: 0 },
];

export default function ProfilPage() {
  const { isSignedIn } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama: mockStudentData.nama,
    kelas: mockStudentData.kelas,
    semester: mockStudentData.semester
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // TODO: Implement backend API call to update profile
    setSaveStatus("success");
    setIsEditing(false);
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const handleCancel = () => {
    setFormData({
      nama: mockStudentData.nama,
      kelas: mockStudentData.kelas,
      semester: mockStudentData.semester
    });
    setIsEditing(false);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Autentikasi Diperlukan</CardTitle>
            <CardDescription>
              Silakan masuk terlebih dahulu untuk melihat profil
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Halaman Utama
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Profil Mahasiswa
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Kelola informasi pribadi dan pantau statistik kehadiran Anda
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="attendance">Kehadiran</TabsTrigger>
                <TabsTrigger value="statistics">Statistik</TabsTrigger>
              </TabsList>
            </div>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Profile Card */}
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informasi Pribadi
                      </CardTitle>
                      <CardDescription>
                        Data diri Anda yang terdaftar dalam sistem
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {!isEditing ? (
                        <Button 
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <>
                          <Button 
                            onClick={handleSave}
                            size="sm"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Simpan
                          </Button>
                          <Button 
                            onClick={handleCancel}
                            variant="outline"
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Batal
                          </Button>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {saveStatus === "success" && (
                      <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                          Profil berhasil diperbarui!
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>NIM</Label>
                        <Input value={mockStudentData.nim} disabled />
                      </div>

                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value="user@example.com" disabled />
                      </div>

                      <div className="space-y-2">
                        <Label>Nama Lengkap</Label>
                        <Input
                          value={isEditing ? formData.nama : mockStudentData.nama}
                          onChange={(e) => handleInputChange("nama", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Kelas</Label>
                        <Select 
                          value={isEditing ? formData.kelas : mockStudentData.kelas} 
                          onValueChange={(value) => handleInputChange("kelas", value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pagi">Kelas Pagi</SelectItem>
                            <SelectItem value="malam">Kelas Malam</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Semester</Label>
                        <Select 
                          value={isEditing ? formData.semester : mockStudentData.semester}
                          onValueChange={(value) => handleInputChange("semester", value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Semester 1</SelectItem>
                            <SelectItem value="2">Semester 2</SelectItem>
                            <SelectItem value="3">Semester 3</SelectItem>
                            <SelectItem value="4">Semester 4</SelectItem>
                            <SelectItem value="5">Semester 5</SelectItem>
                            <SelectItem value="6">Semester 6</SelectItem>
                            <SelectItem value="7">Semester 7</SelectItem>
                            <SelectItem value="8">Semester 8</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Tanggal Bergabung</Label>
                        <Input value={new Date(mockStudentData.joinDate).toLocaleDateString('id-ID')} disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Statistik Cepat</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {mockStudentData.attendanceRate}%
                        </div>
                        <div className="text-sm text-gray-500">Tingkat Kehadiran</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-semibold">{mockStudentData.thisMonthAttendance}</div>
                          <div className="text-xs text-gray-500">Bulan Ini</div>
                        </div>
                        <div>
                          <div className="text-2xl font-semibold">{mockStudentData.totalAttendance}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Aksi Cepat</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full" asChild>
                        <Link href="/absen">
                          <Clock className="h-4 w-4 mr-2" />
                          Absen Sekarang
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/riwayat">
                          <Calendar className="h-4 w-4 mr-2" />
                          Lihat Riwayat
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Riwayat Kehadiran Terbaru
                  </CardTitle>
                  <CardDescription>
                    Entri absensi Anda dalam beberapa hari terakhir
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAttendanceHistory.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            record.type === 'masuk' 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                          }`}>
                            {record.type === 'masuk' ? <Clock className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-medium">
                              {record.type === 'masuk' ? 'Absen Masuk' : 'Absen Pulang'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(record.date).toLocaleDateString('id-ID', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{record.time}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {record.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="outline" asChild>
                      <Link href="/riwayat">
                        Lihat Semua Riwayat
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="statistics">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Ringkasan Bulanan
                    </CardTitle>
                    <CardDescription>
                      Statistik kehadiran per bulan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockMonthlySummary.map((month) => (
                        <div key={month.month} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{month.month}</span>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="text-xs">
                                Hadir: {month.hadir}
                              </Badge>
                              {month.izin > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  Izin: {month.izin}
                                </Badge>
                              )}
                              {month.sakit > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  Sakit: {month.sakit}
                                </Badge>
                              )}
                              {month.alfa > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  Alfa: {month.alfa}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Progress 
                            value={(month.hadir / (month.hadir + month.izin + month.sakit + month.alfa)) * 100} 
                            className="h-2" 
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Kinerja Kehadiran</CardTitle>
                    <CardDescription>
                      Analisis performa kehadiran Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {mockStudentData.totalAttendance}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Total Hadir</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {mockStudentData.attendanceRate}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Tingkat Hadir</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Capaian Bulan Ini</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Hadir</span>
                          <span className="font-medium text-green-600">{mockStudentData.thisMonthAttendance} hari</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Izin</span>
                          <span className="font-medium text-yellow-600">1 hari</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Sakit</span>
                          <span className="font-medium text-red-600">0 hari</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Alfa</span>
                          <span className="font-medium text-red-600">0 hari</span>
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        Performa kehadiran Anda sangat baik! Pertahankan konsistensi ini.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Halaman Utama
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}