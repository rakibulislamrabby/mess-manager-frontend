import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  calculateUserBalances,
  getMonthlySummary,
  mockMeals,
  mockBazaarCosts,
  mockDeposits,
} from "../data/mockData";

const Dashboard = () => {
  const [userBalances, setUserBalances] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState({});
  const [recentMeals, setRecentMeals] = useState([]);
  const [recentCosts, setRecentCosts] = useState([]);

  useEffect(() => {
    // Calculate all data on component mount
    const balances = calculateUserBalances();
    const summary = getMonthlySummary();

    setUserBalances(balances);
    setMonthlySummary(summary);
    setRecentMeals(mockMeals.slice(-5).reverse());
    setRecentCosts(mockBazaarCosts.slice(-5).reverse());
  }, []);

  const summaryCards = [
    {
      title: "Total Meals",
      value: monthlySummary.totalMeals || 0,
      icon: Calendar,
      color: "bg-green-500",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Total Deposits",
      value: `${monthlySummary.totalDeposits || 0}`,
      icon: DollarSign,
      color: "bg-yellow-500",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Total Bazaar Cost",
      value: `${monthlySummary.totalBazaarCost || 0}`,
      icon: ShoppingCart,
      color: "bg-red-500",
      change: "+15%",
      changeType: "negative",
    },
    {
      title: "Current Balance",
      value: `${monthlySummary.totalDeposits - monthlySummary.totalBazaarCost}`,
      icon: DollarSign,
      color: "bg-blue-500",
      change: "+0%",
      changeType: "neutral",
    },
  ];
  
  const mealChartData = recentMeals.map((meal) => ({
    date: new Date(meal.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    meals: meal.totalMeals,
  }));

  const balanceChartData = userBalances.map((user) => ({
    name: user.name,
    balance: user.balance,
    deposits: user.totalDeposits,
    mealCost: user.mealCost,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 space-y-6 max-w-7xl w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              {/* Gradient Background Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  card.color === "bg-blue-500"
                    ? "from-blue-500 to-blue-600"
                    : card.color === "bg-green-500"
                    ? "from-green-500 to-green-600"
                    : card.color === "bg-yellow-500"
                    ? "from-yellow-500 to-yellow-600"
                    : "from-red-500 to-red-600"
                } opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              ></div>

              {/* Decorative Elements */}
              <div
                className={`absolute top-0 right-0 w-20 h-20 rounded-full ${
                  card.color === "bg-blue-500"
                    ? "bg-blue-100"
                    : card.color === "bg-green-500"
                    ? "bg-green-100"
                    : card.color === "bg-yellow-500"
                    ? "bg-yellow-100"
                    : "bg-red-100"
                } opacity-30 transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300`}
              ></div>

              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-xl shadow-lg ${
                      card.color === "bg-blue-500"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                        : card.color === "bg-green-500"
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : card.color === "bg-yellow-500"
                        ? "bg-gradient-to-br from-yellow-500 to-yellow-600"
                        : "bg-gradient-to-br from-red-500 to-red-600"
                    } transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-5  w-5 text-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {card.changeType === "positive" ? (
                      <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-semibold text-green-700">
                          {card.change}
                        </span>
                      </div>
                    ) : card.changeType === "negative" ? (
                      <div className="flex items-center bg-red-50 px-3 py-1 rounded-full">
                        <TrendingDown className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-sm font-semibold text-red-700">
                          {card.change}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-gray-600">
                          {card.change}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    vs last month
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        card.changeType === "positive"
                          ? "bg-green-500"
                          : card.changeType === "negative"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                      style={{
                        width:
                          card.changeType === "positive"
                            ? "75%"
                            : card.changeType === "negative"
                            ? "85%"
                            : "50%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Member Summary Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Member Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Meals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Deposits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meal Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userBalances.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-800">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "manager"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.totalMeals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.totalDeposits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.mealCost?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        user.balance >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {user.balance?.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meal Trend Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Meal Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mealChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="meals" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Member Balance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Member Balances
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={balanceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="balance" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Meals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Meals
          </h3>
          <div className="space-y-3">
            {recentMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(meal.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {meal.breakfast.length} breakfast, {meal.lunch.length}{" "}
                    lunch, {meal.dinner.length} dinner
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {meal.totalMeals} meals
                  </p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bazaar Costs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Bazaar Costs
          </h3>
          <div className="space-y-3">
            {recentCosts.map((cost) => (
              <div
                key={cost.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(cost.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600">{cost.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {cost.amount} Taka
                  </p>
                  <p className="text-sm text-gray-600">
                    {cost.items.length} items
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
