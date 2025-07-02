import React, { useState, useEffect } from 'react';
import { mockData } from '../data/mockData';

export default function Reports() {
  const [activeReport, setActiveReport] = useState('current'); // current, previous, yearly
  const [currentDate] = useState(new Date());

  // Calculate date ranges
  const getCurrentMonthRange = () => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return { start, end };
  };

  const getPreviousMonthRange = () => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    return { start, end };
  };

  const getYearlyRange = () => {
    const start = new Date(currentDate.getFullYear(), 0, 1);
    const end = new Date(currentDate.getFullYear(), 11, 31);
    return { start, end };
  };

  // Get date range based on active report
  const getDateRange = () => {
    switch (activeReport) {
      case 'current':
        return getCurrentMonthRange();
      case 'previous':
        return getPreviousMonthRange();
      case 'yearly':
        return getYearlyRange();
      default:
        return getCurrentMonthRange();
    }
  };

  // Calculate report data
  const calculateReportData = () => {
    const { start, end } = getDateRange();
    
    // Filter data based on date range (mock implementation)
    const filteredMeals = mockData.meals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate >= start && mealDate <= end;
    });

    const filteredBazarCosts = mockData.bazarCosts.filter(cost => {
      const costDate = new Date(cost.date);
      return costDate >= start && costDate <= end;
    });

    const filteredDeposits = mockData.deposits.filter(deposit => {
      const depositDate = new Date(deposit.date);
      return depositDate >= start && depositDate <= end;
    });

    // Calculate totals
    const totalMeals = filteredMeals.reduce((sum, meal) => sum + meal.count, 0);
    const totalBazarCost = filteredBazarCosts.reduce((sum, cost) => sum + cost.amount, 0);
    const totalDeposits = filteredDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    const totalMembers = mockData.members.length;
    const averageMealsPerMember = totalMembers > 0 ? (totalMeals / totalMembers).toFixed(1) : 0;
    const costPerMeal = totalMeals > 0 ? (totalBazarCost / totalMeals).toFixed(2) : 0;
    const netBalance = totalDeposits - totalBazarCost;

    return {
      totalMeals,
      totalBazarCost,
      totalDeposits,
      totalMembers,
      averageMealsPerMember,
      costPerMeal,
      netBalance,
      filteredMeals,
      filteredBazarCosts,
      filteredDeposits
    };
  };

  const reportData = calculateReportData();

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get report title
  const getReportTitle = () => {
    const { start, end } = getDateRange();
    switch (activeReport) {
      case 'current':
        return `Current Month Report (${start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`;
      case 'previous':
        return `Previous Month Report (${start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`;
      case 'yearly':
        return `Yearly Report (${start.getFullYear()})`;
      default:
        return 'Report';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Reports</h1>
          <p className="text-gray-600">Comprehensive financial analysis and meal management reports</p>
        </div>

        {/* Report Type Toggle */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveReport('current')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                activeReport === 'current'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Current Month
            </button>
            <button
              onClick={() => setActiveReport('previous')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                activeReport === 'previous'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Previous Month
            </button>
            <button
              onClick={() => setActiveReport('yearly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                activeReport === 'yearly'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yearly Report
            </button>
          </div>
        </div>

        {/* Report Title */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{getReportTitle()}</h2>
          <p className="text-gray-600">
            Report Period: {formatDate(getDateRange().start)} - {formatDate(getDateRange().end)}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Meals */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Meals</p>
                <p className="text-3xl font-bold">{reportData.totalMeals}</p>
                <p className="text-blue-100 text-sm mt-1">
                  Avg: {reportData.averageMealsPerMember} per member
                </p>
              </div>
              <div className="text-blue-200">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Bazar Cost */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Bazar Cost</p>
                <p className="text-3xl font-bold">৳{reportData.totalBazarCost.toLocaleString()}</p>
                <p className="text-red-100 text-sm mt-1">
                  ৳{reportData.costPerMeal} per meal
                </p>
              </div>
              <div className="text-red-200">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Deposits */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Deposits</p>
                <p className="text-3xl font-bold">৳{reportData.totalDeposits.toLocaleString()}</p>
                <p className="text-green-100 text-sm mt-1">
                  {reportData.filteredDeposits.length} transactions
                </p>
              </div>
              <div className="text-green-200">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Net Balance */}
          <div className={`rounded-xl shadow-lg p-6 text-white ${
            reportData.netBalance >= 0 
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
              : 'bg-gradient-to-br from-orange-500 to-orange-600'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Net Balance</p>
                <p className="text-3xl font-bold">৳{reportData.netBalance.toLocaleString()}</p>
                <p className="text-white/80 text-sm mt-1">
                  {reportData.netBalance >= 0 ? 'Surplus' : 'Deficit'}
                </p>
              </div>
              <div className="text-white/60">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bazar Costs Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Bazar Costs Breakdown</h3>
              <p className="text-gray-600 text-sm">Detailed breakdown of all bazar expenses</p>
            </div>
            <div className="p-6">
              {reportData.filteredBazarCosts.length > 0 ? (
                <div className="space-y-4">
                  {reportData.filteredBazarCosts.map((cost, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{cost.description}</p>
                        <p className="text-sm text-gray-600">
                          Purchased by: {cost.purchaser} • {formatDate(new Date(cost.date))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">৳{cost.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p>No bazar costs found for this period</p>
                </div>
              )}
            </div>
          </div>

          {/* Deposits Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Deposits Breakdown</h3>
              <p className="text-gray-600 text-sm">Detailed breakdown of all deposits</p>
            </div>
            <div className="p-6">
              {reportData.filteredDeposits.length > 0 ? (
                <div className="space-y-4">
                  {reportData.filteredDeposits.map((deposit, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{deposit.memberName}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(new Date(deposit.date))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">৳{deposit.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p>No deposits found for this period</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Member-wise Meal Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Member-wise Meal Summary</h3>
            <p className="text-gray-600 text-sm">Meal count breakdown by member</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meals Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost Share
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockData.members.map((member) => {
                    const memberMeals = reportData.filteredMeals.filter(meal => 
                      meal.members.includes(member.id)
                    ).length;
                    const percentage = reportData.totalMeals > 0 ? ((memberMeals / reportData.totalMeals) * 100).toFixed(1) : 0;
                    const costShare = (reportData.totalBazarCost * (memberMeals / reportData.totalMeals)).toFixed(2);
                    
                    return (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {member.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {memberMeals}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {percentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ৳{costShare}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Export Report</h3>
              <p className="text-gray-600 text-sm">Download this report in various formats</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
                <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export PDF
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 cursor-pointer">
                <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export Excel
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 cursor-pointer">
                <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Print Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
