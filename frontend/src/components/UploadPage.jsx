import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import CSVPreview from './CSVPreview'; // Adjust path if needed
import '../styles/UploadPage.css';

export default function UploadPage() {
  const [fileName, setFileName] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [summary, setSummary] = useState(null);
  const [annotations, setAnnotations] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFile = (file) => {
    if (file && file.type === 'text/csv') {
      setFileName(file.name);
      // Send file to backend
      const formData = new FormData();
      formData.append('file', file);
      setUploadStatus('Uploading...');
      fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.message) {
            setUploadStatus('Upload successful!');
            setSummary(data.summary);
            setAnnotations(data.annotations);
            // Parse and preview CSV after successful upload
            Papa.parse(file, {
              header: true,
              skipEmptyLines: true,
              dynamicTyping: true,
              complete: (results) => {
                setPreviewData(results.data.slice(0, 5));
              },
            });
          } else {
            setUploadStatus('Upload failed.');
          }
        })
        .catch(() => setUploadStatus('Upload failed.'));
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
        {uploadStatus && <p className="file-label">{uploadStatus}</p>}
        {/* After upload status, show summary and annotations if available */}
        {summary && (
          <div className="file-summary">
            <h3>File Summary</h3>
            <p><b>Rows:</b> {summary.num_rows}</p>
            <p><b>Columns:</b> {summary.num_columns}</p>
            <p><b>Column Names:</b> {summary.columns.join(', ')}</p>
            <h4>Sample Data:</h4>
            <pre style={{background:'#f4f4f4', padding:'8px', borderRadius:'6px'}}>{JSON.stringify(summary.sample, null, 2)}</pre>
          </div>
        )}
        {annotations && (
          <div className="file-annotations">
            <h3>Column Annotations</h3>
            <ul>
              {Object.entries(annotations).map(([col, desc]) => (
                <li key={col}><b>{col}:</b> {desc}</li>
              ))}
            </ul>
          </div>
        )}
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
