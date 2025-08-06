import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const EditProductForm = ({ editItem, setEditItem, token, onSuccess }) => {
  const [name, setName] = useState(editItem.name);
  const [description, setDescription] = useState(editItem.description);
  const [price, setPrice] = useState(editItem.price);
  const [discountPrice, setDiscountPrice] = useState(editItem.discountPrice);
  const [sizes, setSizes] = useState(editItem.sizes || []);

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const allSizes = ['S', 'M', 'L', 'XL', 'XXL', '0-3M', '3-6M', '6-9M', '9-12M', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    form.append('id', editItem._id);
    form.append('name', name);
    form.append('description', description);
    form.append('price', price);
    form.append('discountPrice', discountPrice);
    form.append('sizes', JSON.stringify(sizes));
    form.append('existingImages', JSON.stringify(editItem.image));

    if (image1) form.append('image1', image1);
    if (image2) form.append('image2', image2);
    if (image3) form.append('image3', image3);
    if (image4) form.append('image4', image4);

    try {
      const res = await axios.put(`${backendUrl}/api/product/update`, form, {
        headers: { 'Content-Type': 'multipart/form-data', token },
      });

      if (res.data.success) {
        toast.success('Product updated successfully');
        setEditItem(null);
        onSuccess();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleSizeToggle = (sizeLabel) => {
    const existing = sizes.find((s) => s.size === sizeLabel);
    if (existing) {
      // remove
      setSizes((prev) => prev.filter((s) => s.size !== sizeLabel));
    } else {
      // add with default qty
      setSizes((prev) => [...prev, { size: sizeLabel, quantity: 0 }]);
    }
  };

  const handleQuantityChange = (sizeLabel, value) => {
    const newSizes = sizes.map((s) =>
      s.size === sizeLabel ? { ...s, quantity: parseInt(value) || 0 } : s
    );
    setSizes(newSizes);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex justify-center items-center overflow-auto">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-lg relative animate-fadeIn">
        <button
          onClick={() => setEditItem(null)}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-600 hover:text-red-500"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">

          {/* Inputs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Discount Price</label>
              <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className="input" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded p-2 resize-none" required />
          </div>

          {/* Sizes + Quantity */}
          <div>
            <p className="font-semibold mb-2">Sizes & Quantities</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allSizes.map((sizeLabel) => {
                const selected = sizes.find((s) => s.size === sizeLabel);
                return (
                  <div key={sizeLabel} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={() => handleSizeToggle(sizeLabel)}
                    />
                    <label>{sizeLabel}</label>
                    {selected && (
                      <input
                        type="number"
                        min={0}
                        value={selected.quantity}
                        onChange={(e) =>
                          handleQuantityChange(sizeLabel, e.target.value)
                        }
                        className="w-16 px-2 py-1 border rounded"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="font-semibold block mb-1">Upload Images</label>
            <div className="flex gap-4 flex-wrap">
              {[image1, image2, image3, image4].map((img, i) => (
                <label key={i} htmlFor={`image${i + 1}`} className="cursor-pointer">
                  <img
                    src={
                      img
                        ? URL.createObjectURL(img)
                        : editItem.image[i]
                        ? editItem.image[i]
                        : assets.upload_area
                    }
                    alt={`Image ${i + 1}`}
                    className="w-20 h-20 object-cover border rounded"
                  />
                  <input
                    hidden
                    type="file"
                    id={`image${i + 1}`}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (i === 0) setImage1(file);
                      else if (i === 1) setImage2(file);
                      else if (i === 2) setImage3(file);
                      else if (i === 3) setImage4(file);
                    }}
                  />
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition-all"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
