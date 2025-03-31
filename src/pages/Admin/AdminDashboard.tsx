import { useEffect, useState } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import axios from "axios";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// Interface definitions for our data
interface Booking {
  id: number;
  date: string;
  // Add other booking properties as needed
}

interface User {
  id: number;
  role: string;
  // Add other user properties as needed
}

interface Payment {
  id: number;
  amount: number;
  status: string;
  // Add other payment properties as needed
}

const AdminDashboard = () => {
  // State for API data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [bookingsRes, usersRes, paymentsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/bookings'),
          axios.get('http://localhost:8000/api/users'),
          axios.get('http://localhost:8000/api/mpesa')
        ]);

        // Ensure we're setting arrays even if API doesn't return an array
        setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process bookings data for the line chart
  const processBookingsData = () => {
    // Default data in case there are no bookings
    if (!Array.isArray(bookings) || bookings.length === 0) {
      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Bookings",
            data: [0, 0, 0, 0, 0, 0],
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            tension: 0.4,
          },
        ],
      };
    }

    // Group bookings by month
    const monthlyBookings: Record<string, number> = {};
    
    // Loop through bookings manually instead of using reduce
    for (const booking of bookings) {
      if (booking.date) {
        const date = new Date(booking.date);
        const month = date.toLocaleString('default', { month: 'short' });
        
        if (!monthlyBookings[month]) {
          monthlyBookings[month] = 0;
        }
        monthlyBookings[month]++;
      }
    }

    // Get last 6 months or all months if less than 6
    const months = Object.keys(monthlyBookings);
    const recentMonths = months.slice(-6);
    
    return {
      labels: recentMonths.length > 0 ? recentMonths : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Bookings",
          data: recentMonths.length > 0 ? recentMonths.map(month => monthlyBookings[month]) : [0, 0, 0, 0, 0, 0],
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          tension: 0.4,
        },
      ],
    };
  };

  // Process users data for the doughnut chart
  const processUserRolesData = () => {
    // Default data in case there are no users
    if (!Array.isArray(users) || users.length === 0) {
      return {
        labels: ["Users", "Therapists", "Admins"],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: ["#4CAF50", "#FF9800", "#F44336"],
          },
        ],
      };
    }

    // Count users by role
    let regularUsers = 0;
    let therapists = 0;
    let admins = 0;
    
    // Loop through users manually instead of using reduce
    for (const user of users) {
      const role = user.role || 'User';
      
      if (role === 'User' || role === 'user') {
        regularUsers++;
      } else if (role === 'therapist') {
        therapists++;
      } else if (role === 'admin') {
        admins++;
      }
    }

    return {
      labels: ["Users", "Therapists", "Admins"],
      datasets: [
        {
          data: [regularUsers, therapists, admins],
          backgroundColor: ["#4CAF50", "#FF9800", "#F44336"],
        },
      ],
    };
  };

  // Calculate dashboard metrics
  const getDashboardMetrics = () => {
    // Ensure arrays are valid
    const validUsers = Array.isArray(users) ? users : [];
    const validBookings = Array.isArray(bookings) ? bookings : [];
    const validPayments = Array.isArray(payments) ? payments : [];
    
    // Count total users
    const totalUsers = validUsers.length;
    
    // Count active therapists
    const activeTherapists = validUsers.filter(user => user.role === 'therapist').length;
    
    // Count total bookings
    const totalBookings = validBookings.length;
    
    // Calculate total payments in KSH
    let totalPaymentsAmount = 0;
    for (const payment of validPayments) {
      if (payment.status === 'completed') {
        totalPaymentsAmount += (payment.amount || 0);
      }
    }
    
    return {
      totalUsers,
      totalBookings,
      totalPayments: `KSh ${totalPaymentsAmount.toLocaleString()}`,
      activeTherapists,
    };
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <p className="ml-4 text-lg font-medium text-gray-700">Loading dashboard data...</p>
    </div>
  );

  // If still loading, show loading spinner
  if (loading) {
    return (
      <AdminLayout>
        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 text-center">
            Admin Dashboard
          </h2>
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  // If there was an error, show error message
  if (error) {
    return (
      <AdminLayout>
        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center">
            Admin Dashboard
          </h2>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Get processed data for charts and metrics
  const bookingsChartData = processBookingsData();
  const userRolesChartData = processUserRolesData();
  const metrics = getDashboardMetrics();

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 md:p-8">
        {/* Header */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
          Welcome to Admin Dashboard
        </h2>
        <p className="text-gray-700 text-sm sm:text-base md:text-lg text-center md:text-left mb-6">
          Manage appointments, users, sessions, bookings, therapists, and payments.
        </p>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            { title: "Total Users", value: metrics.totalUsers, color: "bg-blue-500" },
            { title: "Total Bookings", value: metrics.totalBookings, color: "bg-green-500" },
            { title: "Total Payments", value: metrics.totalPayments, color: "bg-yellow-500" },
            { title: "Active Therapists", value: metrics.activeTherapists, color: "bg-red-500" },
          ].map((item, index) => (
            <div key={index} className={`${item.color} text-white p-5 rounded-lg shadow-md`}>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Line Chart for Bookings */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Monthly Bookings</h3>
            <Line data={bookingsChartData} />
          </div>
          {/* Doughnut Chart for User Roles */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">User Roles Distribution</h3>
            <Doughnut data={userRolesChartData} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;