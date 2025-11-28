"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MentorLayout } from "@/components/layout/mentor-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import { getMyBookings, confirmSession } from "@/lib/api/bookings";
import { SessionCard } from "@/components/features/session-card";
import toast from "react-hot-toast";

export default function MentorSessionsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [confirming, setConfirming] = useState(null);

  useEffect(() => {
    loadSessions();
    // ✅ Auto-refresh every 5 seconds
    const interval = setInterval(loadSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getMyBookings();
      console.log("✅ Sessions loaded:", data);
      setSessions(data);
    } catch (error) {
      console.error("❌ Failed to load sessions:", error);
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSession = async (sessionId) => {
    setConfirming(sessionId);
    try {
      console.log("🔄 Confirming session:", sessionId);
      const updatedSession = await confirmSession(sessionId);

      console.log("✅ Session confirmed:", updatedSession);

      // ✅ Update local state immediately
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s._id === sessionId || s.id === sessionId
            ? {
                ...s,
                ...updatedSession,
                status: "confirmed",
                zoomLink: updatedSession.zoomLink,
                zoomMeetingId: updatedSession.zoomMeetingId,
                zoomPassword: updatedSession.zoomPassword,
              }
            : s
        )
      );

      toast.success("Session confirmed! Zoom link sent to mentee.");

      // ✅ Refresh from server after 2 seconds
      setTimeout(loadSessions, 2000);
    } catch (error) {
      console.error("❌ Error confirming session:", error);
      toast.error("Failed to confirm session");
    } finally {
      setConfirming(null);
    }
  };

  const handleJoinSession = (zoomLink) => {
    if (zoomLink) {
      window.open(zoomLink, "_blank");
      toast.success("Opening Zoom meeting...");
    } else {
      toast.error("Zoom link not available");
    }
  };

  if (loading) {
    return (
      <MentorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="animate-spin h-12 w-12 text-purple-600" />
        </div>
      </MentorLayout>
    );
  }

  const now = new Date();
  const upcoming = sessions.filter(
    (s) => s.status === "confirmed" && new Date(s.startTime) > now
  );
  const pending = sessions.filter((s) => s.status === "pending");
  const completed = sessions.filter((s) => s.status === "completed");
  const rejected = sessions.filter(
    (s) => s.status === "rejected" || s.status === "cancelled"
  );

  const renderSessionsList = (sessionList, emptyMessage) => {
    if (sessionList.length === 0) {
      return <p className="text-center text-gray-500 py-8">{emptyMessage}</p>;
    }

    return (
      <div className="space-y-4">
        {sessionList.map((session) => (
          <SessionCard
            key={session._id || session.id}
            session={session}
            userRole="mentor"
            onConfirm={
              session.status === "pending" ? handleConfirmSession : undefined
            }
            onJoinSession={handleJoinSession}
            isConfirming={confirming === (session._id || session.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <MentorLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
        <p className="text-gray-600">Manage all your mentoring sessions</p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejected.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {renderSessionsList(upcoming, "No upcoming sessions scheduled.")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              {renderSessionsList(pending, "No pending session requests.")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {renderSessionsList(completed, "No completed sessions yet.")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected/Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              {renderSessionsList(
                rejected,
                "No rejected or cancelled sessions."
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MentorLayout>
  );
}
