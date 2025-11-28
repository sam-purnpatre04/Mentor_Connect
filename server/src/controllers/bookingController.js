import Session from "../models/Session.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateZoomLink } from "../utils/generateZoomLink.js";
import { createZoomMeeting, deleteZoomMeeting } from "../utils/zoom.js";
import { generateICS } from "../utils/generateICS.js";

/**
 * Book a new session
 */
export const bookSession = async (req, res) => {
  const { mentorId, startTime, topic } = req.body;
  const menteeId = req.user.id;

  // Debug logs
  console.log("📝 Booking Request Received:");
  console.log("- Mentee ID:", menteeId);
  console.log("- Mentor ID:", mentorId);
  console.log("- Start Time:", startTime);
  console.log("- Topic:", topic);

  try {
    // Validate inputs
    if (!mentorId || !startTime || !topic) {
      console.error("❌ Missing required fields");
      return res.status(400).json({
        message: "Missing required fields: mentorId, startTime, or topic",
      });
    }

    const mentor = await User.findById(mentorId);

    console.log("👤 Mentor found:", mentor ? "Yes" : "No");
    if (mentor) {
      console.log("- Role:", mentor.role);
      console.log("- Approved:", mentor.isApproved);
    }

    if (!mentor || mentor.role !== "mentor" || !mentor.isApproved) {
      console.error("❌ Invalid or unapproved mentor");
      return res.status(400).json({ message: "Invalid or unapproved mentor" });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour

    console.log("🕒 Session times:");
    console.log("- Start:", start);
    console.log("- End:", end);
    console.log("- Is valid date:", !isNaN(start.getTime()));

    if (isNaN(start.getTime())) {
      console.error("❌ Invalid date format");
      return res.status(400).json({
        message: "Invalid date format for startTime",
      });
    }

    // Check conflict
    const conflict = await Session.findOne({
      mentor: mentorId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        { startTime: { $lt: end, $gte: start } },
        { endTime: { $gt: start, $lte: end } },
        { startTime: { $lte: start }, endTime: { $gte: end } },
      ],
    });

    console.log(
      "🔍 Conflict check:",
      conflict ? "CONFLICT FOUND" : "No conflict"
    );

    if (conflict) {
      console.error("❌ Time slot conflict");
      return res.status(400).json({
        message: "Time slot already booked or pending",
      });
    }

    // Create session
    console.log("✅ Creating session...");
    const session = await Session.create({
      mentee: menteeId,
      mentor: mentorId,
      startTime: start,
      endTime: end,
      topic,
      status: "pending",
    });

    console.log("✅ Session created:", session._id);

    const populatedSession = await Session.findById(session._id)
      .populate("mentee", "email profile.fullName fullName")
      .populate("mentor", "email profile.fullName fullName");

    // Email mentee
    await sendEmail({
      to: populatedSession.mentee.email,
      subject: "Session Request Submitted",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h3 style="color: #7C3AED;">Your session request has been submitted!</h3>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Mentor:</strong> ${
              populatedSession.mentor.profile?.fullName ||
              populatedSession.mentor.fullName
            }</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${start.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Topic:</strong> ${topic}</p>
          </div>
          <p style="color: #7C3AED;"><strong>Status:</strong> Pending mentor approval</p>
          <p style="color: #666;">You will receive the meeting link once the mentor confirms.</p>
        </div>
      `,
    });

    // Email mentor for approval
    await sendEmail({
      to: populatedSession.mentor.email,
      subject: "New Session Request - Action Required",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h3 style="color: #7C3AED;">You have a new session request!</h3>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Mentee:</strong> ${
              populatedSession.mentee.profile?.fullName ||
              populatedSession.mentee.fullName
            }</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${start.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Topic:</strong> ${topic}</p>
          </div>
          <p>Please log in to your dashboard to confirm or reject this request.</p>
        </div>
      `,
    });

    console.log("✅ Booking successful!");
    res.status(201).json({
      _id: session._id,
      id: session._id,
      mentee: session.mentee,
      mentor: session.mentor,
      startTime: session.startTime,
      endTime: session.endTime,
      topic: session.topic,
      status: session.status,
      zoomLink: null,
      zoomMeetingId: null,
      zoomPassword: null,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    });
  } catch (error) {
    console.error("❌ Booking error:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get user sessions (mentee and mentor view)
 */
export const getUserSessions = async (req, res) => {
  const userId = req.user.id;
  try {
    const sessions = await Session.find({
      $or: [{ mentee: userId }, { mentor: userId }],
    })
      .populate("mentee", "profile.fullName fullName email")
      .populate("mentor", "profile.fullName fullName email")
      .sort({ startTime: -1 });

    // ✅ Ensure all zoom fields are included
    const sessionsWithZoom = sessions.map((session) => ({
      ...session.toObject(),
      _id: session._id,
      id: session._id,
      zoomLink: session.zoomLink || null,
      zoomMeetingId: session.zoomMeetingId || null,
      zoomPassword: session.zoomPassword || null,
    }));

    res.json(sessionsWithZoom);
  } catch (error) {
    console.error("❌ Get user sessions error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Complete a session (mark as completed)
 */
export const completeSession = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await Session.findById(sessionId)
      .populate("mentee", "profile.fullName fullName email")
      .populate("mentor", "profile.fullName fullName email");

    if (!session || session.status !== "confirmed") {
      return res.status(400).json({
        message: "Invalid session or not confirmed yet",
      });
    }

    const userId = req.user.id;
    if (
      session.mentee._id.toString() !== userId &&
      session.mentor._id.toString() !== userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    session.status = "completed";
    await session.save();

    // Optionally delete Zoom meeting after completion
    if (session.zoomMeetingId) {
      deleteZoomMeeting(session.zoomMeetingId).catch((err) =>
        console.log("Failed to delete Zoom meeting:", err)
      );
    }

    res.json({
      message: "Session marked as completed",
      session: {
        ...session.toObject(),
        _id: session._id,
        id: session._id,
      },
    });
  } catch (error) {
    console.error("❌ Complete session error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Confirm session with REAL Zoom integration
 * ✅ UPDATED: Returns complete session data with zoom link
 */
export const confirmSession = async (req, res) => {
  const { sessionId } = req.params;
  const mentorId = req.user.id;

  try {
    const session = await Session.findById(sessionId)
      .populate("mentee", "email profile.fullName fullName")
      .populate("mentor", "email profile.fullName fullName");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.mentor._id.toString() !== mentorId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (session.status !== "pending") {
      return res.status(400).json({ message: "Session is not pending" });
    }

    // Create REAL Zoom meeting
    let zoomData;
    try {
      zoomData = await createZoomMeeting({
        topic: `MentorConnect: ${session.topic}`,
        start_time: session.startTime.toISOString(),
        duration: 60,
        agenda: `Session with ${
          session.mentee.profile?.fullName || session.mentee.fullName
        }`,
      });

      console.log("✅ Real Zoom meeting created:", zoomData.meeting_id);
    } catch (zoomError) {
      console.error("Zoom creation failed, using fallback:", zoomError.message);
      // Fallback to simulated link
      zoomData = generateZoomLink(session._id.toString());
    }

    session.status = "confirmed";
    session.zoomLink = zoomData.join_url;
    session.zoomMeetingId = zoomData.meeting_id;
    session.zoomPassword = zoomData.password;
    await session.save();

    // Generate calendar invite
    const icsContent = generateICS(session);

    // Email mentee with confirmation and Zoom link
    await sendEmail({
      to: session.mentee.email,
      subject: "✅ Session Confirmed! - Meeting Link Inside",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10B981;">🎉 Great news! Your session has been confirmed!</h2>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Mentor:</strong> ${
              session.mentor.profile?.fullName || session.mentor.fullName
            }</p>
            <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${session.startTime.toLocaleString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              }
            )}</p>
            <p style="margin: 5px 0;"><strong>Topic:</strong> ${
              session.topic
            }</p>
          </div>

          <div style="background: #ECFDF5; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981;">
            <h3 style="margin-top: 0; color: #065F46;">📹 Join Zoom Meeting</h3>
            <a href="${session.zoomLink}" 
               style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0;">
              Click to Join Meeting
            </a>
            <p style="margin: 10px 0; font-size: 14px; color: #065F46;">
              <strong>Meeting ID:</strong> <span style="font-family: monospace;">${
                session.zoomMeetingId
              }</span><br>
              <strong>Password:</strong> <span style="font-family: monospace;">${
                session.zoomPassword
              }</span>
            </p>
            <p style="margin: 10px 0; font-size: 12px; color: #065F46;">
              💡 The link will be active 15 minutes before the session starts.
            </p>
          </div>

          <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
            <strong>✨ Tips for a great session:</strong>
          </p>
          <ul style="color: #6B7280; font-size: 14px;">
            <li>✅ Join 2-3 minutes early to test your audio/video</li>
            <li>🔇 Find a quiet place with good lighting</li>
            <li>📝 Prepare any questions you want to discuss</li>
            <li>📓 Have a notebook ready for taking notes</li>
          </ul>
          
          <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">
            See you soon! 👋
          </p>
        </div>
      `,
      attachments: icsContent
        ? [{ filename: "session.ics", content: icsContent }]
        : [],
    });

    // Email mentor confirmation
    await sendEmail({
      to: session.mentor.email,
      subject: "✅ Session Confirmed",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10B981;">✅ Session Confirmed</h2>
          <p>You have confirmed the session with <strong>${
            session.mentee.profile?.fullName || session.mentee.fullName
          }</strong></p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${session.startTime.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Topic:</strong> ${
              session.topic
            }</p>
          </div>

          <a href="${session.zoomLink}" 
             style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold;">
            Join Zoom Meeting
          </a>
          
          <p style="margin: 20px 0; font-size: 12px; color: #666;">
            <strong>Meeting Details:</strong><br>
            ID: ${session.zoomMeetingId}<br>
            Password: ${session.zoomPassword}
          </p>
        </div>
      `,
    });

    // ✅ IMPORTANT: Return full session object with all fields
    console.log("✅ Sending confirmed session response");
    res.json({
      message: "Session confirmed successfully",
      session: {
        _id: session._id,
        id: session._id,
        mentee: session.mentee,
        mentor: session.mentor,
        startTime: session.startTime,
        endTime: session.endTime,
        topic: session.topic,
        status: session.status,
        zoomLink: session.zoomLink, // ✅ INCLUDED
        zoomMeetingId: session.zoomMeetingId, // ✅ INCLUDED
        zoomPassword: session.zoomPassword, // ✅ INCLUDED
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
      zoomCreated: !!zoomData.meeting_id,
    });
  } catch (error) {
    console.error("❌ Confirm session error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Reject session request
 */
export const rejectSession = async (req, res) => {
  const { sessionId } = req.params;
  const { reason } = req.body;
  const mentorId = req.user.id;

  try {
    const session = await Session.findById(sessionId)
      .populate("mentee", "email profile.fullName fullName")
      .populate("mentor", "email profile.fullName fullName");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.mentor._id.toString() !== mentorId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (session.status !== "pending") {
      return res.status(400).json({ message: "Session is not pending" });
    }

    session.status = "rejected";
    session.rejectionReason = reason || "No reason provided";
    await session.save();

    // Email mentee
    await sendEmail({
      to: session.mentee.email,
      subject: "Session Request Update",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h3 style="color: #DC2626;">❌ Session Request Status Update</h3>
          <p>Unfortunately, your session request with <strong>${
            session.mentor.profile?.fullName || session.mentor.fullName
          }</strong> could not be confirmed.</p>
          
          <div style="background: #FEE2E2; padding: 15px; border-radius: 8px; border-left: 4px solid #DC2626; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Requested Time:</strong> ${session.startTime.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Reason:</strong> ${
              session.rejectionReason
            }</p>
          </div>

          <p>Please try booking another available slot with this mentor or explore other mentors on the platform.</p>
          
          <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/search" 
             style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
            Find Other Mentors
          </a>
        </div>
      `,
    });

    res.json({
      message: "Session rejected",
      session: {
        ...session.toObject(),
        _id: session._id,
        id: session._id,
      },
    });
  } catch (error) {
    console.error("❌ Reject session error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Cancel session (delete Zoom meeting if exists)
 */
export const cancelSession = async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user.id;

  try {
    const session = await Session.findById(sessionId)
      .populate("mentee", "email profile.fullName fullName")
      .populate("mentor", "email profile.fullName fullName");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (
      session.mentee._id.toString() !== userId &&
      session.mentor._id.toString() !== userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (session.status === "completed") {
      return res.status(400).json({
        message: "Cannot cancel completed session",
      });
    }

    // Delete Zoom meeting if it exists
    if (session.zoomMeetingId && session.status === "confirmed") {
      await deleteZoomMeeting(session.zoomMeetingId);
      console.log("✅ Zoom meeting deleted:", session.zoomMeetingId);
    }

    session.status = "cancelled";
    await session.save();

    // Notify both parties
    const otherParty =
      userId === session.mentee._id.toString()
        ? session.mentor
        : session.mentee;

    await sendEmail({
      to: otherParty.email,
      subject: "Session Cancelled",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h3 style="color: #DC2626;">Session Cancelled</h3>
          <p>The session scheduled for <strong>${session.startTime.toLocaleString()}</strong> has been cancelled.</p>
          <p><strong>Topic:</strong> ${session.topic}</p>
          <p>If you have any questions, please contact the mentor or support team.</p>
        </div>
      `,
    });

    res.json({
      message: "Session cancelled successfully",
      session: {
        ...session.toObject(),
        _id: session._id,
        id: session._id,
      },
    });
  } catch (error) {
    console.error("❌ Cancel session error:", error);
    res.status(500).json({ message: error.message });
  }
};
