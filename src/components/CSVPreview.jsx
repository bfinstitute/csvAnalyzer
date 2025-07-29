// Inside CSVPreview.jsx

import { useState } from 'react';
// import '../styles/UploadPage.css';

const headerDescriptions = {
  street: 'The name of the person.',
  age: 'Age in years.',
  email: 'User email address.',
  // Add more mappings as needed
};

const CSVPreview = ({ data }) => {
  const [selectedHeader, setSelectedHeader] = useState(null);

  if (!data || data.length === 0) return <div className="preview-table">No data to display.</div>;

  const headers = Object.keys(data[0]);

  return (
    <div>
      <h3>CSV Preview</h3>
      {selectedHeader && (
        <div className="header-tooltip">
          <strong>{selectedHeader}:</strong> {headerDescriptions[selectedHeader] || 'No description available.'}
        </div>
      )}

      <div className="preview-table">
        <table>
          <thead>
            <tr className='preview-header'>
              {headers.map((header) => (
                <th
                  key={header}
                  onClick={() => setSelectedHeader(header)}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header) => (
                  <td key={header} >{row[header]}</td>
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
