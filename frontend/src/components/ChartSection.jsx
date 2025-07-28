import { Bar } from 'react-chartjs-2';
import '../styles/ChartSection.css';

export default function ChartSection({ data }) {
  const numericKeys = Object.keys(data[0] || {}).filter(key =>
    typeof data[0][key] === 'number'
  );

  if (numericKeys.length === 0) return null;

  const chartData = {
    labels: data.map((_, i) => `Row ${i + 1}`),
    datasets: numericKeys.map((key, idx) => ({
      label: key,
      data: data.map(d => d[key]),
      backgroundColor: `rgba(${100 + idx * 50}, 99, 132, 0.5)`
    }))
  };

  return (
    <div className="chart-wrapper">
      <h3>Chart Preview</h3>
      <Bar data={chartData} />
    </div>
  );
}
