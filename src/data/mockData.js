// Static mock data for Mess Management System
export const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+880 1712345678",
    role: "manager", // manager or viewer
    messId: 1,
    balance: 0,
    totalMeals: 0,
    totalDeposits: 0,
    joinDate: "2024-01-15",
    address: "Dhaka, Bangladesh",
    status: "active",
    avatar: "JD"
  },
  {
    id: 2,
    name: "David Shawon",
    email: "shawon@example.com",
    phone: "+880 1812345678",
    role: "member",
    messId: 1,
    balance: 0,
    totalMeals: 0,
    totalDeposits: 0,
    joinDate: "2023-12-01",
    address: "Chittagong, Bangladesh",
    status: "active",
    avatar: "JS"
  },
  {
    id: 3,
    name: "Bob Zesan",
    email: "zesan@example.com",
    phone: "+880 1912345678",
    role: "viewer",
    messId: 1,
    balance: 0,
    totalMeals: 0,
    totalDeposits: 0,
    joinDate: "2024-02-10",
    address: "Sylhet, Bangladesh",
    status: "inactive",
    avatar: "BJ"
  },
  {
    id: 4,
    name: "Alice Masum",
    email: "masum@example.com",
    phone: "+880 1612345678",
    role: "member",
    messId: 1,
    balance: 0,
    totalMeals: 0,
    totalDeposits: 0,
    joinDate: "2024-03-05",
    address: "Rajshahi, Bangladesh",
    status: "active",
    avatar: "AB"
  }
];

export const mockMess = {
  id: 1,
  name: "Sunrise Mess",
  address: "123 Main Street, City",
  createdAt: "2024-01-01",
  members: mockUsers
};

export const mockMeals = [
  {
    id: 1,
    date: "2024-06-01",
    breakfast: [1, 2, 3, 4],
    lunch: [1, 2, 3, 4],
    dinner: [1, 2, 3, 4],
    totalMeals: 12
  },
  {
    id: 2,
    date: "2024-06-02",
    breakfast: [1, 2, 4],
    lunch: [1, 2, 3, 4],
    dinner: [1, 2, 3],
    totalMeals: 10
  },
  {
    id: 3,
    date: "2024-06-03",
    breakfast: [1, 2, 3, 4],
    lunch: [1, 2, 3, 4],
    dinner: [1, 2, 3, 4],
    totalMeals: 12
  },
  {
    id: 4,
    date: "2024-06-04",
    breakfast: [1, 2],
    lunch: [1, 2, 3, 4],
    dinner: [1, 2, 3, 4],
    totalMeals: 10
  },
  {
    id: 5,
    date: "2024-06-05",
    breakfast: [1, 2, 3, 4],
    lunch: [1, 2, 3, 4],
    dinner: [1, 2, 3, 4],
    totalMeals: 12
  }
];

export const mockDeposits = [
  {
    id: 1,
    userId: 1,
    amount: 1000,
    date: "2024-06-01",
    description: "Monthly deposit"
  },
  {
    id: 2,
    userId: 2,
    amount: 1000,
    date: "2024-06-01",
    description: "Monthly deposit"
  },
  {
    id: 3,
    userId: 3,
    amount: 800,
    date: "2024-06-02",
    description: "Partial deposit"
  },
  {
    id: 4,
    userId: 4,
    amount: 1000,
    date: "2024-06-01",
    description: "Monthly deposit"
  },
  {
    id: 5,
    userId: 1,
    amount: 500,
    date: "2024-06-15",
    description: "Additional deposit"
  }
];

export const mockBazaarCosts = [
  {
    id: 1,
    date: "2024-06-01",
    amount: 1200,
    items: [
      { name: "Rice", amount: 400 },
      { name: "Vegetables", amount: 300 },
      { name: "Fish", amount: 500 }
    ],
    description: "Weekly grocery shopping"
  },
  {
    id: 2,
    date: "2024-06-08",
    amount: 1100,
    items: [
      { name: "Rice", amount: 400 },
      { name: "Vegetables", amount: 250 },
      { name: "Chicken", amount: 450 }
    ],
    description: "Weekly grocery shopping"
  },
  {
    id: 3,
    date: "2024-06-15",
    amount: 1300,
    items: [
      { name: "Rice", amount: 400 },
      { name: "Vegetables", amount: 350 },
      { name: "Beef", amount: 550 }
    ],
    description: "Weekly grocery shopping"
  },
  {
    id: 4,
    date: "2024-06-22",
    amount: 1000,
    items: [
      { name: "Rice", amount: 400 },
      { name: "Vegetables", amount: 200 },
      { name: "Fish", amount: 400 }
    ],
    description: "Weekly grocery shopping"
  }
];

// Calculate meal rate and balances
export const calculateMealRate = () => {
  const totalBazaarCost = mockBazaarCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const totalMeals = mockMeals.reduce((sum, meal) => sum + meal.totalMeals, 0);
  return totalMeals > 0 ? totalBazaarCost / totalMeals : 0;
};

export const calculateUserBalances = () => {
  const mealRate = calculateMealRate();
  
  return mockUsers.map(user => {
    const userMeals = mockMeals.reduce((total, meal) => {
      const breakfast = meal.breakfast.includes(user.id) ? 1 : 0;
      const lunch = meal.lunch.includes(user.id) ? 1 : 0;
      const dinner = meal.dinner.includes(user.id) ? 1 : 0;
      return total + breakfast + lunch + dinner;
    }, 0);
    
    const userDeposits = mockDeposits
      .filter(deposit => deposit.userId === user.id)
      .reduce((sum, deposit) => sum + deposit.amount, 0);
    
    const mealCost = userMeals * mealRate;
    const balance = userDeposits - mealCost;
    
    return {
      ...user,
      totalMeals: userMeals,
      totalDeposits: userDeposits,
      mealCost: mealCost,
      balance: balance
    };
  });
};

export const getMonthlySummary = () => {
  const totalBazaarCost = mockBazaarCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const totalMeals = mockMeals.reduce((sum, meal) => sum + meal.totalMeals, 0);
  const totalDeposits = mockDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);
  const mealRate = calculateMealRate();
  
  return {
    totalBazaarCost,
    totalMeals,
    totalDeposits,
    mealRate,
    remainingBalance: totalDeposits - totalBazaarCost
  };
}; 