import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function SavingsChart() {
  const [data, setData] = useState({ savings: 0, creditCard: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch savings balance
        const savingsResponse = await fetch('http://localhost:4000/deposit/getSavings', {
          credentials: 'include',
        });
        const savingsData = await savingsResponse.json();

        // Fetch credit card info
        const creditCardResponse = await fetch('http://localhost:4000/transactions/getcc', {
          credentials: 'include',
        });
        const creditCardData = await creditCardResponse.json();

        setData({
          savings: savingsData.balance || 0,
          creditCard: creditCardData.balance || 0,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: 'Savings', value: data.savings },
    { name: 'Credit Card Balance', value: data.creditCard },
  ];

  // Use theme colors for the chart
  const COLORS = [
    `hsl(var(--chart-1))`,
    `hsl(var(--chart-2))`,
  ];

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">Balance Distribution</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill={`hsl(var(--primary))`}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: `hsl(var(--card))`,
                border: `1px solid hsl(var(--border))`,
                color: `hsl(var(--card-foreground))`,
              }}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: `hsl(var(--card-foreground))` }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
