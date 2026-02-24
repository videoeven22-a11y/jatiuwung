'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, Bell, Phone, MapPin, Clock, 
  Shield, ChevronRight, MessageCircle, Calendar,
  Building2, Heart, Award, Megaphone
} from 'lucide-react';
import { Resident, ServiceRequest, RTConfig, Information } from '@/lib/types';

interface PublicDashboardProps {
  rtConfig: RTConfig;
  residents: Resident[];
  requests: ServiceRequest[];
  onLoginClick: () => void;
}

export default function PublicDashboard({ rtConfig, residents, requests, onLoginClick }: PublicDashboardProps) {
  const [informations, setInformations] = useState<Information[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInformations = async () => {
      try {
        const res = await fetch('/api/information');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setInformations(data.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching information:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInformations();
  }, []);

  // Calculate statistics
  const totalWarga = residents.length;
  const wargaAktif = residents.filter(r => r.status === 'AKTIF').length;
  const pengajuanSurat = requests.filter(r => r.status === 'Menunggu Verifikasi').length;
  
  // Get pengumuman
  const pengumuman = informations.filter(i => i.category === 'pengumuman' && i.isActive).slice(0, 3);
  const jadwal = informations.filter(i => i.category === 'jadwal' && i.isActive).slice(0, 3);
  const links = informations.filter(i => i.category === 'link' && i.isActive);

  // Available services
  const layanan = [
    { name: 'Surat Keterangan Domisili', icon: FileText, color: 'bg-blue-500' },
    { name: 'Surat Keterangan Tidak Mampu', icon: Heart, color: 'bg-rose-500' },
    { name: 'Surat Keterangan Usaha', icon: Building2, color: 'bg-emerald-500' },
    { name: 'Surat Keterangan Kematian', icon: Award, color: 'bg-purple-500' },
    { name: 'Surat Pengantar KTP/KK', icon: Users, color: 'bg-orange-500' },
    { name: 'Surat Keterangan Lainnya', icon: FileText, color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            {rtConfig.appLogo ? (
              <img src={rtConfig.appLogo} alt="Logo" className="w-12 h-12 object-contain" />
            ) : (
              <Shield className="w-10 h-10 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{rtConfig.appName || 'SmartWarga RT'}</h1>
            <p className="text-emerald-100 text-sm">Portal Layanan Warga</p>
          </div>
        </div>
        
        <p className="text-emerald-50 text-sm mt-4">
          Selamat datang di portal layanan digital RT. Silakan gunakan layanan kami untuk mengurus surat dan keperluan administrasi lainnya.
        </p>
        
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
            <Users className="w-6 h-6 mx-auto mb-1 text-emerald-100" />
            <div className="text-2xl font-bold">{totalWarga}</div>
            <div className="text-xs text-emerald-100">Total Warga</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
            <Heart className="w-6 h-6 mx-auto mb-1 text-green-200" />
            <div className="text-2xl font-bold">{wargaAktif}</div>
            <div className="text-xs text-emerald-100">Warga Aktif</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
            <FileText className="w-6 h-6 mx-auto mb-1 text-yellow-200" />
            <div className="text-2xl font-bold">{pengajuanSurat}</div>
            <div className="text-xs text-emerald-100">Pengajuan</div>
          </div>
        </div>
      </div>

      {/* Pengumuman Section */}
      {pengumuman.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-5 h-5 text-amber-600" />
            <h2 className="font-semibold text-amber-800">Pengumuman</h2>
          </div>
          <div className="space-y-2">
            {pengumuman.map((item, index) => (
              <div key={item.id || index} className="bg-white rounded-lg p-3 shadow-sm">
                <h3 className="font-medium text-slate-800">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layanan Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Layanan Administrasi
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {layanan.map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Jadwal Section */}
      {jadwal.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Jadwal Kegiatan
          </h2>
          <div className="space-y-2">
            {jadwal.map((item, index) => (
              <div key={item.id || index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Link Penting */}
      {links.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-blue-600" />
            Link Penting
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {links.map((item, index) => (
              <a
                key={item.id || index}
                href={item.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">{item.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Kontak RT */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-emerald-600" />
          Kontak RT
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Ketua RT</div>
              <div className="font-medium text-slate-800">{rtConfig.rtName || 'Pak RT'}</div>
            </div>
          </div>
          {rtConfig.rtWhatsapp && (
            <a 
              href={`https://wa.me/${rtConfig.rtWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-slate-500">WhatsApp</div>
                <div className="font-medium text-green-700">Hubungi via WhatsApp</div>
              </div>
              <ChevronRight className="w-5 h-5 text-green-600 ml-auto" />
            </a>
          )}
          {rtConfig.rtEmail && (
            <a 
              href={`mailto:${rtConfig.rtEmail}`}
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Email</div>
                <div className="font-medium text-blue-700">{rtConfig.rtEmail}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-blue-600 ml-auto" />
            </a>
          )}
        </div>
      </div>

      {/* Admin Login Button - Subtle */}
      <div className="text-center pt-2 pb-4">
        <p className="text-sm text-slate-400">
          Login admin tersedia di pojok kanan atas →
        </p>
      </div>
    </div>
  );
}
