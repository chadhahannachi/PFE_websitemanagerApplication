import React, { useState } from "react";
import ContactInfo from "./ContactInfo.tsx";
import axios from "axios";

interface LicenceType {
  type: 'basic' | 'professional' | 'enterprise';
  price: 50 | 100 | 150;
}

const licenceTypes: LicenceType[] = [
  {
    type: 'basic',
    price: 50
  },
  {
    type: 'professional',
    price: 100
  },
  {
    type: 'enterprise',
    price: 150
  }
];

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    type: "",
    description: "",
    price: 50,
    duration_months:0,
    requested_at: new Date().toISOString()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTypeSelect = (selectedType: LicenceType) => {
    setFormData(prevState => ({
      ...prevState,
      type: selectedType.type,
      price: selectedType.price
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/licence-requests', formData);
      console.log('Licence request created:', response.data);
      // Reset form after successful submission
      setFormData({
        company_name: "",
        company_email: "",
        company_phone: "",
        company_address: "",
        type: "",
        description: "",
        price: 0,
        duration_months:0,
        requested_at: new Date().toISOString()
      });
      alert('Licence request submitted successfully!');
    } catch (error) {
      console.error('Error creating licence request:', error);
      alert('Error submitting licence request. Please try again.');
    }
  };

  return (
    <>
      <div className="contat-us-area pb-150">
        <div className="container">
          <div className="section-title">
            <span className="top-title">LICENCE REQUEST</span>
            <h2>Request Your Licence</h2>
          </div>

          <div className="row">
            <div className="col-xl-8 mb-5 mb-xl-0">
              <div className="contat-us-form">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group mb-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Company Name"
                          name="company_name"
                          value={formData.company_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group mb-4">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Company Email"
                          name="company_email"
                          value={formData.company_email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group mb-4">
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="Company Phone"
                          name="company_phone"
                          value={formData.company_phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group mb-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Company Address"
                          name="company_address"
                          value={formData.company_address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-4">
                        <label className="d-block mb-3">Select Licence Type:</label>
                        <div className="row">
                          {licenceTypes.map((licenceType) => (
                            <div key={licenceType.type} className="col-md-4 mb-3">
                              <div 
                                className={`card ${formData.type === licenceType.type ? 'border-primary' : ''}`}
                                style={{ cursor: 'pointer', maxWidth: '200px' }} // Ajout de maxWidth
                                onClick={() => handleTypeSelect(licenceType)}
                              >
                                <div className="card-body">
                                  <h5 className="card-title text-capitalize">{licenceType.type}</h5>
                                  <h6 className="card-subtitle mb-2 text-muted">${licenceType.price}/month</h6>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>


                    <div className="col-lg-6">
                      <div className="form-group mb-4">
                      <label className="d-block mb-3">duration</label>

                        <input
                          type="text"
                          className="form-control"
                          placeholder="duration_months"
                          name="duration_months"
                          value={formData.duration_months}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>



                    <div className="col-lg-12">
                      <div className="form-group mb-4">
                        <textarea
                          className="form-control"
                          placeholder="Additional Description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-0">
                        <button 
                          type="submit" 
                          className="default-btn rounded-10 active border-0"
                          disabled={!formData.type}
                        >
                          Submit Request
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-xl-4">
              <ContactInfo />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUsForm;
