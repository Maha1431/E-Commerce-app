import React, { useState } from "react";
import { toast } from "react-toastify";

const RateProduct = ({ productId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitRating = () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    // Just simulate a success
    toast.success("Thanks for your feedback!");
    console.log("Rating submitted (frontend only):", {
      productId,
      rating,
      comment,
    });

    onClose(); // Close the form
  };

  return (
    <div className="mt-3 p-3 border rounded bg-gray-50">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl ${
              star <= rating ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="w-full p-2 border rounded mb-3"
      />
      <div className="flex gap-3">
        <button
          onClick={submitRating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RateProduct;
