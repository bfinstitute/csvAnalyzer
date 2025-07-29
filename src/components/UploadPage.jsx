import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import CSVPreview from './CSVPreview';
import '../styles/UploadPage.css';
import { useCsv } from '../context/CsvContext';

export default function UploadPage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { setCsvData, setFileName, fileName, csvData } = useCsv(); // ✅ usar contexto

  const handleFile = (file) => {
    if (file && file.type === 'text/csv') {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          setCsvData(results.data);
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

      <div className="upload-info">
        <h2>What happens next?</h2>
        <p>
          After uploading your CSV, we process it to generate a brief preview, summarize key metrics,
          and let you continue to a dashboard with visual insights.
        </p>
        {csvData.length > 0 && (
          <>
            <CSVPreview data={csvData.slice(0, 10)} />
            <button className="go-dashboard" onClick={() => navigate('/edit')}>
              Go Edit CSV
            </button>
          </>
        )}
      </div>
    </div>
  );
}
