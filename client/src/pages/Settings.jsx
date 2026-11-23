import { useEffect, useState, useRef } from "react";
import { profile, updateImage, updateProfile } from "../services/userApi";

import {
  UserRound,
  Mail,
  ShieldCheck,
  Camera,
  Settings as SettingsIcon,
  Pencil,
  Save,
  X,
} from "lucide-react";

export default function Settings() {
  const [pro, setPro] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const fileRef = useRef(null);

  // Get Profile
  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await profile();
        setPro(res?.profile);
        setName(res?.profile?.name || "");
      } catch (error) {
        console.log("Profile Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  // Upload Profile Image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const res = await updateImage(file);

      setPro((prev) => ({
        ...prev,
        image: res.imageUrl,
      }));

      alert("Profile image updated successfully");
    } catch (error) {
      console.log("Image Upload Error:", error);
      alert(error.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Save Name
  const handleSaveName = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (name.trim() === pro.name) {
      setEditing(false);
      return;
    }

    try {
      setSaving(true);

      const res = await updateProfile(name.trim());

      setPro((prev) => ({
        ...prev,
        ...res.profile,
      }));

      setName(res.profile.name);
      setEditing(false);

      alert("Name updated successfully");
    } catch (error) {
      console.log("Update Name Error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Cancel Editing
  const handleCancel = () => {
    setName(pro.name);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading profile...
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <SettingsIcon className="text-emerald-600" size={25} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Settings
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-7 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">
              Profile Information
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Your personal account details
            </p>
          </div>

          <div className="p-5 sm:p-7">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              <div className="relative w-20 h-20 shrink-0">
                {pro.image ? (
                  <img
                    src={pro.image}
                    alt="Profile"
                    className="w-full h-full rounded-2xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <UserRound size={35} className="text-emerald-600" />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  title="Upload profile picture"
                  disabled={uploading}
                  onClick={() => fileRef.current.click()}
                  className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-full shadow-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-lg">{pro.name}</h3>

                <p className="text-sm text-slate-500">Account Profile</p>

                {uploading ? (
                  <p className="text-xs text-emerald-600 mt-2">
                    Uploading image...
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 mt-2">
                    Click camera to change picture
                  </p>
                )}
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={19}
                  />

                  <input
                    type="text"
                    value={name}
                    readOnly={!editing}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition ${
                      editing
                        ? "border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-100"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  />
                </div>

                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    <Pencil size={15} />
                    Edit Name
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-3 mt-3">
                    <button
                      type="button"
                      onClick={handleSaveName}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <Save size={15} />
                      {saving ? "Saving..." : "Save"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
                    >
                      <X size={15} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={19}
                  />

                  <input
                    type="email"
                    value={pro.email || ""}
                    readOnly
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none"
                  />
                </div>

                <p className="text-xs text-slate-400 mt-3">
                  Email address cannot be changed here.
                </p>
              </div>
            </div>

            {/* Account Status */}
            <div className="mt-7 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
              <ShieldCheck className="text-emerald-600" size={23} />

              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Account Information
                </p>

                <p className="text-xs text-emerald-700 mt-1">
                  Your profile information is securely loaded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
