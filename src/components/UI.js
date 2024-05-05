import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPrediction(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error predicting:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center mb-4">Brain Tumor Classification</h5>
              <input type="file" onChange={handleFileChange} className="form-control mb-3" />
              {imagePreview && (
                <div className="text-center mb-3">
                  <img src={imagePreview} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                </div>
              )}
              <button onClick={handlePredict} className="btn btn-primary btn-block" disabled={!selectedFile || loading}>
                {loading ? 'Predicting...' : 'Predict'}
              </button>
              {prediction && (
                <div className="mt-4">
                  <h6>Prediction: {prediction.prediction}</h6>
                  <p>Confidence: {prediction.confidence.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
