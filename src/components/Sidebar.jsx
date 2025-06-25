import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Users, 
  Calendar, 
  DollarSign, 
  ShoppingCart, 
  FileText, 
  LogOut,
  Menu,
  X,
  User,
  Settings
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { 
  calculateUserBalances, 
  getMonthlySummary,
  mockMeals,
  mockBazaarCosts,
  mockDeposits
} from '../data/mockData';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser, currentMess, logout } = useAuth();

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: Home,
      accessible: true
    },
    {
      path: '/members',
      name: 'Members',
      icon: Users,
      accessible: true
    },
    {
      path: '/meals',
      name: 'Meal Management',
      icon: Calendar,
      accessible: currentUser?.role === 'manager'
    },
    {
      path: '/deposits',
      name: 'Deposits',
      icon: DollarSign,
      accessible: currentUser?.role === 'manager'
    },
    {
      path: '/bazaar',
      name: 'Bazaar Costs',
      icon: ShoppingCart,
      accessible: currentUser?.role === 'manager'
    },
    {
      path: '/reports',
      name: 'Reports',
      icon: FileText,
      accessible: true
    }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPosition = 20;

    // Get data
    const members = calculateUserBalances();
    const monthlySummary = getMonthlySummary();
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Add header with logo/icon
    doc.setFillColor(79, 70, 229); // Indigo color
    doc.rect(0, 0, pageWidth, 30, 'F');
    
    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Mess Management Report', pageWidth / 2, 18, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPosition = 40;

    // Report Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${currentDate} at ${currentTime}`, margin, yPosition);
    doc.text(`Mess: ${currentMess?.name || 'Sunrise Mess'}`, pageWidth - margin - 60, yPosition);
    yPosition += 15;

    // Executive Summary Box
    doc.setFillColor(243, 244, 246); // Gray background
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 35, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 35, 'S');
    
    yPosition += 8;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', margin + 5, yPosition);
    yPosition += 12;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Members: ${members.length}`, margin + 5, yPosition);
    doc.text(`Active Members: ${members.filter(m => m.status === 'active').length}`, margin + 50, yPosition);
    doc.text(`Managers: ${members.filter(m => m.role === 'manager').length}`, margin + 95, yPosition);
    yPosition += 6;

    doc.text(`Total Meals: ${monthlySummary.totalMeals}`, margin + 5, yPosition);
    doc.text(`Total Deposits: ${monthlySummary.totalDeposits} Taka`, margin + 50, yPosition);
    doc.text(`Total Bazaar Cost: ${monthlySummary.totalBazaarCost} Taka`, margin + 95, yPosition);
    yPosition += 6;

    doc.text(`Meal Rate: ${monthlySummary.mealRate?.toFixed(2)} Taka`, margin + 5, yPosition);
    doc.text(`Net Balance: ${monthlySummary.remainingBalance?.toFixed(2)} Taka`, margin + 50, yPosition);
    yPosition += 20;

    // Financial Overview
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Financial Overview', margin, yPosition);
    yPosition += 8;

    // Financial boxes
    const boxWidth = (pageWidth - 2 * margin - 20) / 3;
    const boxHeight = 25;
    
    // Income Box
    doc.setFillColor(34, 197, 94); // Green
    doc.rect(margin, yPosition, boxWidth, boxHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Income', margin + boxWidth/2, yPosition + 8, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`${monthlySummary.totalDeposits} Taka`, margin + boxWidth/2, yPosition + 18, { align: 'center' });
    
    // Expense Box
    doc.setFillColor(239, 68, 68); // Red
    doc.rect(margin + boxWidth + 10, yPosition, boxWidth, boxHeight, 'F');
    doc.text('Total Expenses', margin + boxWidth + 10 + boxWidth/2, yPosition + 8, { align: 'center' });
    doc.text(`${monthlySummary.totalBazaarCost} Taka`, margin + boxWidth + 10 + boxWidth/2, yPosition + 18, { align: 'center' });
    
    // Balance Box
    const balanceColor = monthlySummary.remainingBalance >= 0 ? [34, 197, 94] : [239, 68, 68];
    doc.setFillColor(...balanceColor);
    doc.rect(margin + 2 * boxWidth + 20, yPosition, boxWidth, boxHeight, 'F');
    doc.text('Net Balance', margin + 2 * boxWidth + 20 + boxWidth/2, yPosition + 8, { align: 'center' });
    doc.text(`${monthlySummary.remainingBalance?.toFixed(2)} Taka`, margin + 2 * boxWidth + 20 + boxWidth/2, yPosition + 18, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPosition += 35;

    // Member Details Table
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Member Details', margin, yPosition);
    yPosition += 8;

    // Table with better formatting
    const tableHeaders = ['Name', 'Role', 'Status', 'Meals', 'Deposits', 'Balance'];
    const tableColWidths = [45, 25, 25, 20, 30, 30];
    const tableX = margin;
    
    // Table header background
    doc.setFillColor(79, 70, 229);
    doc.rect(tableX, yPosition - 2, pageWidth - 2 * margin, 8, 'F');
    
    // Table headers
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    let xPos = tableX + 2;
    tableHeaders.forEach((header, index) => {
      doc.text(header, xPos, yPosition);
      xPos += tableColWidths[index];
    });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPosition += 10;

    // Table data with alternating row colors
    doc.setFont('helvetica', 'normal');
    members.forEach((member, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(tableX, yPosition - 2, pageWidth - 2 * margin, 6, 'F');
      }

      xPos = tableX + 2;
      doc.text(member.name.substring(0, 18), xPos, yPosition);
      xPos += tableColWidths[0];
      
      doc.text(member.role === 'viewer' ? 'Member' : member.role, xPos, yPosition);
      xPos += tableColWidths[1];
      
      doc.text(member.status, xPos, yPosition);
      xPos += tableColWidths[2];
      
      doc.text(member.totalMeals.toString(), xPos, yPosition);
      xPos += tableColWidths[3];
      
      doc.text(member.totalDeposits.toString(), xPos, yPosition);
      xPos += tableColWidths[4];
      
      // Color-coded balance
      const balanceColor = member.balance >= 0 ? [34, 197, 94] : [239, 68, 68];
      doc.setTextColor(...balanceColor);
      doc.text(member.balance?.toFixed(2), xPos, yPosition);
      doc.setTextColor(0, 0, 0); // Reset color
      
      yPosition += 8;
    });

    yPosition += 15;

    // Recent Activity Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Recent Activity', margin, yPosition);
    yPosition += 10;

    // Recent Meals
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Recent Meals:', margin, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const recentMeals = mockMeals.slice(-5).reverse();
    recentMeals.forEach((meal) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      const mealDate = new Date(meal.date).toLocaleDateString();
      doc.text(`• ${mealDate}: ${meal.totalMeals} meals (B:${meal.breakfast.length}, L:${meal.lunch.length}, D:${meal.dinner.length})`, margin + 5, yPosition);
      yPosition += 5;
    });

    yPosition += 8;

    // Recent Bazaar Costs
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Recent Bazaar Costs:', margin, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const recentCosts = mockBazaarCosts.slice(-5).reverse();
    recentCosts.forEach((cost) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      const costDate = new Date(cost.date).toLocaleDateString();
      doc.text(`• ${costDate}: ${cost.amount} Taka - ${cost.description}`, margin + 5, yPosition);
      yPosition += 5;
    });

    yPosition += 15;

    // Member Balances Summary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Member Balances Summary', margin, yPosition);
    yPosition += 10;

    const positiveBalances = members.filter(m => m.balance > 0);
    const negativeBalances = members.filter(m => m.balance < 0);
    const zeroBalances = members.filter(m => m.balance === 0);

    // Summary boxes
    const summaryBoxWidth = (pageWidth - 2 * margin - 20) / 3;
    
    // Credit box
    doc.setFillColor(34, 197, 94);
    doc.rect(margin, yPosition, summaryBoxWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Credit', margin + summaryBoxWidth/2, yPosition + 8, { align: 'center' });
    doc.text(`${positiveBalances.length} members`, margin + summaryBoxWidth/2, yPosition + 16, { align: 'center' });
    
    // Due box
    doc.setFillColor(239, 68, 68);
    doc.rect(margin + summaryBoxWidth + 10, yPosition, summaryBoxWidth, 20, 'F');
    doc.text('Due', margin + summaryBoxWidth + 10 + summaryBoxWidth/2, yPosition + 8, { align: 'center' });
    doc.text(`${negativeBalances.length} members`, margin + summaryBoxWidth + 10 + summaryBoxWidth/2, yPosition + 16, { align: 'center' });
    
    // Zero balance box
    doc.setFillColor(156, 163, 175);
    doc.rect(margin + 2 * summaryBoxWidth + 20, yPosition, summaryBoxWidth, 20, 'F');
    doc.text('Zero Balance', margin + 2 * summaryBoxWidth + 20 + summaryBoxWidth/2, yPosition + 8, { align: 'center' });
    doc.text(`${zeroBalances.length} members`, margin + 2 * summaryBoxWidth + 20 + summaryBoxWidth/2, yPosition + 16, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPosition += 30;

    // Footer
    doc.setFillColor(243, 244, 246);
    doc.rect(0, pageHeight - 30, pageWidth, 30, 'F');
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    doc.text('This report was generated automatically by the Mess Management System.', margin, pageHeight - 20);
    doc.text('For any discrepancies, please contact the mess manager.', margin, pageHeight - 15);
    doc.text(`Report ID: ${Date.now()}`, margin, pageHeight - 10);

    // Save the PDF
    const fileName = `mess_report_${new Date().toISOString().split('T')[0]}_${currentTime.replace(/:/g, '-')}.pdf`;
    doc.save(fileName);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-indigo-600 text-white shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg
        flex flex-col h-screen
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-center h-16 px-4 bg-indigo-600 text-white flex-shrink-0">
          <h1 className="text-xl font-bold">Mess Manager</h1>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser?.email}
              </p>
              <p className="text-xs text-indigo-600 font-medium capitalize">
                {currentUser?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Mess Info */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="font-semibold text-gray-900 text-sm">{currentMess?.name}</h2>
          <p className="text-xs text-gray-600 truncate">{currentMess?.address}</p>
        </div>

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            if (!item.accessible) return null;
            
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Actions - Fixed at bottom */}
        <div className="px-4 py-4 border-t border-gray-200 space-y-2">
          <Link
            to="/profile"
            className={`
              w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${location.pathname === '/profile'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
            `}
            onClick={() => setIsOpen(false)}
          >
            <Settings className="mr-3 h-5 w-5" />
            Profile Settings
          </Link>
          
          <button
            onClick={generatePDF}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
          >
            <FileText className="mr-3 h-5 w-5" />
            Export Full Report
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar; 