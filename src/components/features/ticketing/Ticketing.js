// Ticketing.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";

const steps = [Step1, Step2, Step3, Step4, Step5];

const Ticketing = () => {
  const { stepId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialStep = stepId ? parseInt(stepId, 10) - 1 : 0;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState({});

  // Extract title from query parameters
  const title = searchParams.get("title") || "";

  useEffect(() => {
    if (currentStep >= 0 && currentStep < steps.length) {
      navigate(`/new-ticket/${currentStep + 1}?title=${title}`);
    }
  }, [currentStep, navigate, title]);

  const CurrentStepComponent = steps[currentStep];

  const handleNext = (stepData) => {
    setFormData((prevData) => ({ ...prevData, ...stepData }));
    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleSubmit = (stepData) => {
    const finalData = { ...formData, ...stepData };
    // Handle final submission logic
    console.log("Submitted data:", finalData);
    navigate('/thank-you'); // Example redirect after submission
  };

  return (
    <div>
      <h1>{title}</h1>
      <CurrentStepComponent
        data={formData}
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={handleSubmit}
      />
      <div>
        {currentStep > 0 && (
          <button onClick={handleBack}>Back</button>
        )}
        {currentStep < steps.length - 1 ? (
          <button onClick={() => handleNext({})}>Next</button>
        ) : (
          <button onClick={() => handleSubmit({})}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default Ticketing;
