import React, { useState, useEffect } from "react";
import axios from "axios";

function ExcelManager() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState({ id: null, sheetIndex: null, rowIndex: null, colKey: null });
  const [editValue, setEditValue] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTabs, setActiveTabs] = useState({});
  const [renameMode, setRenameMode] = useState({ id: null, sheetIndex: null });
  const [newSheetName, setNewSheetName] = useState("");

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("https://properties-backend-ok36.onrender.com/api/excel/data", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
      
      // Initialize active tabs (first sheet for each document)
      const tabs = {};
      res.data.forEach(doc => {
        tabs[doc._id] = 0; // Default to first sheet
      });
      setActiveTabs(tabs);
    } catch (err) {
      console.error("Error fetching data:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // File selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setUploadStatus("");
      } else {
        setUploadStatus("Please select a valid Excel or CSV file");
        setFile(null);
      }
    }
  };

  // Upload file
  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file!");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post("https://properties-backend-ok36.onrender.com/api/excel/upload", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });
      setUploadStatus(res.data.message);
      setFile(null);
      // Clear file input
      document.getElementById("file-input").value = "";
      fetchData(); // reload table
    } catch (err) {
      setUploadStatus("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Start editing a cell
  const handleCellEdit = (docId, sheetIndex, rowIndex, colKey, value) => {
    setEditing({ id: docId, sheetIndex, rowIndex, colKey });
    setEditValue(value);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditing({ id: null, sheetIndex: null, rowIndex: null, colKey: null });
    setEditValue("");
  };

 // Save updated cell
const handleSaveEdit = async () => {
  if (!editing.id || editing.sheetIndex === null || editing.rowIndex === null || !editing.colKey) return;

  try {
    const token = localStorage.getItem('token');
    const newData = { [editing.colKey]: editValue };

    await axios.put(
      `https://properties-backend-ok36.onrender.com/api/excel/data/${editing.id}/${editing.sheetIndex}/${editing.rowIndex}`,
      { newData },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ Optimistically update local state
    setData(prevData => 
      prevData.map(doc => {
        if (doc._id !== editing.id) return doc;

        const updatedSheets = doc.sheets.map((sheet, sIndex) => {
          if (sIndex !== editing.sheetIndex) return sheet;

          const updatedRows = sheet.data.map((row, rIndex) => {
            if (rIndex !== editing.rowIndex) return row;
            return { ...row, [editing.colKey]: editValue };
          });

          return { ...sheet, data: updatedRows };
        });

        return { ...doc, sheets: updatedSheets };
      })
    );

    setEditing({ id: null, sheetIndex: null, rowIndex: null, colKey: null });
    setEditValue("");

  } catch (err) {
    console.error("Error updating cell:", err.message);
  }
};


  // Delete a sheet
  const handleDeleteSheet = async (docId, sheetIndex) => {
    if (!window.confirm("Are you sure you want to delete this sheet?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://properties-backend-ok36.onrender.com/api/excel/data/${docId}/${sheetIndex}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error("Error deleting sheet:", err.message);
    }
  };

  // Delete an entire file
  const handleDeleteFile = async (docId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://properties-backend-ok36.onrender.com/api/excel/file/${docId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error("Error deleting file:", err.message);
    }
  };

  // Switch active sheet for a document
  const switchSheet = (docId, sheetIndex) => {
    setActiveTabs({
      ...activeTabs,
      [docId]: sheetIndex
    });
    setRenameMode({ id: null, sheetIndex: null });
  };

  // Start renaming a sheet
  const startRenameSheet = (docId, sheetIndex, sheetName) => {
    setRenameMode({ id: docId, sheetIndex });
    setNewSheetName(sheetName);
  };

  // Save renamed sheet
  const saveRenamedSheet = async (docId, sheetIndex) => {
    try {
      const token = localStorage.getItem('token');
      const doc = data.find(d => d._id === docId);
      
      if (doc && doc.sheets[sheetIndex]) {
        doc.sheets[sheetIndex].sheetName = newSheetName;
        
        await axios.put(
          `https://properties-backend-ok36.onrender.com/api/excel/data/${docId}`,
          { sheets: doc.sheets },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setRenameMode({ id: null, sheetIndex: null });
        setNewSheetName("");
        fetchData();
      }
    } catch (err) {
      console.error("Error renaming sheet:", err.message);
    }
  };

  // Handle key presses for cell editing
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDownloadFile = async (docId, fileName) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(
      `https://properties-backend-ok36.onrender.com/api/excel/file/download/${docId}`,
      { 
        responseType: 'blob', // important to handle binary data
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // Create a download link and trigger it
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // set the original file name
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Error downloading file:", err.message);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel File Manager
          </h1>
          <p className="text-gray-600">Upload, view and edit Excel files in a spreadsheet-like interface</p>
        </div>
        

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <label className="block flex-grow">
              <span className="sr-only">Choose Excel file</span>
              <input 
                id="file-input"
                type="file" 
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept=".xlsx, .xls, .csv"
              />
            </label>
            <button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className={`px-6 py-2 rounded-md text-white font-medium ${!file || isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : 'Upload File'}
            </button>
          </div>
          
          {file && (
            <p className="mt-4 text-sm text-gray-600">
              Selected file: <span className="font-medium">{file.name}</span> ({Math.round(file.size / 1024)} KB)
            </p>
          )}
          
          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-md text-sm ${uploadStatus.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Data Display Section */}
        {data.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Excel files uploaded yet</h3>
            <p className="text-gray-500">Upload your first Excel file to get started</p>
          </div>
        ) : (
          data.map((doc) => {
            const activeSheetIndex = activeTabs[doc._id] || 0;
            const activeSheet = doc.sheets[activeSheetIndex];
            
            return (
              <div key={doc._id} className="bg-white rounded-lg shadow-md p-4 mb-8">
                {/* File Header with Tabs */}
                <div className="flex flex-col mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      {doc.fileName}
                   {/* <button
    onClick={() => handleDownloadFile(doc._id, doc.fileName)}
    className="ml-2 text-blue-500 hover:text-blue-700"
    title="Download file"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
    </svg>
  </button> */}
       <button 
                        onClick={() => handleDeleteFile(doc._id, doc.fileName)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        title="Delete entire file"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </h2>
                    <span className="text-sm text-gray-500">
                      Uploaded by: {doc.uploadedBy?.username || 'Unknown'}
                    </span>
                  </div>
                  
                  {/* Sheet Tabs */}
                  <div className="flex border-b overflow-x-auto">
                    {doc.sheets.map((sheet, index) => (
                      <div 
                        key={index}
                        className={`flex items-center py-2 px-4 border-b-2 cursor-pointer ${activeSheetIndex === index ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-100'}`}
                        onClick={() => switchSheet(doc._id, index)}
                      >
                        {renameMode.id === doc._id && renameMode.sheetIndex === index ? (
                          <input
                            type="text"
                            value={newSheetName}
                            onChange={(e) => setNewSheetName(e.target.value)}
                            onBlur={() => saveRenamedSheet(doc._id, index)}
                            onKeyPress={(e) => e.key === 'Enter' && saveRenamedSheet(doc._id, index)}
                            className="text-sm px-1 py-0.5 border rounded"
                            autoFocus
                          />
                        ) : (
                          <>
                            <span className="text-sm font-medium">{sheet.sheetName}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                startRenameSheet(doc._id, index, sheet.sheetName);
                              }}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              title="Rename sheet"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </>
                        )}
                        
                        {doc.sheets.length > 1 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSheet(doc._id, index);
                            }}
                            className="ml-2 text-gray-400 hover:text-red-500"
                            title="Delete sheet"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Spreadsheet */}
                {activeSheet && activeSheet.data.length > 0 ? (
                  <div className="overflow-auto max-h-96 border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="w-12 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100 border-r">#</th>
                          {Object.keys(activeSheet.data[0]).map((key) => (
                            <th 
                              key={key} 
                              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100 border-r"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeSheet.data.map((row, rowIndex) => (
                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700 bg-gray-100 border-r">{rowIndex + 1}</td>
                            {Object.keys(row).map((key) => (
                              <td 
                                key={key} 
                                className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 border-r cursor-cell"
                                onClick={() => handleCellEdit(doc._id, activeSheetIndex, rowIndex, key, row[key])}
                                onDoubleClick={() => handleCellEdit(doc._id, activeSheetIndex, rowIndex, key, row[key])}
                              >
                                {editing.id === doc._id && 
                                 editing.sheetIndex === activeSheetIndex && 
                                 editing.rowIndex === rowIndex && 
                                 editing.colKey === key ? (
                                  <input
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={handleSaveEdit}
                                    onKeyDown={handleKeyPress}
                                    className="w-full px-2 py-1 border border-blue-500 rounded shadow-inner"
                                    autoFocus
                                  />
                                ) : (
                                  <span className="block px-2 py-1">{row[key]}</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border rounded-lg">
                    No data available in this sheet
                  </div>
                )}
                
                <div className="mt-4 text-xs text-gray-500">
                  Click once to select a cell, double-click to edit
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ExcelManager;