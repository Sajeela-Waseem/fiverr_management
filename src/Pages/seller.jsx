import React from "react";
import Navbar from "../components/Navbar"; // reuse existing navbar
// If needed, add auth check before rendering

const Seller = () => {
  return (
    <>
      <Navbar />
      <div className="py-10 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Seller Dashboard</h2>
        <p className="text-gray-600 mb-6">Welcome to your seller dashboard. Here you can manage your gigs, orders, and earnings.</p>

        {/* Example content blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 bg-white rounded shadow">
            <h3 className="text-lg font-semibold text-green-700">Create New Gig</h3>
            <p className="text-sm text-gray-500 mt-2">Start offering a new service to buyers.</p>
          </div>

          <div className="p-5 bg-white rounded shadow">
            <h3 className="text-lg font-semibold text-green-700">Orders</h3>
            <p className="text-sm text-gray-500 mt-2">View and manage all your current orders.</p>
          </div>

          <div className="p-5 bg-white rounded shadow">
            <h3 className="text-lg font-semibold text-green-700">Earnings</h3>
            <p className="text-sm text-gray-500 mt-2">Track your payments and earnings.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Seller;
