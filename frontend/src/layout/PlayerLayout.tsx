import PlayerNavLayout from "@/layout/PlayerNavLayout";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "@/routes/common/ProtectedRoute";

const PlayerLayout = () => (
  <ProtectedRoute allowedRoles={["PLAYER"]}>
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <main className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  </ProtectedRoute>
);

export default PlayerLayout;
