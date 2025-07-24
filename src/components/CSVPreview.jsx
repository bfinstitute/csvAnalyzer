// src/components/CSVPreview.jsx
import React from 'react';
import '../styles/CSVPreview.css';

const annotateColumn = (columnName) => {
  const lower = columnName.toLowerCase();
  if (lower.includes("age")) return `${columnName} (User's age in years)`;
  if (lower.includes("salary") || lower.includes("income")) return `${columnName} (Monthly income in USD)`;
  if (lower.includes("name")) return `${columnName} (Full name)`;
  if (lower.includes("email")) return `${columnName} (Email address)`;
  return `${columnName} (Column data)`;
};

const CSVPreview = ({ data }) => {
  if (!data || data.length === 0) return <div className="csv-preview">No data to display.</div>;

  const headers = Object.keys(data[0]);

  return (
    <div className="csv-preview">
      <h3>CSV Preview</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{annotateColumn(header)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header) => (
                  <td key={header}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CSVPreview;
