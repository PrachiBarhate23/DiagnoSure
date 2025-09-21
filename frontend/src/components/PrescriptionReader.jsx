import React, { useState } from 'react';
import './PrescriptionReader.css';

const PrescriptionReader = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf')) {
      // Store file information
      setUploadedFile(file);
      setFileName(file.name);
      setFileType(file.type);
      setFileSize((file.size / 1024 / 1024).toFixed(2)); // Convert to MB
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs, show file info instead of preview
        setUploadedImage(null);
      }
      
      // Reset analysis state
      setShowAnalysis(false);
      setExtractedText('');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf') {
        // Store file information
        setUploadedFile(file);
        setFileName(file.name);
        setFileType(file.type);
        setFileSize((file.size / 1024 / 1024).toFixed(2));
        
        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadedImage(e.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          setUploadedImage(null);
        }
        
        setShowAnalysis(false);
        setExtractedText('');
      }
    }
  };

  const analyzePrescription = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate file processing - this is where you'd integrate your AI model
      // For now, we'll simulate the analysis process
      
      // Step 1: Simulate OCR/Text extraction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate extracted text based on file type
      let mockExtractedText = '';
      if (fileType.startsWith('image/')) {
        mockExtractedText = `Dr. Sarah Johnson, MD
        Date: ${new Date().toLocaleDateString()}
        
        Patient: John Smith
        
        Rx:
        1. Amoxicillin 500mg - Take 1 capsule 3 times daily for 7 days
        2. Ibuprofen 200mg - Take 1 tablet every 4-6 hours as needed for pain
        3. Omeprazole 20mg - Take 1 capsule once daily before breakfast
        
        Instructions: Complete full course of antibiotics. Take with food if stomach upset occurs.`;
      } else {
        mockExtractedText = `Medical Prescription - PDF Document
        
        Prescribed medications extracted:
        - Amoxicillin 500mg capsules
        - Ibuprofen 200mg tablets  
        - Omeprazole 20mg capsules
        
        Dosage and instructions as per physician recommendations.`;
      }
      
      setExtractedText(mockExtractedText);
      
      // Step 2: Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show results
      setShowAnalysis(true);
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing the prescription. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="prescription-reader">

      <main className="main-content">
        <div className="prescription-header">
          <h2>AI Prescription Reader</h2>
          <p>
            Instantly understand your medications, detect potential interactions, and
            manage your health more effectively. Upload your prescription and let AI
            do the rest.
          </p>
        </div>

        <div className="hero-section">

          <div className="upload-section">
            <div 
              className="upload-area"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              {uploadedFile ? (
                <div className="uploaded-file">
                  {uploadedImage ? (
                    <div className="uploaded-image">
                      <img src={uploadedImage} alt="Uploaded prescription" />
                      <div className="image-overlay">
                        <button 
                          className="change-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('file-input').click();
                          }}
                        >
                          Change File
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="file-info">
                      <div className="file-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                        </svg>
                      </div>
                      <div className="file-details">
                        <h3>{fileName}</h3>
                        <p>Size: {fileSize} MB</p>
                        <p>Type: {fileType.split('/')[1].toUpperCase()}</p>
                        <button 
                          className="change-file-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('file-input').click();
                          }}
                        >
                          Change File
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </div>
                  <h3>Drag & Drop Image Here or Click to Upload</h3>
                  <p>Supported formats: JPG, PNG, PDF</p>
                </div>
              )}
              
              <input
                id="file-input"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleImageUpload}
                className="file-input"
              />
            </div>

            {uploadedFile && (
              <button 
                className="analyze-btn"
                onClick={analyzePrescription}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="spinner"></div>
                    Processing {fileType.startsWith('image/') ? 'Image' : 'PDF'}...
                  </>
                ) : (
                  'Analyze Prescription'
                )}
              </button>
            )}
          </div>

          {showAnalysis && (
            <div className="analysis-results">
              <h3 className="results-title">Analysis Results</h3>
              
              {extractedText && (
                <div className="extracted-text-section">
                  <h4 className="section-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    Extracted Text from {fileType.startsWith('image/') ? 'Image' : 'PDF'}
                  </h4>
                  <div className="extracted-text">
                    <pre>{extractedText}</pre>
                  </div>
                </div>
              )}
              
              <div className="results-grid">
                <div className="results-section">
                  <h4 className="section-title">Extracted Medications</h4>
                  
                  <div className="medication-item">
                    <div className="medication-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    </div>
                    <div className="medication-details">
                      <h5>Amoxicillin 500mg</h5>
                      <p>Take one capsule three times a day for 7 days.</p>
                      <p className="instruction">Finish the entire course of medication, even if symptoms improve.</p>
                    </div>
                  </div>

                  <div className="medication-item">
                    <div className="medication-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    </div>
                    <div className="medication-details">
                      <h5>Ibuprofen 200mg</h5>
                      <p>Take one tablet every 4-6 hours as needed for pain, do not exceed 1200mg in 24 hours.</p>
                      <p className="instruction">Take with food or milk to prevent stomach upset.</p>
                    </div>
                  </div>

                  <div className="medication-item">
                    <div className="medication-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    </div>
                    <div className="medication-details">
                      <h5>Omeprazole 20mg</h5>
                      <p>Take one capsule once daily before breakfast.</p>
                      <p className="instruction">Swallow whole. Do not crush or chew.</p>
                    </div>
                  </div>
                </div>

                <div className="results-section">
                  <h4 className="section-title">Safety & Interaction Alerts</h4>
                  
                  <div className="alert-item high">
                    <div className="alert-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                    <div className="alert-details">
                      <h5>High: Amoxicillin and Omeprazole Interaction</h5>
                      <p>Increased risk of stomach upset and diarrhea when taken together. Monitor for gastrointestinal discomfort.</p>
                    </div>
                  </div>

                  <div className="alert-item moderate">
                    <div className="alert-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                        <path d="M12 9v4"/>
                        <path d="m12 17 .01 0"/>
                      </svg>
                    </div>
                    <div className="alert-details">
                      <h5>Moderate: Ibuprofen and Asthma History</h5>
                      <p>Non-steroidal anti-inflammatory drugs (NSAIDs) like ibuprofen may exacerbate asthma symptoms in sensitive individuals. Use with caution and consult a doctor if breathing difficulties occur.</p>
                    </div>
                  </div>

                  <div className="alert-item none">
                    <div className="alert-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div className="alert-details">
                      <h5>None: No Critical Interactions Detected</h5>
                      <p>Based on the provided information, no other critical drug-drug interactions or severe warnings were found.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button className="print-btn" onClick={printReport}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 6,2 18,2 18,9"/>
                    <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                  Print Report
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PrescriptionReader;