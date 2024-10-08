// Step1.js
import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup } from 'react-bootstrap';
import { fetchTicketCategories } from '../../../services/core.js';

const Step1 = ({ data, onNext, onBack, setError, setLoading, loading, token }) => {
  const [inputData, setInputData] = useState(data.step1 || {});
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });

    // Trigger fetch when user leaves the field or types a space
    const regex = /^\s*(\w+\s+)*\w+\s+$/;

    if (name === 'title' && regex.test(value)) {
      fetchCategories(value);
    }
  };

  const fetchCategories = async (title) => {
    setLoading(true);
    const response = await fetchTicketCategories(token, { ticketTitle: title });
    if (response.success) {
      setCategories(response.data);
    } else {
      setError(response.message || 'Failed to fetch categories');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (inputData.title === '') {
      setCategories([]);
    }
  }, [inputData.title]);

  return (
    <div>
      <h2 className="display-6 text-muted mb-3 mb-xxl-4 mb-xxxl-5">Step 1</h2>
      <Form.Group className="mb-2 mb-xxxl-4">
        <Form.Label className="w-100">Title: <span className="text-danger">*</span>
          <InputGroup>
            <Form.Control
              type="text"
              name="title"
              value={inputData.title || ""}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter title"
            />
            {loading && (
              <Button
                variant="outline-secondary"
                onClick={() => setInputData({ ...inputData, title: '' })}
                disabled={loading}
                className="input-group-text"
              >
                &times;
              </Button>
            )}
          </InputGroup>
          <Form.Text className="text-muted">
            Give a title that explains the issue the best.
          </Form.Text>
        </Form.Label>
      </Form.Group>


      <Form.Group className="mb-2 mb-xxxl-4">
        <Form.Label className="w-100">Category: <span className="text-danger">*</span>
          <Form.Control
            as="select"
            name="categoryId"
            value={inputData.categoryId || ""}
            onChange={handleChange}
            disabled={loading || categories.length === 0}
          >
            <option value="">&nbsp;</option>
            {categories.map(category => (
              <option key={category.ticketCategoryId} value={category.ticketCategoryId}>
                {category.ticketCategoryName}
              </option>
            ))}
          </Form.Control>

          <Form.Text className="text-muted">
            {!loading && categories.length > 0 ? "Select a category." : "\u00A0"}
          </Form.Text>

        </Form.Label>
      </Form.Group>

    </div>
  );
};

export default Step1;
