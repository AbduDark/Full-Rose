const API_BASE = import.meta.env.VITE_API_BASE;

export const getCourses = async () => {
  const res = await fetch(`${API_BASE}/courses`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch courses.");
  }

  return data;
};

export const getCourseById = async (id) => {
  const res = await fetch(`${API_BASE}/courses/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch course.");
  }

  return data;
};

// Admin course endpoints
export const createAdminCourse = async (courseData, token) => {
  const formData = new FormData();

  Object.keys(courseData).forEach((key) => {
    if (key === "image" && courseData[key]) {
      formData.append(key, courseData[key]);
    } else if (courseData[key] !== null && courseData[key] !== undefined) {
      formData.append(key, courseData[key]);
    }
  });

  const res = await fetch(`${API_BASE}/admin/courses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create course.");
  }

  return data;
};

export const updateAdminCourse = async (id, courseData, token) => {
  const formData = new FormData();

  Object.keys(courseData).forEach((key) => {
    if (key === "image" && courseData[key]) {
      formData.append(key, courseData[key]);
    } else if (courseData[key] !== null && courseData[key] !== undefined) {
      formData.append(key, courseData[key]);
    }
  });

  const res = await fetch(`${API_BASE}/admin/courses/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update course.");
  }

  return data;
};

export const deleteAdminCourse = async (id, token) => {
  const res = await fetch(`${API_BASE}/admin/courses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to delete course.");
  }

  return { message: "Course deleted successfully." };
};


export const getCourseRatings = async (courseId = 1) => {
  const res = await fetch(`${API_BASE}/courses/${courseId}/ratings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch course ratings.");
  }
  return data;
};

export const RatingsCourse = async (id, rating, comment, token) => {
  if (!id || !rating || !comment || !token) {
    throw new Error(
      "Missing required fields: course_id, rating, comment, or token"
    );
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  if (comment.trim().length === 0) {
    throw new Error("Comment cannot be empty");
  }

  const requestBody = {
    course_id: parseInt(id),
    rating: parseInt(rating),
    comment: comment.trim(),
  };

  console.log("Sending rating request:", requestBody);
  console.log("Token info:", {
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    tokenStart: token ? token.substring(0, 10) + "..." : "none",
  });

  const res = await fetch(`${API_BASE}/ratings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });
  const contentType = res.headers.get("content-type") || "";
  let data;

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const htmlText = await res.text();
    const errorSnippet = htmlText.substring(0, 200).replace(/\n/g, " ");
    console.error("Server returned HTML instead of JSON:", {
      status: res.status,
      statusText: res.statusText,
      contentType: contentType,
      htmlSnippet: errorSnippet,
    });
    throw new Error(
      `Server error (${res.status}): Received HTML response instead of JSON. This usually means authentication failed or the endpoint doesn't exist.`
    );
  }

  if (!res.ok) {
    console.error("Rating submission failed:", {
      status: res.status,
      statusText: res.statusText,
      data: data,
    });
    if (res.status === 401) {
      throw new Error("Unauthenticated. Please log in again.");
    }
    const serverMessage =
      (data && typeof data.message === "string" && data.message) ||
      (data && typeof data.error === "string" && data.error) ||
      (data ? JSON.stringify(data) : "Failed to rate course.");
    throw new Error(serverMessage);
  }

  return data;
};
