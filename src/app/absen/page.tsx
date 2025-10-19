"use client";

import { useState, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Webcam from "react-webcam";
import { 
  Camera, 
  CameraOff, 
  Clock, 
  LogIn, 
  LogOut,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  User,
  Calendar,
  MapPin
} from "lucide-react";
import Link from "next/link";

export default function AbsenPage() {
  const { isSignedIn } = useAuth();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attendanceType, setAttendanceType] = useState<"masuk" | "pulang">("masuk");
  const [attendanceResult, setAttendanceResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const webcamRef = useRef<Webcam>(null);

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    setAttendanceResult(null);
    setErrorMessage("");
  };

  const captureAndVerify = useCallback(async () => {
    if (!webcamRef.current) return;

    setIsProcessing(true);
    setErrorMessage("");
    setAttendanceResult(null);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (!imageSrc) {
        setErrorMessage("Gagal mengambil foto. Silakan coba lagi.");
        return;
      }

      // TODO: Implement backend API call for face verification
      // const response = await fetch('/api/verify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     image: imageSrc,
      //     type: attendanceType
      //   })
      // });

      // Simulasi API call dengan mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - simulasikan berhasil dengan data mahasiswa
      const mockResponse = {
        success: true,
        data: {
          student: {
            nim: "1234567890",
            nama: "Ahmad Rizki",
            kelas: "Pagi",
            semester: "5"
          },
          attendance: {
            id: "att_" + Date.now(),
            type: attendanceType,
            timestamp: new Date().toISOString(),
            location: "Kampus Utama"
          }
        }
      };

      if (mockResponse.success) {
        setAttendanceResult(mockResponse.data);
      } else {
        // Simulasikan scenario mahasiswa belum terdaftar
        if (Math.random() > 0.7) {
          setErrorMessage("Wajah tidak dikenali. Pastikan Anda sudah terdaftar atau coba lagi dengan pencahayaan yang lebih baik.");
        } else {
          setErrorMessage("Terjadi kesalahan saat verifikasi. Silakan coba lagi.");
        }
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan saat memproses absensi. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  }, [attendanceType]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Autentikasi Diperlukan</CardTitle>
            <CardDescription>
              Silakan masuk terlebih dahulu untuk melakukan absensi
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Sistem Absensi
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Lakukan presensi masuk atau pulang dengan pengenalan wajah
            </p>
          </div>

          {/* Attendance Type Selection */}
          <Tabs value={attendanceType} onValueChange={(value) => setAttendanceType(value as "masuk" | "pulang")} className="mb-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="masuk" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Absen Masuk
                </TabsTrigger>
                <TabsTrigger value="pulang" className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Absen Pulang
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="masuk" className="mt-6">
              <div className="text-center">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                  <LogIn className="h-3 w-3 mr-1" />
                  Waktu masuk: 07:00 - 09:00
                </Badge>
              </div>
            </TabsContent>

            <TabsContent value="pulang" className="mt-6">
              <div className="text-center">
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                  <LogOut className="h-3 w-3 mr-1" />
                  Waktu pulang: 17:00 - 21:00
                </Badge>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Camera Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Pemindaian Wajah
                </CardTitle>
                <CardDescription>
                  Arahkan wajah Anda ke kamera untuk verifikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Camera View */}
                <div className="space-y-4">
                  {!isCameraOn ? (
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <CameraOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Kamera tidak aktif
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full rounded-lg aspect-video object-cover"
                        mirrored={true}
                      />
                      <div className="absolute inset-0 rounded-lg border-2 border-dashed border-blue-400 pointer-events-none" />
                      <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                        Posisikan wajah di tengah
                      </div>
                      {isProcessing && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Memverifikasi wajah...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Camera Controls */}
                  <div className="flex gap-2">
                    <Button
                      onClick={toggleCamera}
                      variant="outline"
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      {isCameraOn ? (
                        <>
                          <CameraOff className="h-4 w-4 mr-2" />
                          Matikan Kamera
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4 mr-2" />
                          Aktifkan Kamera
                        </>
                      )}
                    </Button>
                    {isCameraOn && (
                      <Button
                        onClick={captureAndVerify}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Memproses...
                          </>
                        ) : (
                          <>
                            <Camera className="h-4 w-4 mr-2" />
                            {attendanceType === "masuk" ? "Absen Masuk" : "Absen Pulang"}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Petunjuk Absensi:</h4>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Pastikan wajah terlihat jelas dan terang</li>
                    <li>• Lepaskan masker dan kacamata hitam</li>
                    <li>• Pastikan tidak ada orang lain di frame</li>
                    <li>• Tunggu hingga proses verifikasi selesai</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Result Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Hasil Absensi
                </CardTitle>
                <CardDescription>
                  Informasi hasil verifikasi dan data absensi
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceResult ? (
                  <div className="space-y-4">
                    {/* Success Message */}
                    <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Absensi {attendanceType === "masuk" ? "masuk" : "pulang"} berhasil!
                      </AlertDescription>
                    </Alert>

                    {/* Student Info */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Data Mahasiswa
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">NIM:</span>
                          <span className="font-medium">{attendanceResult.student.nim}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Nama:</span>
                          <span className="font-medium">{attendanceResult.student.nama}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Kelas:</span>
                          <span className="font-medium">{attendanceResult.student.kelas}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Semester:</span>
                          <span className="font-medium">{attendanceResult.student.semester}</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendance Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Data Absensi
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Jenis:</span>
                          <Badge variant={attendanceType === "masuk" ? "default" : "secondary"}>
                            {attendanceType === "masuk" ? "Masuk" : "Pulang"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Waktu:</span>
                          <span className="font-medium">
                            {new Date(attendanceResult.attendance.timestamp).toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Lokasi:</span>
                          <span className="font-medium flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {attendanceResult.attendance.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button className="w-full" asChild>
                        <Link href="/profil">
                          Lihat Profil Saya
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/riwayat">
                          Lihat Riwayat Absensi
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Belum ada hasil absensi. Silakan lakukan pemindaian wajah terlebih dahulu.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

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