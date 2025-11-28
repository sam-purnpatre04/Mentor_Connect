import apiClient from "./axios";

const transformBooking = (booking) => {
  if (!booking) return null;

  return {
    ...booking,
    _id: booking._id || booking.id,
    id: booking._id || booking.id,
    mentor: booking.mentor
      ? {
          id: booking.mentor._id || booking.mentor.id,
          _id: booking.mentor._id || booking.mentor.id,
          fullName: booking.mentor.profile?.fullName || booking.mentor.fullName,
          email: booking.mentor.email,
          university:
            booking.mentor.profile?.university || booking.mentor.university,
          program: booking.mentor.profile?.program || booking.mentor.program,
        }
      : null,
    mentee: booking.mentee
      ? {
          id: booking.mentee._id || booking.mentee.id,
          _id: booking.mentee._id || booking.mentee.id,
          fullName: booking.mentee.profile?.fullName || booking.mentee.fullName,
          email: booking.mentee.email,
        }
      : null,
    // ✅ ENSURE ZOOM FIELDS ARE INCLUDED
    zoomLink: booking.zoomLink || null,
    zoomMeetingId: booking.zoomMeetingId || null,
    zoomPassword: booking.zoomPassword || null,
  };
};

export const createBooking = async (bookingData) => {
  const response = await apiClient.post("/bookings", bookingData);
  return transformBooking(response.data);
};

export const getMyBookings = async () => {
  const response = await apiClient.get("/bookings/my");
  const bookingsArray = response.data.bookings || response.data;

  // ✅ Map and transform all bookings
  return bookingsArray.map((booking) => transformBooking(booking));
};

export const getBookingById = async (bookingId) => {
  const response = await apiClient.get(`/bookings/${bookingId}`);
  return transformBooking(response.data);
};

export const completeSession = async (sessionId) => {
  const response = await apiClient.post(`/bookings/${sessionId}/complete`);
  return transformBooking(response.data);
};

export const cancelBooking = async (bookingId) => {
  const response = await apiClient.delete(`/bookings/${bookingId}`);
  return response.data;
};

// ✅ FIXED: Confirm session returns full session with zoom details
export const confirmSession = async (sessionId) => {
  const response = await apiClient.post(`/bookings/${sessionId}/confirm`);
  console.log("✅ Confirm response:", response.data);
  return transformBooking(response.data.session);
};

// NEW: Reject session (mentor)
export const rejectSession = async (sessionId, reason) => {
  const response = await apiClient.post(`/bookings/${sessionId}/reject`, {
    reason,
  });
  return transformBooking(response.data.session);
};
