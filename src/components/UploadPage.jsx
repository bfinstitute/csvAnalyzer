import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import CSVPreview from './CSVPreview'; // Adjust path if needed
import '../styles/UploadPage.css';

export default function UploadPage() {
  const [fileName, setFileName] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFile = (file) => {
    if (file && file.type === 'text/csv') {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          setPreviewData(results.data.slice(0, 5));
        },
      });
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div className="upload-page">
      {/* Left Column: Drag-and-Drop */}
      <div
        className="upload-dropzone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="upload-input"
        />
        <div className="dropzone-content">
          📁
          <p>Click or drag and drop your CSV file here</p>
        </div>
        {fileName && <p className="file-label">Uploaded: {fileName}</p>}
      </div>

      {/* Right Column: Info + Preview + Button */}
      <div className="upload-info">
        <h2>What happens next?</h2>
        <p>
          After uploading your CSV, we process it to generate a brief preview, summarize key metrics, and let you continue to a dashboard with visual insights.
        </p>

        {previewData.length > 0 && (
          <>
            {/* <div className="preview-section">
              <CSVPreview data={previewData} />
            </div> */}
            <h3>CSV Preview</h3>
            <div className="preview-table">
              <table>
                <thead>
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => (
                        <td key={i}>{val?.toString()}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="go-dashboard" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
