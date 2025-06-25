import React, { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import axios, { AxiosError } from 'axios';


const PayDoneContent = () => {
  const location = useLocation();
  const [licence, setLicence] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const calculateDurationInMonths = (startDateStr: string, endDateStr: string): number => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    return (endYear - startYear) * 12 + (endMonth - startMonth);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const licenceId = queryParams.get('licence_id');
    const paymentId = queryParams.get('payment_id');

    if (licenceId && paymentId) {
      const fetchDetails = async () => {
        try {
          const licenceResponse = await axios.get(`http://localhost:5000/licences/${licenceId}`);
          const paymentResponse = await axios.get(`http://localhost:5000/api/payments/${paymentId}`);
          
          console.log('Licence response:', licenceResponse.data);
          console.log('Payment response:', paymentResponse.data);


          setLicence(licenceResponse.data);
          setPayment(paymentResponse.data.data);
        } catch (err: any) {
          if (err instanceof AxiosError) {
            console.error('Axios error fetching data:', {
              message: err.message,
              status: err.response?.status,
              statusText: err.response?.statusText,
              data: err.response?.data,
              config: err.config,
            });
            setError(`Failed to load details: ${err.response?.data?.message || err.message}`);
          } else {
            console.error('Error fetching data:', err);
            setError(`Failed to load details. An unexpected error occurred: ${err.message || err}`);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    } else {
      setError('Missing licence or payment ID.');
      setLoading(false);
    }
  }, [location.search]);

  if (loading) {
    return <div className="text-center ptb-175">Loading...</div>;
  }

  if (error) {
    return <div className="text-center ptb-175" style={{ color: 'red' }}>{error}</div>;
  }

  if (!licence || !payment) {
    return (
      <div className="text-center ptb-175" style={{ color: 'orange' }}>
        No data found. Licence: {JSON.stringify(licence)} <br />
        Payment: {JSON.stringify(payment)}
      </div>
    );
  }

  const durationMonths = licence.start_date && licence.end_date 
    ? calculateDurationInMonths(licence.start_date, licence.end_date) 
    : 'N/A';


    const handlePrint = () => {
      if (printRef.current) {
        const printContents = printRef.current.innerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Payment Details</title>
                <style>
                  * {
                    box-sizing: border-box;
                  }
                  body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #000;
                  }
                  h3, h4 {
                    margin-bottom: 20px;
                  }
                  .d-flex {
                    display: flex;
                    align-items: center;
                  }
                  .me-2 {
                    margin-right: 8px;
                  }
                  .ms-4 {
                    margin-left: 16px;
                  }
                  .mb-40 {
                    margin-bottom: 40px;
                  }
                  .booking-list {
                    padding: 0;
                    list-style: none;
                  }
                  .booking-list li {
                    margin-bottom: 10px;
                    font-size: 14px;
                  }
                  .date-title {
                    font-weight: bold;
                    display: block;
                    margin-bottom: 5px;
                  }
                  .date {
                    display: block;
                  }
                  .border-right {
                    border-right: 1px solid #ccc;
                  }
                  .row {
                    display: flex;
                  }
                  .col-lg-6 {
                    width: 50%;
                    padding: 10px;
                  }
                  .rounded-10 {
                    border-radius: 10px;
                  }
                  .default-btn {
                    background-color: #f59e0b;
                    color: white;
                    padding: 10px 20px;
                    font-size: 16px;
                    border: none;
                    cursor: pointer;
                  }
                </style>
              </head>
              <body>
                ${printContents}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 500);
        }
      }
    };
    

    
  return (
    <>
      <div className="chackout-area ptb-175">
        <div className="container" ref={printRef}>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="chackout-content your-booking">
                <h4>Your Payment Details</h4>

                <div className="d-flex align-items-center mb-40">
                  <div className="flex-shrink-0">
                  <i
                          className="ri-shield-check-fill"
                          style={{ color: "#014268", fontSize: "80px" }}
                        ></i>
                  </div>

                  <div className="flex-grow-1 ms-4">
                    {/* <ul className="ps-0 pe-0 mb-3 list-unstyled d-flex align-items-center">
                      <li className="me-1">
                        <i
                          className="ri-shield-check-fill"
                          style={{ color: "#FFC107", fontSize: "18px" }}
                        ></i>
                      </li>
                      <li className="me-1">
                        <i
                          className="ri-star-fill"
                          style={{ color: "#FFC107", fontSize: "18px" }}
                        ></i>
                      </li>
                      <li className="me-1">
                        <i
                          className="ri-star-fill"
                          style={{ color: "#FFC107", fontSize: "18px" }}
                        ></i>
                      </li>
                      <li className="me-1">
                        <i
                          className="ri-star-fill"
                          style={{ color: "#FFC107", fontSize: "18px" }}
                        ></i>
                      </li>
                      <li className="me-1">
                        <i
                          className="ri-star-fill"
                          style={{ color: "#FFC107", fontSize: "18px" }}
                        ></i>
                      </li>
                    </ul> */}
                    <div className="d-flex align-items-center">
                      <h6 className="me-2">Licence Type:</h6>
                      <span>{licence.type}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <h6 className="me-2">Description:</h6>
                      <span>{licence.description}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <h6 className="me-2">Duration:</h6>
                      <span>{durationMonths} months</span>
                    </div>
                  </div>
                </div>

                <div className="row g-0">
                  <div className="col-lg-6">
                    <div className="date-wrap border-right">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="">
                          <span className="date-title">Payment Date</span>
                          <span className="date">{new Date(payment.payment_date).toLocaleDateString()}</span>
                        </div> 
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="date-wrap">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <span className="date-title">Company Email</span>
                          <span className="date">{licence.company_email}</span>
                        </div> 
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-40"></div>

                <h3>Booking detail</h3>

                <ul className="booking-list ps-0 pe-0 list-unstyled">
                  <li>
                    <span>Payment ID</span>
                    {payment.id}
                  </li>
                  <li>
                    <span>Date</span>
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </li>
                  <li>
                    <span>Total</span>
                    {payment.amount} {payment.currency}
                  </li>
                  <li>
                    <span>Payment method</span>
                    {payment.payment_method}
                  </li>
                  <li>
                    <span>Payment Status</span>
                    {payment.status}
                  </li>
                </ul>

                <button
                  type="button"
                  className="default-btn rounded-10 active border-0"
                  onClick={handlePrint}
                >
                  Print
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayDoneContent;
