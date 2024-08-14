// Step1.js
import React, { useState } from "react";
import Form from 'react-bootstrap/Form';

const Step1 = ({ data, onNext, onBack, setError, setLoading, loading }) => {
  const [inputData, setInputData] = useState(data.step1 || {});

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="display-6 text-muted mb-3 mb-xxl-4 mb-xxxl-5">Step 1</h2>
      <Form.Group className="mb-2 mb-xxxl-4">
        <Form.Label className="w-100">Title:
          <Form.Control
            type="text"
            name="displayName"
            value={inputData.title || ""}
            onChange={handleChange}
            disabled={loading}
          />
          <Form.Text className="text-muted">
            Give a title that explains the issue the best.
          </Form.Text>
        </Form.Label>
      </Form.Group>

    </div>
  );
};

export default Step1;
