import GridCard from "@/app/client/component/referralCard";
import { UserCheck, UserX, Users, UsersRound } from "lucide-react";
import UserDataTable from "../components/user-table";

export default function AdminUsersPage() {
  // Mock data - replace with actual data from your API
  const userStats = {
    totalUsers: 100,
    activeUsers: 75,
    inactiveUsers: 25,
    newUsers: 10,
  };

  return (
    <main className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GridCard
          title="Total Users"
          value={userStats.totalUsers}
          icon={<UsersRound className="h-5 w-5" />}
        />
        <GridCard
          title="Active Users"
          value={userStats.activeUsers}
          icon={<UserCheck className="h-5 w-5" />}
        />
        <GridCard
          title="Inactive Users"
          value={userStats.inactiveUsers}
          icon={<UserX className="h-5 w-5" />}
        />
        <GridCard
          title="New Users"
          value={userStats.newUsers}
          icon={<Users className="h-5 w-5" />}
        />
      </div>
      <UserDataTable />
    </main>
  );
}
