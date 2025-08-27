// components/user/EditProfile.jsx
import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaSave, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../api/auth";
import { useTranslation } from "react-i18next";

const EditProfile = ({ profile: initialProfile, onUpdate }) => {
  const { token } = useAuth();
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    image: null,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setFormData({
        name: initialProfile.name || "",
        phone: initialProfile.phone || "",
        image: null,
      });
      setProfileImage(initialProfile.image || null);
    }
  }, [initialProfile]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError(t("userProfile.validation.nameRequired"));
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedProfile = await updateProfile(formData, token);
      setSuccess(true);
      setEditMode(false);
      if (onUpdate) onUpdate();
      setFormData({
        name: updatedProfile.name || formData.name,
        phone: updatedProfile.phone || formData.phone,
        image: null,
      });
      setProfileImage(updatedProfile.image || null);
    } catch (err) {
      setError(t("userProfile.updateError"));
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setError(null);
    setSuccess(false);
    setFormData({
      name: initialProfile.name || "",
      phone: initialProfile.phone || "",
      image: null,
    });
    setProfileImage(initialProfile.image || null);
  };

  if (!editMode) {
    return (
      <div className="mx-auto w-full p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {t("userProfile.studentProfile")}
            </h2>
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaSave
                className={`${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
                size={16}
              />
              {t("userProfile.edit")}
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-md">
                {t("userProfile.profileUpdated")}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="col-span-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("userProfile.name")}
                </p>
                <p className="text-gray-800">{formData.name || "N/A"}</p>
              </div>
              <div className="col-span-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("userProfile.email")}
                </p>
                <p className="text-gray-800">{initialProfile.email || "N/A"}</p>
              </div>
              <div className="col-span-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("userProfile.phone")}
                </p>
                <p className="text-gray-800">{formData.phone || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {t("userProfile.editStudentProfile")}
          </h2>
          <button
            onClick={handleCancel}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            {t("userProfile.cancel")}
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {success && (
            <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-md">
              {t("userProfile.profileUpdated")}
            </div>
          )}
          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="col-span-1 md:col-span-2">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {t("userProfile.profilePicture")}
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative">
                    <img
                      src={profileImage || "/default-avatar.png"}
                      alt="Profile"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-md object-cover"
                    />
                    {profileImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <FaTimes size={16} />
                      </button>
                    )}
                  </div>
                  <label className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                    <FaCloudUploadAlt
                      className={`${
                        i18n.language === "ar" ? "ml-2" : "mr-2"
                      }`}
                      size={16}
                    />
                    {t("userProfile.change")}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("userProfile.name")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("userProfile.phone")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1 md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                      {t("userProfile.saving")}
                    </div>
                  ) : (
                    <>
                      <FaSave
                        className={`${
                          i18n.language === "ar" ? "ml-2" : "mr-2"
                        }`}
                        size={16}
                      />
                      {t("userProfile.saveChanges")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
