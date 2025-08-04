import { useState } from 'react';
import '../styles/CSVFeedbackForm.css'

const CSVFeedbackForm = () => {
  const [formData, setFormData] = useState({
    purpose: '',
    stakeholders: '',
    incorrectFields: '',
    terminology: '',
    additionalContext: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send this data to a backend or use it however you want
    console.log('Form Submitted:', formData);
    alert('Feedback submitted. Thank you!');
  };

  return (
    <form className="csv-feedback-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Feedback Regarding the CSV</legend>
        <label>
          <p>What was the original purpose of this CSV file?</p>
          <textarea name="purpose" value={formData.purpose} onChange={handleChange} />
        </label>
        <label>
          <p>Who relies on this data internally or externally?</p>
          <textarea name="stakeholders" value={formData.stakeholders} onChange={handleChange} />
        </label>
        <label>
          <p>Were any fields handled incorrectly?</p>
          <textarea name="incorrectFields" value={formData.incorrectFields} onChange={handleChange} />
        </label>
        <label>
          <p>Any terms, cells, or headers that need clarification?</p>
          <textarea name="terminology" value={formData.terminology} onChange={handleChange} />
        </label>
        <label>
          <p>Any other files, rules, comments or context we should consider?</p>
          <textarea name="additionalContext" value={formData.additionalContext} onChange={handleChange} />
        </label>
      </fieldset>

      <button type="submit">Submit Feedback</button>
    </form>
  );
};

export default CSVFeedbackForm;
