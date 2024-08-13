// Step1.js
import React, { useState } from "react";

const Step1 = ({ data, onNext, onBack, onSubmit }) => {
  const [inputData, setInputData] = useState(data.step1 || {});

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    // Validate the inputData here before proceeding
    onNext({ step1: inputData });
  };

  const handleBack = () => {
    // Simply call the onBack function to navigate back
    onBack();
  };

  return (
    <div>
      <h2>Step 1</h2>
      <input
        type="text"
        name="field1"
        value={inputData.field1 || ""}
        onChange={handleInputChange}
        placeholder="Enter some data"
      />
      <div>
        <button onClick={handleBack}>Back</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default Step1;
