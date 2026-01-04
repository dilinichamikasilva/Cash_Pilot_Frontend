import { useAuth } from "../context/authContext";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>No user data</div>;

  return (
    <div>

      {/* Welcome */}
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}! 👋</h1>


    </div>
  );
};

export default Dashboard;
