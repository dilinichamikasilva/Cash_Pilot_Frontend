import { useAuth } from "../context/authContext";
import { User as UserIcon } from "lucide-react";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>No user data</div>;

  return (
    <div>

      {/* Welcome */}
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}! 👋</h1>

      {/* Profile Icon / Picture */}
      {/* <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border shadow">
        {user.picture ? (
          <img
            src={user.picture}
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <UserIcon className="text-gray-500 w-12 h-12" />
        )}
      </div> */}

    </div>
  );
};

export default Dashboard;
