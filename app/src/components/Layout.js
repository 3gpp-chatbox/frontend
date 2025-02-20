import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Layout = () => {
  const [isProcedureListCollapsed, setIsProcedureListCollapsed] = useState(false);

  return (
    <div className="h-screen flex">
      {/* Procedure List - Collapsible Left Sidebar */}
      <div className={`flex ${isProcedureListCollapsed ? 'w-12' : 'w-64'} transition-all duration-300 ease-in-out`}>
        <div className="flex-1 bg-gray-100 overflow-y-auto">
          {!isProcedureListCollapsed && (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Procedures</h2>
              {/* Add your procedure list content here */}
            </div>
          )}
        </div>
        <button
          onClick={() => setIsProcedureListCollapsed(!isProcedureListCollapsed)}
          className="bg-gray-200 px-2 hover:bg-gray-300 transition-colors"
        >
          {isProcedureListCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Column - Diagram and Summary */}
        <div className="flex-1 flex flex-col">
          {/* Diagram View */}
          <div className="flex-1 bg-white border border-gray-200 p-4 overflow-auto">
            <div className="h-full">
              <h2 className="text-lg font-semibold mb-4">Diagram View</h2>
              {/* Add your diagram content here */}
              <div className="transform scale-100 origin-center transition-transform">
                {/* Diagram content with zoom controls */}
              </div>
            </div>
          </div>

          {/* Procedure Summary */}
          <div className="h-1/4 bg-gray-50 border border-gray-200 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Procedure Summary</h2>
            {/* Add your summary content here */}
          </div>
        </div>

        {/* Right Column - Editor and Other */}
        <div className="w-96 flex flex-col">
          {/* Editor View */}
          <div className="flex-1 bg-gray-50 border border-gray-200 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Editor</h2>
            {/* Add your editor content here */}
          </div>

          {/* Other Area */}
          <div className="h-1/4 bg-white border border-gray-200 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Other</h2>
            {/* Add your other content here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout; 