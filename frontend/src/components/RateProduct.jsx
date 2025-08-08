import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RateProduct = ({ productId, userId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
   const backendUrl = import.meta.env.VITE_BACKEND_URL 

  const handleSubmit = async () => {
    if (rating === 0 || comment.trim() === "") {
      toast.error("Please select a rating and write a comment.");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(backendUrl + '/api/product/rate', {
        productId,
        userId,
        rating,
        comment,
      });

      toast.success("Rating submitted successfully!");
      onClose();  // Close immediately
    } catch (err) {
      console.error("Rating submission error:", err);
      toast.error("Error submitting rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 mt-2 rounded shadow">
      <h4 className="font-semibold text-sm mb-2">Rate this product:</h4>

      {/* Rating Buttons */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => setRating(num)}
            className={`w-8 h-8 rounded-full border text-sm font-semibold 
              ${rating >= num ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave your comment..."
        rows={3}
        className="w-full p-2 border rounded text-sm mb-3"
      />

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
        <button
          onClick={onClose}
          className="text-gray-500 text-sm underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RateProduct;
