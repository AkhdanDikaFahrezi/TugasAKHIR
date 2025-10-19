"use client";

import { useState, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Webcam from "react-webcam";
import { 
  Camera, 
  CameraOff, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2,
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function DaftarPage() {
  const { isSignedIn } = useAuth();
  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    kelas: "",
    semester: ""
  });
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const webcamRef = useRef<Webcam>(null);
  
  const requiredImages = 5; // Jumlah gambar yang dibutuhkan untuk training

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImages(prev => [...prev, imageSrc]);
      }
    }
  }, []);

  const deleteCapturedImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nim || !formData.nama || !formData.kelas || !formData.semester) {
      setErrorMessage("Mohon lengkapi semua field yang diperlukan");
      setSubmitStatus("error");
      return;
    }

    if (capturedImages.length < requiredImages) {
      setErrorMessage(`Mohon ambil minimal ${requiredImages} foto wajah untuk registrasi`);
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // TODO: Implement backend API call
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     images: capturedImages,
      //     userId: userId
      //   })
      // });

      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus("success");
      setFormData({ nim: "", nama: "", kelas: "", semester: "" });
      setCapturedImages([]);
      setIsCameraOn(false);
    } catch (error) {
      setErrorMessage("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (capturedImages.length / requiredImages) * 100;

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Autentikasi Diperlukan</CardTitle>
            <CardDescription>
              Silakan masuk terlebih dahulu untuk melakukan pendaftaran
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
              Pendaftaran Pengguna Baru
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Lengkapi data diri Anda dan lakukan pemindaian wajah untuk registrasi sistem absensi
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Data Diri */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Data Diri
                </CardTitle>
                <CardDescription>
                  Isi informasi pribadi Anda dengan lengkap dan benar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nim">Nomor Induk Mahasiswa (NIM)</Label>
                    <Input
                      id="nim"
                      type="text"
                      placeholder="Contoh: 1234567890"
                      value={formData.nim}
                      onChange={(e) => handleInputChange("nim", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input
                      id="nama"
                      type="text"
                      placeholder="Contoh: John Doe"
                      value={formData.nama}
                      onChange={(e) => handleInputChange("nama", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kelas">Kelas</Label>
                    <Select value={formData.kelas} onValueChange={(value) => handleInputChange("kelas", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pagi">Kelas Pagi</SelectItem>
                        <SelectItem value="malam">Kelas Malam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={formData.semester} onValueChange={(value) => handleInputChange("semester", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih semester" />
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

                  {/* Status Alert */}
                  {submitStatus === "success" && (
                    <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Pendaftaran berhasil! Anda sekarang dapat menggunakan sistem absensi.
                      </AlertDescription>
                    </Alert>
                  )}

                  {submitStatus === "error" && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting || capturedImages.length < requiredImages}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Mendaftarkan...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Daftar Sekarang
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Pemindaian Wajah */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Pemindaian Wajah
                </CardTitle>
                <CardDescription>
                  Ambil {requiredImages} foto wajah dari berbagai sudut untuk akurasi terbaik
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Foto terkumpul</span>
                    <span>{capturedImages.length} / {requiredImages}</span>
                  </div>
                  <Progress value={progressPercentage} className="w-full" />
                </div>

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
                    </div>
                  )}

                  {/* Camera Controls */}
                  <div className="flex gap-2">
                    <Button
                      onClick={toggleCamera}
                      variant="outline"
                      className="flex-1"
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
                        onClick={captureImage}
                        disabled={capturedImages.length >= requiredImages}
                        className="flex-1"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Ambil Foto
                      </Button>
                    )}
                  </div>
                </div>

                {/* Captured Images */}
                {capturedImages.length > 0 && (
                  <div className="space-y-2">
                    <Label>Foto Terkumpul ({capturedImages.length})</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {capturedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Captured ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => deleteCapturedImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="sr-only">Delete</span>
                            ×
                          </button>
                          <Badge variant="secondary" className="absolute -bottom-1 -right-1 text-xs">
                            {index + 1}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Petunjuk Pemindaian:</h4>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Pastikan wajah terlihat jelas dan terang</li>
                    <li>• Hindari penggunaan masker atau kacamata hitam</li>
                    <li>• Ambil foto dari berbagai sudut wajah</li>
                    <li>• Pastikan ekspresi wajah netral</li>
                  </ul>
                </div>
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