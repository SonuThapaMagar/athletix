import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdNotifications,
  MdEmail,
  MdSecurity,
  MdLanguage,
  MdVolumeUp,
  MdLocationOn,
  MdDelete,
  MdSave,
  MdClose,
  MdLock,
} from "react-icons/md";
import PlayerNavLayout from "@/layout/PlayerNavLayout";
import { CHANGE_PASSWORD_ACTION } from "@/redux/actions/user.actions";
import { toast } from "sonner";

interface UserSettings {
  // notifications: {
  //   email: boolean
  //   push: boolean
  //   sms: boolean
  //   bookingReminders: boolean
  //   matchmakingUpdates: boolean
  //   promotionalEmails: boolean
  // }
  // privacy: {
  //   profileVisibility: 'public' | 'friends' | 'private'
  //   showLocation: boolean
  //   showStats: boolean
  //   allowFriendRequests: boolean
  // }
  // preferences: {
  //   language: string
  //   theme: 'light' | 'dark' | 'system'
  //   soundEffects: boolean
  //   vibration: boolean
  //   defaultSport: string
  //   preferredTimeSlots: string[]
  // }
  account: {
    twoFactorAuth: boolean;
    loginNotifications: boolean;
    dataExport: boolean;
  };
}

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [settings, setSettings] = useState<UserSettings>({
    // notifications: {
    //   email: true,
    //   push: true,
    //   sms: false,
    //   bookingReminders: true,
    //   matchmakingUpdates: true,
    //   promotionalEmails: false
    // },
    // privacy: {
    //   profileVisibility: 'public',
    //   showLocation: true,
    //   showStats: true,
    //   allowFriendRequests: true
    // },
    // preferences: {
    //   language: 'en',
    //   theme: 'system',
    //   soundEffects: true,
    //   vibration: true,
    //   defaultSport: 'Basketball',
    //   preferredTimeSlots: ['Evening', 'Weekend']
    // },
    account: {
      twoFactorAuth: false,
      loginNotifications: true,
      dataExport: false,
    },
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSettingChange = (
    category: keyof UserSettings,
    setting: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save to API
    console.log("Settings saved:", settings);
  };

  const handleDeleteAccount = () => {
    // Here you would typically handle account deletion
    console.log("Account deletion requested");
    setShowDeleteModal(false);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsChangingPassword(true);
    try {
      await CHANGE_PASSWORD_ACTION({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change password"
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs = [
    // { id: 'notifications', label: 'Notifications', icon: MdNotifications },
    // { id: 'privacy', label: 'Privacy', icon: MdSecurity },
    // { id: 'preferences', label: 'Preferences', icon: MdLanguage },
    { id: "account", label: "Account", icon: MdEmail },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MdArrowBack className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 text-[#2c5aa0] hover:text-[#1e3d6f] transition-colors"
            >
              <MdSave className="w-5 h-5" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                        activeTab === tab.id
                          ? "bg-[#2c5aa0] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              {/* Notifications Tab */}
              {/* {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <MdEmail className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium text-gray-900">Email Notifications</h3>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.email}
                          onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2c5aa0]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c5aa0]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <MdNotifications className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium text-gray-900">Push Notifications</h3>
                          <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.push}
                          onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2c5aa0]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c5aa0]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <MdEmail className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium text-gray-900">Booking Reminders</h3>
                          <p className="text-sm text-gray-600">Get reminded about upcoming bookings</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.bookingReminders}
                          onChange={(e) => handleSettingChange('notifications', 'bookingReminders', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2c5aa0]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c5aa0]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <MdEmail className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium text-gray-900">Promotional Emails</h3>
                          <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.promotionalEmails}
                          onChange={(e) => handleSettingChange('notifications', 'promotionalEmails', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2c5aa0]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c5aa0]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Privacy Tab */}
              {/* {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="py-3 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-2">Profile Visibility</h3>
                      <p className="text-sm text-gray-600 mb-3">Control who can see your profile</p>
                      <div className="space-y-2">
                        {[
                          { value: 'public', label: 'Public - Everyone can see your profile' },
                          { value: 'friends', label: 'Friends Only - Only your friends can see your profile' },
                          { value: 'private', label: 'Private - Only you can see your profile' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="profileVisibility"
                              value={option.value}
                              checked={settings.privacy.profileVisibility === option.value}
                              onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                              className="w-4 h-4 text-[#2c5aa0] focus:ring-[#2c5aa0]"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <MdLocationOn className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium text-gray-900">Show Location</h3>
                          <p className="text-sm text-gray-600">Display your location on your profile</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.showLocation}
                          onChange={(e) => handleSettingChange('privacy', 'showLocation', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2c5aa0]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c5aa0]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <MdSecurity className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium text-gray-900">Allow Friend Requests</h3>
                          <p className="text-sm text-gray-600">Let other users send you friend requests</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.allowFriendRequests}
                          onChange={(e) => handleSettingChange('privacy', 'allowFriendRequests', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2c5aa0]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c5aa0]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Preferences Tab */}
              {/* {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="py-3 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-2">Language</h3>
                      <select
                        value={settings.preferences.language}
                        onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div className="py-3 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-2">Theme</h3>
                      <div className="space-y-2">
                        {[
                          { value: 'light', label: 'Light' },
                          { value: 'dark', label: 'Dark' },
                          { value: 'system', label: 'System' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="theme"
                              value={option.value}
                              checked={settings.preferences.theme === option.value}
                              onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                              className="w-4 h-4 text-[#2c5aa0] focus:ring-[#2c5aa0]"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="py-3 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-2">Default Sport</h3>
                      <select
                        value={settings.preferences.defaultSport}
                        onChange={(e) => handleSettingChange('preferences', 'defaultSport', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                      >
                        <option value="Basketball">Basketball</option>
                        <option value="Football">Football</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Volleyball">Volleyball</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <MdVolumeUp className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium text-gray-900">Sound Effects</h3>
                          <p className="text-sm text-gray-600">Play sound effects for interactions</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.preferences.soundEffects}
                          onChange={(e) => handleSettingChange('preferences', 'soundEffects', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2c5aa0]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c5aa0]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Account Tab */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Account Settings
                  </h2>

                  <div className="space-y-4">
                    {/* Change Password Section */}
                    <div className="py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <MdLock className="w-5 h-5 text-gray-500" />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Password
                            </h3>
                            <p className="text-sm text-gray-600">
                              Change your account password
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPasswordModal(true)}
                          className="px-4 py-2 text-sm font-medium text-[#2c5aa0] border border-[#2c5aa0] rounded-lg hover:bg-[#2c5aa0] hover:text-white transition-colors cursor-pointer"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>

                    {/* <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <MdSecurity className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.account.twoFactorAuth}
                          onChange={(e) => handleSettingChange('account', 'twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2c5aa0]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c5aa0]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <MdEmail className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium text-gray-900">Login Notifications</h3>
                          <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.account.loginNotifications}
                          onChange={(e) => handleSettingChange('account', 'loginNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2c5aa0]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c5aa0]"></div>
                      </label>
                    </div>

                    <div className="py-6 border-t border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-2">Danger Zone</h3>
                      <p className="text-sm text-gray-600 mb-4">These actions are irreversible. Please proceed with caution.</p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <MdDelete className="w-4 h-4" />
                        Delete Account
                      </button>
                    </div> */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Change Password
              </h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                disabled={isChangingPassword}
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                  placeholder="Enter current password"
                  disabled={isChangingPassword}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                  placeholder="Enter new password"
                  disabled={isChangingPassword}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                  placeholder="Confirm new password"
                  disabled={isChangingPassword}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  disabled={isChangingPassword}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={
                    isChangingPassword ||
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  }
                  className="flex-1 bg-[#2c5aa0] text-white py-2 px-4 rounded-lg hover:bg-[#1e3d6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Account
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete your account? This action cannot
                be undone and will permanently remove all your data, including:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Your profile and personal information</li>
                <li>• All booking history</li>
                <li>• Game statistics and achievements</li>
                <li>• Friends and connections</li>
              </ul>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
