import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaUserCircle, FaTrash } from 'react-icons/fa';

const AccountDeactivationCard = () => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      setError('Failed to delete account');
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleOpenDialog = () => {
    if (confirmDelete) {
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Deactivate Account</h2>
      </div>
      
      <div className="p-4 sm:p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <p className="text-gray-800 font-semibold mb-4">
          Before you go...
        </p>
        
        <ul className="space-y-2 mb-4">
          <li className="flex items-start">
            <FaExclamationTriangle className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-gray-700">Take a look at your valuable data</span>
          </li>
          <li className="flex items-start">
            <FaExclamationTriangle className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-gray-700">
              If you delete your account, you will lose all your data permanently
            </span>
          </li>
        </ul>
        
        <div className="mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.checked)}
              id="confirm-delete-checkbox"
              className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
            />
            <label htmlFor="confirm-delete-checkbox" className="ml-2 text-sm text-gray-700">
              Yes, I'd like to delete my account
            </label>
          </div>
          
          <hr className="my-4 border-gray-200" />
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FaUserCircle className="mr-2" />
              Keep my account
            </button>
            <button
              type="button"
              onClick={handleOpenDialog}
              disabled={!confirmDelete || loading}
              className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
                !confirmDelete || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaTrash className="mr-2" />
              )}
              Delete my account
            </button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {openDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Confirm Account Deletion</h3>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-gray-700">
                  Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                </p>
              </div>
              <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={handleCloseDialog}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    loading
                      ? 'bg-red-400 text-white cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash className="mr-2" />
                      Delete Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDeactivationCard;