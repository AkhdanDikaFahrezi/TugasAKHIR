"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Filter,
  Download,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

// Mock data - nanti akan diambil dari backend API
const mockAttendanceData = [
  {
    id: 1,
    date: "2024-10-18",
    day: "Jumat",
    masuk: { time: "07:45", location: "Kampus Utama" },
    pulang: { time: "18:30", location: "Kampus Utama" },
    totalHours: "10j 45m",
    status: "complete"
  },
  {
    id: 2,
    date: "2024-10-17",
    day: "Kamis",
    masuk: { time: "07:52", location: "Kampus Utama" },
    pulang: { time: "17:45", location: "Kampus Utama" },
    totalHours: "9j 53m",
    status: "complete"
  },
  {
    id: 3,
    date: "2024-10-16",
    day: "Rabu",
    masuk: { time: "08:10", location: "Kampus Utama" },
    pulang: { time: "18:15", location: "Kampus Utama" },
    totalHours: "10j 5m",
    status: "complete"
  },
  {
    id: 4,
    date: "2024-10-15",
    day: "Selasa",
    masuk: { time: "07:38", location: "Kampus Utama" },
    pulang: null,
    totalHours: "-",
    status: "incomplete"
  },
  {
    id: 5,
    date: "2024-10-14",
    day: "Senin",
    masuk: null,
    pulang: null,
    totalHours: "-",
    status: "leave",
    leaveType: "izin",
    reason: "Ada kepentingan keluarga"
  },
  {
    id: 6,
    date: "2024-10-11",
    day: "Jumat",
    masuk: { time: "07:55", location: "Kampus Utama" },
    pulang: { time: "17:30", location: "Kampus Utama" },
    totalHours: "9j 35m",
    status: "complete"
  },
];

const mockMonthlyStats = {
  hadir: 18,
  izin: 1,
  sakit: 0,
  alfa: 1,
  totalHours: 185,
  avgHoursPerDay: 10.3
};

const mockSemesterStats = {
  totalDays: 120,
  hadir: 115,
  izin: 3,
  sakit: 1,
  alfa: 1,
  attendanceRate: 95.8,
  totalHours: 1230
};

export default function RiwayatPage() {
  const { isSignedIn } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("bulan");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = mockAttendanceData.filter(item => {
    const matchesFilter = filterStatus === "all" || item.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      item.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string, leaveType?: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Hadir</Badge>;
      case "incomplete":
        return <Badge variant="secondary">Tidak Lengkap</Badge>;
      case "leave":
        return <Badge className={
          leaveType === "izin" 
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
        }>
          {leaveType === "izin" ? "Izin" : "Sakit"}
        </Badge>;
      default:
        return <Badge variant="destructive">Alfa</Badge>;
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Autentikasi Diperlukan</CardTitle>
            <CardDescription>
              Silakan masuk terlebih dahulu untuk melihat riwayat kehadiran
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Riwayat Kehadiran
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Pantau statistik dan riwayat presensi Anda secara lengkap
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hadir Bulan Ini</p>
                    <p className="text-2xl font-bold text-green-600">{mockMonthlyStats.hadir}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Izin/Sakit</p>
                    <p className="text-2xl font-bold text-yellow-600">{mockMonthlyStats.izin + mockMonthlyStats.sakit}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Alfa</p>
                    <p className="text-2xl font-bold text-red-600">{mockMonthlyStats.alfa}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Jam</p>
                    <p className="text-2xl font-bold text-blue-600">{mockMonthlyStats.totalHours}j</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="history" className="space-y-8">
            <div className="flex justify-between items-center">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="history">Riwayat</TabsTrigger>
                <TabsTrigger value="monthly">Bulanan</TabsTrigger>
                <TabsTrigger value="semester">Semester</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Detail Kehadiran
                      </CardTitle>
                      <CardDescription>
                        Riwayat presensi harian Anda
                      </CardDescription>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Input
                        placeholder="Cari tanggal atau hari..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-48"
                      />
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua</SelectItem>
                          <SelectItem value="complete">Hadir</SelectItem>
                          <SelectItem value="leave">Izin/Sakit</SelectItem>
                          <SelectItem value="incomplete">Tidak Lengkap</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredData.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium">{item.day}</div>
                              <div className="text-sm text-gray-500">{item.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(item.status, item.leaveType)}
                            {item.status === "complete" && (
                              <Badge variant="outline" className="text-blue-600 border-blue-200 dark:border-blue-800">
                                {item.totalHours}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          {item.masuk ? (
                            <div className="flex items-center gap-3 text-sm">
                              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                                <Clock className="h-3 w-3 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <div className="font-medium text-green-600 dark:text-green-400">Masuk</div>
                                <div className="text-gray-500 flex items-center gap-1">
                                  <span>{item.masuk.time}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {item.masuk.location}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                <Clock className="h-3 w-3" />
                              </div>
                              <div>
                                <div>Tidak ada absen masuk</div>
                              </div>
                            </div>
                          )}

                          {item.pulang ? (
                            <div className="flex items-center gap-3 text-sm">
                              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                                <Clock className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                              </div>
                              <div>
                                <div className="font-medium text-orange-600 dark:text-orange-400">Pulang</div>
                                <div className="text-gray-500 flex items-center gap-1">
                                  <span>{item.pulang.time}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {item.pulang.location}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                <Clock className="h-3 w-3" />
                              </div>
                              <div>
                                <div>Tidak ada absen pulang</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {item.leaveType && item.reason && (
                          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div className="text-sm">
                              <span className="font-medium">Alasan: </span>
                              <span className="text-gray-600 dark:text-gray-300">{item.reason}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Monthly Tab */}
            <TabsContent value="monthly">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ringkasan Bulanan</CardTitle>
                      <CardDescription>
                        Statistik kehadiran bulan ini
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-3xl font-bold text-green-600">{mockMonthlyStats.hadir}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Hari Hadir</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600">{mockMonthlyStats.avgHoursPerDay}j</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Rata-rata/hari</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Detail Kehadiran</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              Hadir
                            </span>
                            <span className="font-medium">{mockMonthlyStats.hadir} hari</span>
                          </div>
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                              Izin
                            </span>
                            <span className="font-medium">{mockMonthlyStats.izin} hari</span>
                          </div>
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              Sakit
                            </span>
                            <span className="font-medium">{mockMonthlyStats.sakit} hari</span>
                          </div>
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              Alfa
                            </span>
                            <span className="font-medium">{mockMonthlyStats.alfa} hari</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Kalender
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedMonth}
                        onSelect={(date) => date && setSelectedMonth(date)}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Semester Tab */}
            <TabsContent value="semester">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Ringkasan Semester
                  </CardTitle>
                  <CardDescription>
                    Performa kehadiran selama semester ini
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{mockSemesterStats.attendanceRate}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Tingkat Hadir</div>
                    </div>
                    <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{mockSemesterStats.hadir}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Hadir</div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{mockSemesterStats.totalHours}j</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Jam</div>
                    </div>
                    <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">{mockSemesterStats.totalDays}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Hari</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Performa Keseluruhan</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Hadir</div>
                            <div className="text-sm text-gray-500">Jumlah kehadiran</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-semibold text-green-600">{mockSemesterStats.hadir}</div>
                            <div className="text-sm text-gray-500">
                              {((mockSemesterStats.hadir / mockSemesterStats.totalDays) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Izin</div>
                            <div className="text-sm text-gray-500">Jumlah izin</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-semibold text-yellow-600">{mockSemesterStats.izin}</div>
                            <div className="text-sm text-gray-500">
                              {((mockSemesterStats.izin / mockSemesterStats.totalDays) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Sakit</div>
                            <div className="text-sm text-gray-500">Jumlah sakit</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-semibold text-red-600">{mockSemesterStats.sakit}</div>
                            <div className="text-sm text-gray-500">
                              {((mockSemesterStats.sakit / mockSemesterStats.totalDays) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Alfa</div>
                            <div className="text-sm text-gray-500">Tanpa keterangan</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-semibold text-red-600">{mockSemesterStats.alfa}</div>
                            <div className="text-sm text-gray-500">
                              {((mockSemesterStats.alfa / mockSemesterStats.totalDays) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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