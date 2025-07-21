import React, { useState } from 'react';
import {
  Settings,
  Save,
  Bell,
  Mail,
  Shield,
  Database,
  Globe,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      reportApproval: true,
      newRegistration: true,
      systemAlerts: true,
    },
    system: {
      autoApproval: false,
      maxInternDuration: 6,
      minInternDuration: 2,
      maxCapacityPerCompany: 50,
      requirementValidation: true,
    },
    email: {
      smtpServer: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'system@magang.com',
      smtpPassword: '••••••••',
    },
    security: {
      sessionTimeout: 30,
      passwordComplexity: true,
      twoFactorAuth: false,
      loginAttempts: 3,
    },
  });

  const handleNotificationChange = (key) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleSystemChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      system: {
        ...prev.system,
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    alert('Pengaturan berhasil disimpan!');
  };

  const ToggleSwitch = ({ checked, onChange }) => {
    return (
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-[#006DA6]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pengaturan Sistem
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola konfigurasi dan preferensi sistem
          </p>
        </div>
        <button
          onClick={handleSave}
          className="bg-[#006DA6] text-white px-4 py-2 rounded-lg hover:bg-[#002942] transition-colors flex items-center space-x-2"
        >
          <Save size={20} />
          <span>Simpan Pengaturan</span>
        </button>
      </div>

      {/* Notifications Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#BFDCFF] to-[#006DA6] rounded-lg">
            <Bell size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notifikasi</h2>
            <p className="text-sm text-gray-600">
              Atur preferensi notifikasi sistem
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Notifications
              </label>
              <p className="text-sm text-gray-500">
                Terima notifikasi melalui email
              </p>
            </div>
            <ToggleSwitch
              checked={settings.notifications.emailNotifications}
              onChange={() => handleNotificationChange('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Push Notifications
              </label>
              <p className="text-sm text-gray-500">
                Terima notifikasi push di browser
              </p>
            </div>
            <ToggleSwitch
              checked={settings.notifications.pushNotifications}
              onChange={() => handleNotificationChange('pushNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Report Approval
              </label>
              <p className="text-sm text-gray-500">
                Notifikasi ketika ada laporan yang perlu disetujui
              </p>
            </div>
            <ToggleSwitch
              checked={settings.notifications.reportApproval}
              onChange={() => handleNotificationChange('reportApproval')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-700">
                New Registration
              </label>
              <p className="text-sm text-gray-500">
                Notifikasi ketika ada pendaftar baru
              </p>
            </div>
            <ToggleSwitch
              checked={settings.notifications.newRegistration}
              onChange={() => handleNotificationChange('newRegistration')}
            />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#BFDCFF] to-[#006DA6] rounded-lg">
            <Settings size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Pengaturan Sistem
            </h2>
            <p className="text-sm text-gray-600">
              Konfigurasi umum sistem magang
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durasi Maksimal Magang (bulan)
              </label>
              <input
                type="number"
                value={settings.system.maxInternDuration}
                onChange={(e) =>
                  handleSystemChange(
                    'maxInternDuration',
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durasi Minimal Magang (bulan)
              </label>
              <input
                type="number"
                value={settings.system.minInternDuration}
                onChange={(e) =>
                  handleSystemChange(
                    'minInternDuration',
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kapasitas Maksimal per Perusahaan
              </label>
              <input
                type="number"
                value={settings.system.maxCapacityPerCompany}
                onChange={(e) =>
                  handleSystemChange(
                    'maxCapacityPerCompany',
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Auto Approval
                </label>
                <p className="text-sm text-gray-500">
                  Otomatis menyetujui pendaftaran
                </p>
              </div>
              <ToggleSwitch
                checked={settings.system.autoApproval}
                onChange={() =>
                  handleSystemChange(
                    'autoApproval',
                    !settings.system.autoApproval
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#BFDCFF] to-[#006DA6] rounded-lg">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Keamanan</h2>
            <p className="text-sm text-gray-600">
              Pengaturan keamanan dan akses sistem
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (menit)
              </label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={settings.security.loginAttempts}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password Complexity
                </label>
                <p className="text-sm text-gray-500">
                  Wajib menggunakan password yang kompleks
                </p>
              </div>
              <ToggleSwitch
                checked={settings.security.passwordComplexity}
                onChange={() => {}}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Two Factor Authentication
                </label>
                <p className="text-sm text-gray-500">
                  Aktivasi 2FA untuk admin
                </p>
              </div>
              <ToggleSwitch
                checked={settings.security.twoFactorAuth}
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
