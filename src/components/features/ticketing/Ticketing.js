// Ticketing.js
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useUser } from '../../../contexts/UserContext.js';
import LoadingOverlay from '../../ui/LoadingOverlay.js';
import Step1 from "./Step1.js";
import Step2 from "./Step2.js";
import Step3 from "./Step3.js";
import Step4 from "./Step4.js";
import Step5 from "./Step5.js";

const steps = [Step1, Step2, Step3, Step4, Step5];

const Ticketing = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { stepId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialStep = stepId ? parseInt(stepId, 10) - 1 : 0;
  const [currentStep, setCurrentStep] = useState(initialStep >= 0 && initialStep < steps.length ? initialStep : 0);
  const [formData, setFormData] = useState({});
  const { user } = useUser();
  const { token } = user;

  // Extract title from query parameters
  const title = searchParams.get("title") || "";

  useEffect(() => {
    if (currentStep >= 0 && currentStep < steps.length) {
      const calculatedUrl = title ? `/new-ticket/${currentStep + 1}?title=${encodeURIComponent(title)}` : `/new-ticket/${currentStep + 1}`;
      const currentUrl = `${location.pathname}${location.search}`;
      if (currentUrl !== calculatedUrl) {
        navigate(calculatedUrl);
      }
    }
  }, [currentStep, navigate, title, location]);

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
    } else {
      navigate('/');
    }
  };

  const handleSubmit = (stepData) => {
    const finalData = { ...formData, ...stepData };
    // Handle final submission logic
    console.log("Submitted data:", finalData);
    navigate('/thank-you'); // Example redirect after submission
  };

  return (
    <>
      <div>
        <h1>{title}</h1>
        

      </div>

      <div className="min-vh-100 d-flex flex-column justify-content-start align-items-center">
        <Row className="w-100 p-0 m-0">
          {loading && <LoadingOverlay />}
          <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Left gap */}
          <Col xs={10} sm={10} md={10} lg={8} xl={6} xxl={4} className='px-0 py-4 pt-md-5 mx-0'> {/* Center content */}
            <Container className='p-4 rounded-4 border'>
              <Form onSubmit={handleSubmit} className="w-100">
                <h1 className="display-5 text-primary mb-3 mb-xxl-4 mb-xxxl-5">Create a new report</h1>
                {error &&
                  <Alert variant="danger">
                    <b>Errors:</b><br />
                    {error.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </Alert>
                }

                <CurrentStepComponent
                  data={formData}
                  onNext={handleNext}
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                  setError={setError}
                  setLoading={setLoading}
                  loding={loading}
                  token={token}
                />

                <div className={`d-flex ${currentStep > 0 ? 'justify-content-between' : 'justify-content-end'}`}>
                  {currentStep > 0 && (
                    <Button variant="primary" disabled={loading} className="text-nowrap overflow-hidden" onClick={handleBack}>Back</Button>
                  )}
                  {currentStep < steps.length - 1 ? (
                    <Button variant="primary" disabled={loading} className="text-nowrap overflow-hidden" onClick={() => handleNext({})}>Next</Button>
                  ) : (
                    <Button variant="primary" type="submit" disabled={loading} className="text-nowrap overflow-hidden" onClick={() => handleSubmit({})}>
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                          &nbsp;Submitting...
                        </>
                      ) : "Submit"}
                    </Button>
                  )}
                </div>
              </Form>
            </Container>
          </Col>
          <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Right gap */}
        </Row>
      </div>
    </>
  );
};

export default Ticketing;
