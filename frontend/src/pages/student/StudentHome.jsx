const StudentHome = () => {
    return (
      <div className="p-6">
        {/* Welcome Section */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold">Welcome, Student!</h1>
          <p className="text-lg text-gray-200 mt-2">
            Here is your dashboard overview.
          </p>
        </div>
  
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
            <p className="text-2xl font-semibold text-blue-600">5</p>
            <p className="text-gray-600">Books Borrowed</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
            <p className="text-2xl font-semibold text-green-600">3</p>
            <p className="text-gray-600">Active Rentals</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
            <p className="text-2xl font-semibold text-purple-600">A</p>
            <p className="text-gray-600">Membership Tier</p>
          </div>
        </div>
  
        {/* Quick Actions */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-500 text-white p-4 rounded-md text-center hover:bg-blue-600 transition">
              View My Books
            </button>
            <button className="bg-green-500 text-white p-4 rounded-md text-center hover:bg-green-600 transition">
              Update Profile
            </button>
            <button className="bg-red-500 text-white p-4 rounded-md text-center hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default StudentHome;
  