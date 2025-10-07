import React from 'react';

const data = [
  { name: 'Mon', 'Wait Time (min)': 12, 'People in Queue': 24 },
  { name: 'Tue', 'Wait Time (min)': 19, 'People in Queue': 30 },
  { name: 'Wed', 'Wait Time (min)': 15, 'People in Queue': 42 },
  { name: 'Thu', 'Wait Time (min)': 18, 'People in Queue': 35 },
  { name: 'Fri', 'Wait Time (min)': 25, 'People in Queue': 60 },
  { name: 'Sat', 'Wait Time (min)': 32, 'People in Queue': 85 },
  { name: 'Sun', 'Wait Time (min)': 28, 'People in Queue': 70 },
];

const QueueAnalyticsChart: React.FC = () => {
  // Recharts is loaded from a CDN, so we access it from the window object inside the component.
  const Recharts = (window as any).Recharts;

  if (!Recharts) {
    return <div className="flex items-center justify-center h-full text-gray-500">Loading Chart...</div>;
  }

  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5, right: 20, left: -10, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
          <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} />
          <YAxis tick={{ fill: '#a0aec0' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(31, 41, 55, 0.8)', 
              borderColor: '#4b5563',
              borderRadius: '0.5rem'
            }}
            labelStyle={{ color: '#f9fafb' }}
          />
          <Legend wrapperStyle={{ color: '#d1d5db' }}/>
          <Bar dataKey="Wait Time (min)" fill="#4f46e5" />
          <Bar dataKey="People in Queue" fill="#818cf8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QueueAnalyticsChart;