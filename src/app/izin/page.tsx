"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Filter
} from "lucide-react";
import Link from "next/link";

// Mock data - nanti akan diambil dari backend API
const mockLeaveRequests = [
  {
    id: 1,
    type: "izin",
    reason: "Ada kepentingan keluarga di luar kota",
    date: "2024-10-20",
    duration: "1 hari",
    status: "pending",
    createdAt: "2024-10-18",
    attachment: null
  },
  {
    id: 2,
    type: "sakit",
    reason: "Demam dan flu",
    date: "2024-10-15",
    duration: "2 hari",
    status: "approved",
    createdAt: "2024-10-14",
    attachment: "surat_dokter.pdf"
  },
  {
    id: 3,
    type: "izin",
    reason: "Mengikuti seminar",
    date: "2024-10-10",
    duration: "1 hari",
    status: "rejected",
    createdAt: "2024-10-08",
    attachment: "undangan_seminar.pdf",
    rejectReason: "Waktu tidak sesuai dengan jadwal kuliah"
  },
];

type LeaveRequest = typeof mockLeaveRequests[0];

export default function IzinPage() {
  const { isSignedIn } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  
  const [formData, setFormData] = useState({
    type: "",
    reason: "",
    date: "",
    duration: "1 hari"
  });

  const resetForm = () => {
    setFormData({
      type: "",
      reason: "",
      date: "",
      duration: "1 hari"
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.reason || !formData.date) {
      setSubmitStatus("error");
      return;
    }

    try {
      // TODO: Implement backend API call
      const newRequest: LeaveRequest = {
        id: Date.now(),
        type: formData.type as "izin" | "sakit",
        reason: formData.reason,
        date: formData.date,
        duration: formData.duration,
        status: "pending",
        createdAt: new Date().toISOString().split('T')[0],
        attachment: null
      };

      setLeaveRequests(prev => [newRequest, ...prev]);
      resetForm();
      setIsCreateDialogOpen(false);
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  const handleEdit = (request: LeaveRequest) => {
    setEditingRequest(request);
    setFormData({
      type: request.type,
      reason: request.reason,
      date: request.date,
      duration: request.duration
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingRequest || !formData.type || !formData.reason || !formData.date) {
      setSubmitStatus("error");
      return;
    }

    try {
      // TODO: Implement backend API call
      setLeaveRequests(prev => prev.map(req => 
        req.id === editingRequest.id 
          ? { 
              ...req, 
              type: formData.type as "izin" | "sakit",
              reason: formData.reason, 
              date: formData.date,
              duration: formData.duration
            }
          : req
      ));
      
      setIsEditDialogOpen(false);
      setEditingRequest(null);
      resetForm();
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus permintaan izin ini?")) {
      try {
        // TODO: Implement backend API call
        setLeaveRequests(prev => prev.filter(req => req.id !== id));
      } catch (error) {
        setSubmitStatus("error");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Disetujui</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Ditolak</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Menunggu</Badge>;
      default:
        return <Badge variant="secondary">Tidak Diketahui</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant={type === "izin" ? "default" : "secondary"}>
        {type === "izin" ? "Izin" : "Sakit"}
      </Badge>
    );
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesType = filterType === "all" || request.type === filterType;
    return matchesStatus && matchesType;
  });

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Autentikasi Diperlukan</CardTitle>
            <CardDescription>
              Silakan masuk terlebih dahulu untuk mengelola permintaan izin
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Manajemen Izin & Sakit
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Ajukan, kelola, dan pantau permintaan izin Anda
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajukan Izin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajukan Permintaan Izin</DialogTitle>
                  <DialogDescription>
                    Isi form berikut untuk mengajukan permintaan izin atau sakit
                  </DialogDescription>
                </DialogHeader>
                
                {submitStatus === "success" && (
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      Permintaan izin berhasil diajukan!
                    </AlertDescription>
                  </Alert>
                )}

                {submitStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Mohon lengkapi semua field yang diperlukan
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Jenis Izin</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis izin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="izin">Izin</SelectItem>
                        <SelectItem value="sakit">Sakit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Tanggal</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Durasi</Label>
                    <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 hari">1 hari</SelectItem>
                        <SelectItem value="2 hari">2 hari</SelectItem>
                        <SelectItem value="3 hari">3 hari</SelectItem>
                        <SelectItem value="1 minggu">1 minggu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Alasan</Label>
                    <Textarea
                      id="reason"
                      placeholder="Jelaskan alasan permintaan izin Anda..."
                      value={formData.reason}
                      onChange={(e) => handleInputChange("reason", e.target.value)}
                      required
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit">
                      Ajukan Permintaan
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Permintaan</p>
                    <p className="text-2xl font-bold">{leaveRequests.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Menunggu</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {leaveRequests.filter(r => r.status === "pending").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disetujui</p>
                    <p className="text-2xl font-bold text-green-600">
                      {leaveRequests.filter(r => r.status === "approved").length}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ditolak</p>
                    <p className="text-2xl font-bold text-red-600">
                      {leaveRequests.filter(r => r.status === "rejected").length}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="izin">Izin</SelectItem>
                    <SelectItem value="sakit">Sakit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requests List */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Permintaan Izin</CardTitle>
              <CardDescription>
                Riwayat permintaan izin dan sakit Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Tidak ada permintaan izin yang ditemukan
                    </p>
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getTypeBadge(request.type)}
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="flex gap-2">
                          {request.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(request)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(request.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Tanggal:</span>
                          <span>{new Date(request.date).toLocaleDateString('id-ID', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                          <span className="text-gray-500">({request.duration})</span>
                        </div>

                        <div className="text-sm">
                          <span className="font-medium">Alasan:</span>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">{request.reason}</p>
                        </div>

                        {request.attachment && (
                          <div className="text-sm">
                            <span className="font-medium">Lampiran:</span>
                            <Badge variant="outline" className="ml-2">
                              {request.attachment}
                            </Badge>
                          </div>
                        )}

                        {request.rejectReason && (
                          <div className="text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <span className="font-medium text-red-600 dark:text-red-400">Alasan Penolakan:</span>
                            <p className="text-red-600 dark:text-red-400 mt-1">{request.rejectReason}</p>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 pt-2 border-t">
                          Diajukan pada: {new Date(request.createdAt).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Permintaan Izin</DialogTitle>
                <DialogDescription>
                  Perbarui informasi permintaan izin Anda
                </DialogDescription>
              </DialogHeader>
              
              {submitStatus === "success" && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Permintaan izin berhasil diperbarui!
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Jenis Izin</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis izin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="izin">Izin</SelectItem>
                      <SelectItem value="sakit">Sakit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-date">Tanggal</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Durasi</Label>
                  <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 hari">1 hari</SelectItem>
                      <SelectItem value="2 hari">2 hari</SelectItem>
                      <SelectItem value="3 hari">3 hari</SelectItem>
                      <SelectItem value="1 minggu">1 minggu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-reason">Alasan</Label>
                  <Textarea
                    id="edit-reason"
                    placeholder="Jelaskan alasan permintaan izin Anda..."
                    value={formData.reason}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                    required
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit">
                    Simpan Perubahan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

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