import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
  const { user, updateProfile, logout } = useContext(UserContext);
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    zip: user?.zip || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  // Mock order history data
  const orderHistory = [
    {
      id: 'ORD-1234',
      date: '2025-04-10',
      total: 129.99,
      status: 'Delivered',
      items: [
        { name: 'Classic White T-Shirt', quantity: 1, price: 29.99 },
        { name: 'Slim Fit Jeans', quantity: 1, price: 59.99 },
        { name: 'Wool Sweater', quantity: 1, price: 39.99 },
      ],
    },
    {
      id: 'ORD-5678',
      date: '2025-03-25',
      total: 199.99,
      status: 'Processing',
      items: [
        { name: 'Leather Jacket', quantity: 1, price: 199.99 },
      ],
    },
  ];

  // Handle input changes for profile form
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle input changes for password form
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setEditMode(false);
    setMessage({ text: 'Profile updated successfully!', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Handle password change
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: 'New passwords do not match!', type: 'error' });
      return;
    }
    
    // In a real app, you would call an API to update the password
    setMessage({ text: 'Password updated successfully!', type: 'success' });
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-md shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
            <nav className="p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-md mb-1 ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded-md mb-1 ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Order History
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-2 rounded-md mb-1 ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Security
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-md shadow p-6">
            {/* Profile Information */}
            {activeTab === 'profile' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                
                {editMode ? (
                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-4">
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md transition"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setFormData({
                            name: user.name,
                            email: user.email,
                            phone: user.phone || '',
                            address: user.address || '',
                            city: user.city || '',
                            country: user.country || '',
                            zip: user.zip || '',
                          });
                        }}
                        className="border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                      <p className="text-gray-900">{user.phone || '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                      <p className="text-gray-900">{user.address || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">City</p>
                      <p className="text-gray-900">{user.city || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Country</p>
                      <p className="text-gray-900">{user.country || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">ZIP / Postal Code</p>
                      <p className="text-gray-900">{user.zip || '-'}</p>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Order History */}
            {activeTab === 'orders' && (
              <>
                <h2 className="text-xl font-semibold mb-6">Order History</h2>
                
                {orderHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                    <Link
                      to="/products"
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-md overflow-hidden">
                        <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Items</h3>
                          <ul className="divide-y divide-gray-200">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="py-2 flex justify-between">
                                <div className="flex items-center">
                                  <span className="text-gray-900">{item.quantity} x</span>
                                  <span className="ml-2 text-gray-900">{item.name}</span>
                                </div>
                                <span className="text-gray-900">${item.price.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
                            <span className="font-medium text-gray-900">Total</span>
                            <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            
            {/* Security Settings */}
            {activeTab === 'security' && (
              <>
                <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                
                <form onSubmit={handlePasswordUpdate}>
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md transition"
                  >
                    Update Password
                  </button>
                </form>
                
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete Account
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;