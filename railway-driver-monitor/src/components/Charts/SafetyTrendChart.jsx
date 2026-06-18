import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const SafetyTrendChart = ({ data = [] }) => {
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
            DAY: {label}
          </p>
          <div style={{ color: 'var(--accent-blue)', display: 'flex', justifyContent: 'space-between', gap: '16px', margin: '3px 0' }}>
            <span>Analyses:</span>
            <span style={{ fontWeight: 700 }}>{payload[0].value}</span>
          </div>
          <div style={{ color: 'var(--color-danger)', display: 'flex', justifyContent: 'space-between', gap: '16px', margin: '3px 0' }}>
            <span>Incidents:</span>
            <span style={{ fontWeight: 700 }}>{payload[1].value}</span>
          </div>
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
        Weekly Activity Review
      </h3>

      <div style={{ flex: 1, width: '100%', minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="95%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
            <XAxis 
              dataKey="date" 
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
              style={{ fontFamily: 'var(--font-title)' }}
            />
            <Tooltip content={<CustomTooltip />} />
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
            <Bar 
              dataKey="analyses" 
              name="Analyses Completed" 
              fill="rgba(109, 74, 255, 0.4)" 
              stroke="var(--accent-violet)" 
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Line 
              type="monotone" 
              dataKey="incidents" 
              name="Total Incidents" 
              stroke="var(--color-danger)" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#02040A', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SafetyTrendChart;
