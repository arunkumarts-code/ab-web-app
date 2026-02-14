"use client";

import { Check, CreditCard, Shield, Bell, Monitor, X, Settings } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import api from "@/configs/axios";
import { UserAuth } from "@/contexts/AuthContext";
import { ImagePlus } from "lucide-react";

// Validation Schema
const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  userNickName: Yup.string()
    .min(2, "Nick name must be at least 2 characters")
    .max(50, "Nick name must not exceed 50 characters"),
});

type TabType = "personal" | "security" | "notifications" | "preferences";

const ProfilePage = () => {
  const { user, setUser } = UserAuth();
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openImgMenu, setOpenImgMenu] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      userNickName: user?.userNickName || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      try {
        const result = await api.put("/user", {
          firstName: values.firstName,
          lastName: values.lastName,
          userNickName: values.userNickName
        });
        setUser({
          ...user,
          firstName: result.data.data.firstName,
          lastName: result.data.data.lastName,
          userNickName: result.data.data.userNickName
        } as any);
        setSuccessMessage("Profile updated successfully!");
        setIsEditMode(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        setErrorMessage("Failed to update profile. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleAvatarChange = async (avatar: string) => {
    const result = await api.put("/user/avatar", {
      userAvatar: avatar || "/avatar-images/74.png"
    });

    setUser({
      ...user,
      userAvatar: result.data.data.userAvatar,
    } as any);
  }

  return (
    <div className="min-h-full w-full space-y-8 pb-8">
      {/* Profile Header Card */}
      <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden relative">
        <div className="h-28 bg-gradient-to-r from-primary to-indigo-400"></div>

        <div className="px-6 pb-6 relative flex flex-col gap-3 md:flex-row -mt-10">
          <div className="relative w-25 h-25 cursor-pointer" onClick={() => setOpenImgMenu((pre)=> !pre)}>
            {/* Avatar */}
            <div className=" w-25 h-25 rounded-full border-4 overflow-hidden border-surface bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-400 shadow-md"
            >
              <img
                src={user?.userAvatar || "/images/avatar.png"}
                alt="User avatar"
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* Edit Icon */}
            <div
              className="absolute bottom-0 right-0 p-2 rounded-full text-foreground"
            >
              <ImagePlus size={25} />
            </div>
          </div>
          
          {openImgMenu && 
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Background Overlay */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                onClick={() => setOpenImgMenu(false)}
              />

              {/* Dialog Box */}
              <div className="relative z-50 w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Choose Avatar</h3>
                  <button
                  onClick={() => setOpenImgMenu(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 11 }, (_, i) => {
                    const img = `/avatar-images/${67 + i}.png`;
                    return (
                      <button
                        key={img}
                        onClick={() => {
                          handleAvatarChange(img);
                          setOpenImgMenu(false);
                        }}
                        className="w-20 h-20 rounded-full overflow-hidden border-1 border-border hover:border-primary transition"
                      >
                        <img src={img} className="h-full w-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          }

          <div className="flex-1 mt-0 md:mt-13">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              {user?.firstName} {user?.lastName}
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-2 py-0.5 rounded-full font-bold border border-green-200 dark:border-green-800 flex items-center gap-1">
                <Check className="w-3 h-3" />
                KYC Verified
              </span>
            </h1>
            <p className="text-sm text-muted">{user?.userEmail} • Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}</p>
          </div>

        </div>
      </div>

      {/* Two Column Layout - Left Sidebar + Right Content */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Tab Labels */}
        <div className="lg:col-span-1 space-y-1">
          <button 
            onClick={() => setActiveTab("personal")}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "personal"
                ? "bg-primary/10 text-primary"
                : "text-muted hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-foreground"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Personal
          </button>
          
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "security"
                ? "bg-primary/10 text-primary"
                : "text-muted hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-foreground"
            }`}
          >
            <Shield className="w-4 h-4" />
            Security
          </button>

          <button 
            onClick={() => setActiveTab("notifications")}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "notifications"
                ? "bg-primary/10 text-primary"
                : "text-muted hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-foreground"
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>

          <button 
            onClick={() => setActiveTab("preferences")}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "preferences"
                ? "bg-primary/10 text-primary"
                : "text-muted hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-foreground"
            }`}
          >
            <Settings className="w-4 h-4" />
            Preferences
          </button>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 bg-surface rounded-2xl shadow-sm border border-border p-6">
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-foreground">Personal Information</h3>
                <button
                  onClick={() => {
                    if (isEditMode) {
                      formik.resetForm();
                    }
                    setIsEditMode(!isEditMode);
                  }}
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  {isEditMode ? "Cancel" : "Edit"}
                </button>
              </div>

              {successMessage && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-300">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      readOnly={!isEditMode}
                      className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none transition ${
                        isEditMode ? "border-border focus:border-primary" : "border-border"
                      } ${formik.touched.firstName && formik.errors.firstName ? "border-red-500" : ""}`}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">{formik.errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      readOnly={!isEditMode}
                      className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none transition ${
                        isEditMode ? "border-border focus:border-primary" : "border-border"
                      } ${formik.touched.lastName && formik.errors.lastName ? "border-red-500" : ""}`}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">{formik.errors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase mb-2">Email Address</label>
                    <input
                      type="email"
                      value={user?.userEmail || ""}
                      className={`w-full bg-gray-50 dark:bg-gray-800 border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none ${
                        isEditMode ? "cursor-not-allowed" : "cursor-default"
                      }`}
                      readOnly
                      disabled
                    />
                    {isEditMode && (
                      <p className="text-xs text-muted mt-1">Email cannot be changed</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase mb-2">Nick Name</label>
                    <input
                      type="text"
                      name="userNickName"
                      value={formik.values.userNickName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      readOnly={!isEditMode}
                      className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none transition ${
                        isEditMode ? "border-border focus:border-primary" : "border-border"
                      } ${formik.touched.userNickName && formik.errors.userNickName ? "border-red-500" : ""}`}
                    />
                    {formik.touched.userNickName && formik.errors.userNickName && (
                      <p className="text-xs text-red-500 mt-1">{formik.errors.userNickName}</p>
                    )}
                  </div>
                </div>

                {isEditMode && (
                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      disabled={isLoading || !formik.isValid}
                      className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Updating..." : "Update"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        formik.resetForm();
                        setIsEditMode(false);
                      }}
                      className="px-6 py-2 border border-border text-foreground text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground">Security Settings</h3>

              <div className="flex items-center justify-between py-4 border-b border-border">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Password</h4>
                  <p className="text-xs text-muted">Last changed 3 months ago</p>
                </div>
                <button className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  Update
                </button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-border">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Two-Factor Authentication</h4>
                  <p className="text-xs text-muted">Add an extra layer of security to your account.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" disabled />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">Active Sessions</h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Monitor className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Windows 11 • Chrome</p>
                      <p className="text-xs text-muted">
                        Ipoh, Malaysia • 192.168.1.1 • <span className="text-green-500">Current Session</span>
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30 p-6">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground">Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Big Eye Boy, Small Road, Cockroach Road
                    </h4>
                    <p className="text-xs text-muted">
                      Show or hide in UI
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Language</h4>
                    <p className="text-xs text-muted">Select your preferred language</p>
                  </div>
                  <select className="bg-gray-50 dark:bg-gray-800 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary transition">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Currency</h4>
                    <p className="text-xs text-muted">Choose your preferred currency for display</p>
                  </div>
                  <select className="bg-gray-50 dark:bg-gray-800 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary transition">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>JPY (¥)</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground">Notifications</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Email Notifications</h4>
                    <p className="text-xs text-muted">Receive email updates about your account activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Push Notifications</h4>
                    <p className="text-xs text-muted">Receive push notifications on your devices</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Game Results</h4>
                    <p className="text-xs text-muted">Get notified when game sessions end</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Promotional Offers</h4>
                    <p className="text-xs text-muted">Receive information about special offers and promotions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Security Alerts</h4>
                    <p className="text-xs text-muted">Get notified about suspicious account activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="pt-4">
                  <button className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition">
                    Save Notifications
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;