import React, { useState } from 'react';

function FormGenerator() {
  const [formFields, setFormFields] = useState([]);

  const generateForm = async (prompt) => {
    const response = await fetch('/forms/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    setFormFields(data.fields); // Assuming the API returns a 'fields' array
  };

  return (
    <div>
      <button onClick={() => generateForm('Your prompt here')}>Generate Form</button>
      {/* Render form fields here */}
    </div>
  );
}

export default FormGenerator;