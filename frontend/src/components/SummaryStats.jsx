import '../styles/SummaryStats.css';

export default function SummaryStats({ data }) {
  const numericKeys = Object.keys(data[0] || {}).filter(k => typeof data[0][k] === 'number');

  const stats = numericKeys.map(key => {
    const values = data.map(d => d[key]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return { key, count: values.length, mean: mean.toFixed(2) };
  });

  return (
    <div className="summary-wrapper">
      <h3>Summary Statistics</h3>
      <table>
        <thead>
          <tr><th>Column</th><th>Count</th><th>Mean</th></tr>
        </thead>
        <tbody>
          {stats.map(stat => (
            <tr key={stat.key}>
              <td>{stat.key}</td>
              <td>{stat.count}</td>
              <td>{stat.mean}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
