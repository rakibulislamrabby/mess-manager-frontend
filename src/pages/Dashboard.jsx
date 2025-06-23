import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  ShoppingCart,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
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
  Cell
} from 'recharts';
import { 
  calculateUserBalances, 
  getMonthlySummary,
  mockMeals,
  mockBazaarCosts,
  mockDeposits
} from '../data/mockData';

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
      title: 'Total Members',
      value: userBalances.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+0%',
      changeType: 'neutral'
    },
    {
      title: 'Total Meals',
      value: monthlySummary.totalMeals || 0,
      icon: Calendar,
      color: 'bg-green-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Deposits',
      value: `$${monthlySummary.totalDeposits || 0}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Bazaar Cost',
      value: `$${monthlySummary.totalBazaarCost || 0}`,
      icon: ShoppingCart,
      color: 'bg-red-500',
      change: '+15%',
      changeType: 'negative'
    }
  ];

  const mealChartData = recentMeals.map(meal => ({
    date: new Date(meal.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    meals: meal.totalMeals
  }));

  const balanceChartData = userBalances.map(user => ({
    name: user.name,
    balance: user.balance,
    deposits: user.totalDeposits,
    mealCost: user.mealCost
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {card.changeType === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : card.changeType === 'negative' ? (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                ) : null}
                <span className={`text-sm ${
                  card.changeType === 'positive' ? 'text-green-600' : 
                  card.changeType === 'negative' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {card.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meal Trend Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Meal Trend</h3>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Balances</h3>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Meals</h3>
          <div className="space-y-3">
            {recentMeals.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(meal.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {meal.breakfast.length} breakfast, {meal.lunch.length} lunch, {meal.dinner.length} dinner
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{meal.totalMeals} meals</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bazaar Costs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bazaar Costs</h3>
          <div className="space-y-3">
            {recentCosts.map((cost) => (
              <div key={cost.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(cost.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-gray-600">{cost.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${cost.amount}</p>
                  <p className="text-sm text-gray-600">{cost.items.length} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Member Summary Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Summary</h3>
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
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'manager' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.totalMeals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${user.totalDeposits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${user.mealCost?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      user.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${user.balance?.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 