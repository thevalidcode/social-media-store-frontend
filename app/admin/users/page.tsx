"use client";
import GridCard from "@/app/client/component/referralCard";
import { UserCheck, UserX, Users, UsersRound } from "lucide-react";
import UserDataTable from "../components/user-table";
import { useGetUsers } from "@/hooks/use-user";

// Create a separate component for user stats that handles loading/error states
function UserStatsGrid() {
  const { data, isLoading, error } = useGetUsers();
  if (isLoading) {
    return <div>Loading user stats...</div>;
  }
  if (error) {
    return <div>Error loading user stats: {error.message}</div>;
  }
  if (!data || !Array.isArray(data)) {
    return <div>No user data available</div>;
  }
  const totalUsers = data.length;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <GridCard
        title="Total Users"
        value={totalUsers}
        icon={<UsersRound className="h-5 w-5" />}
      />
      <GridCard
        title="Active Users"
        value={40}
        icon={<UserCheck className="h-5 w-5" />}
      />
      <GridCard
        title="Banned Users"
        value={10}
        icon={<UserX className="h-5 w-5" />}
      />
      <GridCard
        title="New Users"
        value={5}
        icon={<Users className="h-5 w-5" />}
      />
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <main className="space-y-6">
      <UserStatsGrid />
      <UserDataTable />
    </main>
  );
}
