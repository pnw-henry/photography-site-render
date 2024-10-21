import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import SocialLinks from "./SocialLinks";
import Header from "./Header";
import Navigation from "./Navigation";

import "../css/PurchaseConfirm.css";

function PurchaseConfirm() {
  const [sessionDetails, setSessionDetails] = useState({});
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }
  }, [sessionId, navigate]);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await axios.get(
          `/checkout/success?session_id=${sessionId}`
        );
        if (response.data) {
          setSessionDetails(response.data);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to fetch session details: ", error);
        navigate("/");
      }
    };
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);
  return (
    <div className="confirmation-page">
      <Header />
      <Navigation />
      <div className="confirmation-container">
        {sessionDetails.payment_status === "paid" ? (
          <div>
            <h1>I've received your order!</h1>
            <p>
              Thank you, {sessionDetails.customer_details.name}! You will
              receive an email to {sessionDetails.customer_details.email} with
              tracking information after your print has shipped. Please allow 2
              - 3 weeks for delivery. Reach out to me on social media or email
              if you have any questions.
            </p>
          </div>
        ) : (
          <div>
            <h1>Payment failed</h1>
            <p>
              Your payment was not successful. Please try again or reach out to
              me on social media or email if you have any questions.
            </p>
          </div>
        )}
      </div>
      <SocialLinks />
    </div>
  );
}

export default PurchaseConfirm;
