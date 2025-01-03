import React, { useState } from "react";
import axios from "axios";
import "../css/Purchase.css";
import { useStripe } from "@stripe/react-stripe-js";

const Purchase = ({ photo }) => {
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();

  const formatPhotoName = (key) => {
    const nameWithExtension = key.split("/").pop();
    const nameWithoutExtension = nameWithExtension
      .split(".")
      .slice(0, -1)
      .join(".");
    return nameWithoutExtension;
  };

  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

  const handlePurchase = async () => {
    if (!stripe) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "/create_checkout_session",
        {
          price_id: getPriceId(size),
          photo_key: photo.key,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const sessionId = response.data.id;
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getPriceId = (size) => {
    switch (size) {
      case "4x6":
        return "price_1QCS9fJuChuTF1ivKAYQMM10";
      case "5x7":
        return "price_1QCSAdJuChuTF1ivQ4DaV6yO";
      case "8x10":
        return "price_1QCSBXJuChuTF1ivMUzGmznm";
      case "16x20":
        return "price_1QCSCwJuChuTF1ivPlqQjDFL";
      default:
        return "";
    }
  };

  return (
    <div className="purchase">
      <h2>Purchase "{formatPhotoName(photo.key)}"</h2>
      <div className="purchase-options">
        <select value={size} onChange={handleSizeChange}>
          <option value="" disabled>
            Select Print Size
          </option>
          <option value="4x6">Small Print - 4x6"</option>
          <option value="5x7">Medium Print - 5x7"</option>
          <option value="8x10">Large Print - 8x10"</option>
          <option value="16x20">X-Large Print - 16x20"</option>
        </select>
        <p className="print-cost">
          Total: $
          {size === "4x6"
            ? "30"
            : size === "5x7"
            ? "40"
            : size === "8x10"
            ? "60"
            : size === "16x20"
            ? "95"
            : "0"}
        </p>
        <p className="print-summary">
          Printed on fine art archival photo matte paper. Frame not included.
          Please allow 2 -3 weeks for processing and delivery. Ships with love
          and care from Seattle, WA.
        </p>
        <button
          className="purchase-button"
          onClick={handlePurchase}
          disabled={!size}
        >
          {loading ? "Loading..." : "Pay With Stripe"}
        </button>
      </div>
    </div>
  );
};

export default Purchase;
