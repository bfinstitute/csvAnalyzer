import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import '../styles/UploadPage.css';
import { useCsv } from '../context/CsvContext';
import Header from './Header';
import uploadLogo from '../assets/images/iconoir_cloud-upload.svg'
import ProgressDots from './ProgressDots';
import UploadInfo from './UploadInfo';

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
          navigate('/edit');
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
    <div>
      <Header></Header>
      <div className="upload-page">
          <UploadInfo />
          <ProgressDots />
        <div
          className="upload-dropzone upload-area"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="upload-input"
          />
          <div className="dropzone-content">
            <img src={uploadLogo} alt="Upload Logo"/>
            <p className="dropzone-text">Drag and drop a CSV or browse to attach</p>
            <button className="attach-button" onClick={() => fileInputRef.current.click()}>
              Upload Your CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
