import React, { useState } from 'react';

const pastelColors = [
  'bg-pink-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-purple-100',
  'bg-orange-100'
];

const TaskBlock = ({ title, description, colorIndex = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl shadow-md transition-all duration-200 cursor-pointer ${pastelColors[colorIndex % pastelColors.length]} 
        ${expanded ? 'scale-105 z-10' : 'hover:scale-105'} 
        p-4 mb-4`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="font-bold text-lg text-black">{title}</div>
      {expanded && (
        <div className="mt-2 text-base text-gray-700">{description}</div>
      )}
    </div>
  );
};

export default TaskBlock;