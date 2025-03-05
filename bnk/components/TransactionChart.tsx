import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function TransactionChart() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:4000/transactions/user', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        
        // Process the data to group by date and calculate daily totals
        const dailyTotals = data.reduce((acc, transaction) => {
          const date = new Date(transaction.createdAt).toLocaleDateString();
          acc[date] = (acc[date] || 0) + transaction.amount;
          return acc;
        }, {});

        // Convert to array format for Recharts
        const chartData = Object.entries(dailyTotals).map(([date, amount]) => ({
          date,
          amount,
        }));

        // Sort by date
        chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setTransactions(chartData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  // Get the CSS variable values
  const primaryColor = `hsl(var(--primary))`;
  const backgroundColor = `hsl(var(--background))`;

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">Transaction History (Past Month)</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={transactions}>
            <CartesianGrid strokeDasharray="3 3" stroke={`hsl(var(--muted))`} />
            <XAxis 
              dataKey="date" 
              stroke={`hsl(var(--card-foreground))`}
            />
            <YAxis 
              stroke={`hsl(var(--card-foreground))`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: `hsl(var(--card))`,
                border: `1px solid hsl(var(--border))`,
                color: `hsl(var(--card-foreground))`,
              }}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke={primaryColor}
              fill={primaryColor}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
