import { useState, useEffect } from 'react';
import { Plus, Calendar, Users, Save, Trash2 } from 'lucide-react';
import { mockUsers, mockMeals } from '../data/mockData';

const MealManagement = () => {
  const [meals, setMeals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeal, setNewMeal] = useState({
    date: new Date().toISOString().split('T')[0],
    breakfast: {},
    lunch: {},
    dinner: {}
  });

  useEffect(() => {
    setMeals(mockMeals);
  }, []);

  const handleAddMeal = () => {
    let totalMeals = 0;
    Object.values(newMeal.breakfast).forEach(v => totalMeals += v || 0);
    Object.values(newMeal.lunch).forEach(v => totalMeals += v || 0);
    Object.values(newMeal.dinner).forEach(v => totalMeals += v || 0);
    const mealData = {
      id: Date.now(),
      date: newMeal.date,
      breakfast: Object.entries(newMeal.breakfast).filter(([_, v]) => v > 0).map(([id]) => parseInt(id)),
      lunch: Object.entries(newMeal.lunch).filter(([_, v]) => v > 0).map(([id]) => parseInt(id)),
      dinner: Object.entries(newMeal.dinner).filter(([_, v]) => v > 0).map(([id]) => parseInt(id)),
      totalMeals
    };
    setMeals([...meals, mealData]);
    setNewMeal({
      date: new Date().toISOString().split('T')[0],
      breakfast: {},
      lunch: {},
      dinner: {}
    });
    setShowAddForm(false);
  };

  const handleDeleteMeal = (mealId) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  const handleMealCountChange = (mealType, userId, value) => {
    setNewMeal(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        [userId]: Math.max(0, Math.round(value * 2) / 2)
      }
    }));
  };

  const getMealCount = (mealType, userId) => {
    return newMeal[mealType][userId] || 0;
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
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Meal Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage daily meal entries for all members</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base cursor-pointer"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Meal Entry
        </button>
      </div>

      {/* Add Meal Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Add New Meal Entry</h2>
          
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            {/* Meal Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Meal Summary</h3>
              <div className="space-y-1 text-sm">
                <p>Breakfast: {Object.values(newMeal.breakfast).filter(v => v > 0).length} members</p>
                <p>Lunch: {Object.values(newMeal.lunch).filter(v => v > 0).length} members</p>
                <p>Dinner: {Object.values(newMeal.dinner).filter(v => v > 0).length} members</p>
                <p className="font-semibold">Total: {Object.values(newMeal.breakfast).filter(v => v > 0).length + Object.values(newMeal.lunch).filter(v => v > 0).length + Object.values(newMeal.dinner).filter(v => v > 0).length} meals</p>
              </div>
            </div>
          </div>

          {/* Member Selection */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Members for Each Meal</h3>
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full divide-y divide-gray-200 bg-white rounded-lg text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-2 sm:px-4 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Breakfast</th>
                    <th className="px-2 sm:px-4 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Lunch</th>
                    <th className="px-2 sm:px-4 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Dinner</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                      <td className="px-2 sm:px-4 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" className="px-2 py-1 bg-gray-100 rounded" onClick={() => handleMealCountChange('breakfast', user.id, getMealCount('breakfast', user.id) - 0.5)}>-</button>
                          <input
                            type="number"
                            min={0}
                            step={0.5}
                            value={getMealCount('breakfast', user.id)}
                            onChange={e => handleMealCountChange('breakfast', user.id, parseFloat(e.target.value) || 0)}
                            className="w-14 sm:w-16 text-center border border-gray-300 rounded"
                          />
                          <button type="button" className="px-2 py-1 bg-gray-100 rounded" onClick={() => handleMealCountChange('breakfast', user.id, getMealCount('breakfast', user.id) + 0.5)}>+</button>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" className="px-2 py-1 bg-gray-100 rounded" onClick={() => handleMealCountChange('lunch', user.id, getMealCount('lunch', user.id) - 0.5)}>-</button>
                          <input
                            type="number"
                            min={0}
                            step={0.5}
                            value={getMealCount('lunch', user.id)}
                            onChange={e => handleMealCountChange('lunch', user.id, parseFloat(e.target.value) || 0)}
                            className="w-14 sm:w-16 text-center border border-gray-300 rounded"
                          />
                          <button type="button" className="px-2 py-1 bg-gray-100 rounded" onClick={() => handleMealCountChange('lunch', user.id, getMealCount('lunch', user.id) + 0.5)}>+</button>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" className="px-2 py-1 bg-gray-100 rounded" onClick={() => handleMealCountChange('dinner', user.id, getMealCount('dinner', user.id) - 0.5)}>-</button>
                          <input
                            type="number"
                            min={0}
                            step={0.5}
                            value={getMealCount('dinner', user.id)}
                            onChange={e => handleMealCountChange('dinner', user.id, parseFloat(e.target.value) || 0)}
                            className="w-14 sm:w-16 text-center border border-gray-300 rounded"
                          />
                          <button type="button" className="px-2 py-1 bg-gray-100 rounded" onClick={() => handleMealCountChange('dinner', user.id, getMealCount('dinner', user.id) + 0.5)}>+</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMeal}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Meal Entry
            </button>
          </div>
        </div>
      )}
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
      {/* Meal Entries Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-2 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Meal Entries</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Breakfast</th>
                <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Lunch</th>
                <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Dinner</th>
                <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Total Meals</th>
                <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {meals.map((meal) => (
                <tr key={meal.id}>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(meal.date)}
                    </div>
                  </td>
                  <td className="px-2 sm:px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {meal.breakfast.length} members
                    </div>
                    <div className="text-xs text-gray-500">
                      {meal.breakfast.map(id => getMemberName(id)).join(', ')}
                    </div>
                  </td>
                  <td className="px-2 sm:px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {meal.lunch.length} members
                    </div>
                    <div className="text-xs text-gray-500">
                      {meal.lunch.map(id => getMemberName(id)).join(', ')}
                    </div>
                  </td>
                  <td className="px-2 sm:px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {meal.dinner.length} members
                    </div>
                    <div className="text-xs text-gray-500">
                      {meal.dinner.map(id => getMemberName(id)).join(', ')}
                    </div>
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {meal.totalMeals} meals
                    </span>
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="text-red-600 hover:text-red-900 flex items-center cursor-pointer"
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

      
    </div>
  );
};

export default MealManagement; 