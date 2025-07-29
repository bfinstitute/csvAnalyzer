// src/components/CSVEditor.jsx
import { useCsv } from '../context/CsvContext';
import { useState } from 'react';
import '../styles/CSVEditor.css';

export default function CSVEditor() {
  const { csvData, setCsvData } = useCsv();
  const [localData, setLocalData] = useState(csvData);

  const handleCellChange = (rowIndex, key, value) => {
    const updated = [...localData];
    updated[rowIndex][key] = value;
    setLocalData(updated);
  };

  const handleSave = () => {
    setCsvData(localData);
    alert('CSV updated!');
  };

  const handleDownload = () => {
    const headers = Object.keys(localData[0]);
    const csv = [
      headers.join(','),
      ...localData.map((row) =>
        headers.map((key) => JSON.stringify(row[key] || '')).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'edited.csv';
    a.click();
  };

  return (
    <div className="csv-editor-container">
      <h2>Edit Your CSV</h2>
      <table>
        <thead>
          <tr>
            {Object.keys(localData[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {localData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(row).map((key) => (
                <td key={key}>
                  <input
                    type="text"
                    value={row[key]}
                    onChange={(e) => handleCellChange(rowIndex, key, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDownload}>Download CSV</button>
    </div>
  );
}
