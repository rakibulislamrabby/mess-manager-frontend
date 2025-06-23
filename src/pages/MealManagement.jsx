import { useState, useEffect } from 'react';
import { Plus, Calendar, Users, Save, Trash2 } from 'lucide-react';
import { mockUsers, mockMeals } from '../data/mockData';

const MealManagement = () => {
  const [meals, setMeals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeal, setNewMeal] = useState({
    date: new Date().toISOString().split('T')[0],
    breakfast: [],
    lunch: [],
    dinner: []
  });

  useEffect(() => {
    setMeals(mockMeals);
  }, []);

  const handleAddMeal = () => {
    const mealData = {
      id: Date.now(),
      ...newMeal,
      totalMeals: newMeal.breakfast.length + newMeal.lunch.length + newMeal.dinner.length
    };

    setMeals([...meals, mealData]);
    setNewMeal({
      date: new Date().toISOString().split('T')[0],
      breakfast: [],
      lunch: [],
      dinner: []
    });
    setShowAddForm(false);
  };

  const handleDeleteMeal = (mealId) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  const toggleMemberMeal = (mealType, userId) => {
    setNewMeal(prev => ({
      ...prev,
      [mealType]: prev[mealType].includes(userId)
        ? prev[mealType].filter(id => id !== userId)
        : [...prev[mealType], userId]
    }));
  };

  const getMemberName = (userId) => {
    const member = mockUsers.find(user => user.id === userId);
    return member ? member.name : 'Unknown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meal Management</h1>
          <p className="text-gray-600">Manage daily meal entries for all members</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Meal Entry
        </button>
      </div>

      {/* Add Meal Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Meal Entry</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={newMeal.date}
                onChange={(e) => setNewMeal({...newMeal, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Meal Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Meal Summary</h3>
              <div className="space-y-1 text-sm">
                <p>Breakfast: {newMeal.breakfast.length} members</p>
                <p>Lunch: {newMeal.lunch.length} members</p>
                <p>Dinner: {newMeal.dinner.length} members</p>
                <p className="font-semibold">Total: {newMeal.breakfast.length + newMeal.lunch.length + newMeal.dinner.length} meals</p>
              </div>
            </div>
          </div>

          {/* Member Selection */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Members for Each Meal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Breakfast */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Breakfast
                </h4>
                <div className="space-y-2">
                  {mockUsers.map((user) => (
                    <label key={user.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newMeal.breakfast.includes(user.id)}
                        onChange={() => toggleMemberMeal('breakfast', user.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{user.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Lunch */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Lunch
                </h4>
                <div className="space-y-2">
                  {mockUsers.map((user) => (
                    <label key={user.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newMeal.lunch.includes(user.id)}
                        onChange={() => toggleMemberMeal('lunch', user.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{user.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dinner */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Dinner
                </h4>
                <div className="space-y-2">
                  {mockUsers.map((user) => (
                    <label key={user.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newMeal.dinner.includes(user.id)}
                        onChange={() => toggleMemberMeal('dinner', user.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{user.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMeal}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Meal Entry
            </button>
          </div>
        </div>
      )}

      {/* Meal Entries Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Meal Entries</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Breakfast
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lunch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dinner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Meals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {meals.map((meal) => (
                <tr key={meal.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(meal.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {meal.breakfast.length} members
                    </div>
                    <div className="text-xs text-gray-500">
                      {meal.breakfast.map(id => getMemberName(id)).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {meal.lunch.length} members
                    </div>
                    <div className="text-xs text-gray-500">
                      {meal.lunch.map(id => getMemberName(id)).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {meal.dinner.length} members
                    </div>
                    <div className="text-xs text-gray-500">
                      {meal.dinner.map(id => getMemberName(id)).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {meal.totalMeals} meals
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{meals.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Meals</p>
              <p className="text-2xl font-bold text-gray-900">
                {meals.reduce((sum, meal) => sum + meal.totalMeals, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">{mockUsers.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealManagement; 