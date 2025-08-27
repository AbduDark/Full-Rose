const API_BASE = import.meta.env.VITE_API_BASE;
export const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message.ar || "Login failed. Please check your credentials."
    );
  }

  return data;
};
export const register = async (userData, lang = "ar") => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    if (data.errors) {
      const messages = Object.values(data.errors)
        .map((errObj) => {
          const msg = errObj[lang] || errObj["en"] || "";
          return msg.split("|")[0].trim();
        })
        .join(" - ");

      throw new Error(messages);
    }
    throw new Error(
      data.message?.[lang] ||
        data.message?.en ||
        "Registration failed. Please check your information."
    );
  }

  return data;
};
export const logout = async (token) => {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const forgotPassword = async (email) => {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};
export const resetPassword = async (userData) => {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};
export const verifyEmail = async (email, pin) => {
  const res = await fetch(`${API_BASE}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, pin }),
  });
  return res.json();
};
export const getProfile = async (token) => {
  if (!token) {
    throw new Error("No authentication token provided");
  }
  try {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = res.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      const message =
        (typeof payload === "object" && payload?.message) ||
        (typeof payload === "string"
          ? `Server error (${res.status}): ${payload
              .substring(0, 180)
              .replace(/\n/g, " ")}`
          : `Failed to fetch profile (Status: ${res.status})`);
      throw new Error(message);
    }
    return payload.data || payload;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
export const updateProfile = async ({ name, phone, image }, token) => {
  if (!token) {
    throw new Error("No authentication token provided");
  }

  if (!name && !phone && !image) {
    throw new Error("At least one field (name, phone, or image) is required");
  }

  const formData = new FormData();
  if (name) formData.append("name", name.trim());
  if (phone) formData.append("phone", phone.trim());
  if (image instanceof File) {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(image.type)) {
      throw new Error("Image must be a JPEG, PNG, or GIF");
    }
    if (image.size > 5 * 1024 * 1024) {
      // 5MB limit
      throw new Error("Image size must not exceed 5MB");
    }
    formData.append("image", image);
  } else if (typeof image === "string" && image) {
    formData.append("image", image);
  }

  try {
    const res = await fetch(`${API_BASE}/auth/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const contentType = res.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      const message =
        (typeof payload === "object" && payload?.message) ||
        (typeof payload === "string"
          ? `Server error (${res.status}): ${payload
              .substring(0, 180)
              .replace(/\n/g, " ")}`
          : `Failed to update profile (Status: ${res.status})`);
      throw new Error(message);
    }
    return payload.data || payload;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
export const changePassword = async (
  { current_password, new_password, new_password_confirmation },
  token
) => {
  if (!token) {
    throw new Error("No authentication token provided");
  }
  if (!current_password || !new_password || !new_password_confirmation) {
    throw new Error(
      "All fields (current password, new password, and confirmation) are required"
    );
  }
  if (new_password.trim() !== new_password_confirmation.trim()) {
    throw new Error("New password and confirmation do not match");
  }
  try {
    const res = await fetch(`${API_BASE}/auth/password`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_password: current_password.trim(),
        new_password: new_password.trim(),
        new_password_confirmation: new_password_confirmation.trim(),
      }),
    });
    const payload = await res.json();
    if (!res.ok) {
      const message =
        (typeof payload === "object" && payload?.message) ||
        (typeof payload === "string"
          ? `Server error (${res.status}): ${payload
              .substring(0, 180)
              .replace(/\n/g, " ")}`
          : `Failed to update profile (Status: ${res.status})`);
      throw new Error(
        typeof message === "string" ? message : JSON.stringify(message)
      );
    }
    return payload.data || payload;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

export const getDashboardStats = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE}/admin/dashboard/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }
      throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Admin user management endpoints
export const getAllUsers = async (page = 1) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE}/admin/users?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to update user: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to delete user: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
