import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export const IncidentsChart = ({ data = [] }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="glass-card" 
          style={{ 
            background: 'rgba(10, 15, 30, 0.95)', 
            border: '1px solid var(--border-glass-hover)', 
            padding: '12px',
            fontSize: '0.8rem'
          }}
        >
          <p style={{ fontWeight: 600, color: '#F1F5F9', marginBottom: '8px', fontFamily: 'var(--font-title)' }}>
            TIME: {label}
          </p>
          {payload.map((entry, idx) => (
            <div key={idx} style={{ color: entry.color, display: 'flex', justifyContent: 'space-between', gap: '16px', margin: '3px 0' }}>
              <span>{entry.name}:</span>
              <span style={{ fontWeight: 700 }}>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: '24px', 
        height: '100%', 
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <h3 style={{ fontSize: '0.95rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '20px', textTransform: 'uppercase' }}>
        Incident Volume Timeline
      </h3>

      <div style={{ flex: 1, width: '100%', minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="95%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
            <XAxis 
              dataKey="time" 
              stroke="#64748B" 
              fontSize={11}
              tickLine={false} 
              axisLine={false} 
              dy={10}
              style={{ fontFamily: 'var(--font-title)' }}
            />
            <YAxis 
              stroke="#64748B" 
              fontSize={11}
              tickLine={false} 
              axisLine={false} 
              dx={-5}
              allowDecimals={false}
              style={{ fontFamily: 'var(--font-title)' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(109, 74, 255, 0.15)', strokeWidth: 2 }} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle" 
              iconSize={8}
              wrapperStyle={{ 
                fontSize: '0.75rem', 
                color: '#94A3B8',
                paddingBottom: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="drowsiness" 
              name="Drowsiness" 
              stroke="var(--color-danger)" 
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="attentionLoss" 
              name="Attention Loss" 
              stroke="var(--color-warning)" 
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="mobileUsage" 
              name="Mobile Usage" 
              stroke="var(--accent-blue)" 
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="faceNotVisible" 
              name="Face Not Visible" 
              stroke="#E2E8F0" 
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncidentsChart;
