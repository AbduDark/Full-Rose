const API_BASE = import.meta.env.VITE_API_BASE;

export const getMySubscriptions = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/my-subscriptions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    throw error;
  }
};

export const subscribeToCourse = async (token, subscriptionData) => {
  try {
    const res = await fetch(`${API_BASE}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(subscriptionData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    return await res.json();
  } catch (error) {
    console.error("Error subscribing to course:", error);
    throw error;
  }
};

export const cancelSubscription = async (token, subscriptionId) => {
  try {
    const res = await fetch(
      `${API_BASE}/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    return await res.json();
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
};

export const renewSubscription = async (token, renewalData) => {
  try {
    const res = await fetch(`${API_BASE}/subscriptions/renew`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(renewalData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    return await res.json();
  } catch (error) {
    console.error("Error renewing subscription:", error);
    throw error;
  }
};

export const getSubscriptionStatus = async (token, courseId) => {
  try {
    const res = await fetch(`${API_BASE}/subscriptions/status/${courseId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }
    return await res.json();
  } catch (error) {
    console.error("Error getting subscription status:", error);
    throw error;
  }
};

export const getExpiredSubscriptions = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/expired-subscriptions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching expired subscriptions:", error);
    throw error;
  }
};

// Admin Subscription API Functions
export const getAllSubscriptions = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/admin/subscriptions/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching all subscriptions:", error);
    throw error;
  }
};

export const getPendingSubscriptions = async (token, page = 1) => {
  try {
    const res = await fetch(
      `${API_BASE}/admin/subscriptions/pending?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching pending subscriptions:", error);
    throw error;
  }
};

export const approveSubscription = async (token, subscriptionId) => {
  try {
    const res = await fetch(
      `${API_BASE}/admin/subscriptions/${subscriptionId}/approve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    return await res.json();
  } catch (error) {
    console.error("Error approving subscription:", error);
    throw error;
  }
};

export const rejectSubscription = async (token, subscriptionId) => {
  try {
    const res = await fetch(
      `${API_BASE}/admin/subscriptions/${subscriptionId}/reject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    return await res.json();
  } catch (error) {
    console.error("Error rejecting subscription:", error);
    throw error;
  }
};
