const API_BASE = import.meta.env.VITE_API_BASE;

export const getLessonsByCourse = async (courseId, token) => {
  if (!courseId) throw new Error("courseId is required");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/courses/${courseId}/lessons`, {
    method: "GET",
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string"
        ? `Server error (${res.status}): Received non-JSON response. ${payload
            .substring(0, 180)
            .replace(/\n/g, " ")}`
        : "Failed to fetch lessons.");
    throw new Error(message);
  }
  return payload;
};

export const getLessonComments = async (courseId, token) => {
  if (!courseId) throw new Error("lessonId is required");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/lessons/${courseId}/comments`, {
    method: "GET",
    headers,
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
        : `Failed to fetch comments (Status: ${res.status})`);
    throw new Error(message);
  }

  // Extract comments from payload.data.comments
  return payload.data?.comments || [];
};

export const createComment = async ({ lesson_id, content }, token) => {
  if (!lesson_id || !content) {
    throw new Error("lesson_id and content are required");
  }
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/comments`, {
    method: "POST",
    headers,
    body: JSON.stringify({ lesson_id, content }),
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new Error(
      (typeof data === "object" && data?.message) ||
        (typeof data === "string"
          ? `Server error (${res.status}): ${data}`
          : `Failed to create comment (Status: ${res.status})`)
    );
  }
  return data.data?.comment || data;
};

export const deleteComment = async (commentId, token) => {
  if (!commentId) {
    throw new Error("commentId is required");
  }

  const headers = {
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/comments/${commentId}`, {
    method: "DELETE",
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new Error(
      (typeof data === "object" && data?.message) ||
        (typeof data === "string"
          ? `Server error (${res.status}): ${data}`
          : `Failed to delete comment (Status: ${res.status})`)
    );
  }

  return data;
};
