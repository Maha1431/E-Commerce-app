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
  const [quantity, setQuantity] = useState(editItem.quantity || 0);

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('id', editItem._id);
    form.append('name', name);
    form.append('description', description);
    form.append('price', price);
    form.append('discountPrice', discountPrice);
    form.append('quantity', quantity);
    form.append('sizes', JSON.stringify(sizes));
    // ✅ Send old images to backend
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

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  const adultSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const kidsSizes = ['0-3M', '3-6M', '6-9M', '9-12M', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y'];

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
              <label htmlFor="name" className="block text-sm font-medium mb-1">Product Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" required />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">Price</label>
              <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input" required />
            </div>

            <div>
              <label htmlFor="discountPrice" className="block text-sm font-medium mb-1">Discount Price</label>
              <input id="discountPrice" type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className="input" />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium mb-1">Quantity</label>
              <input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input" />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 resize-none"
              required
            />
          </div>

          {/* Sizes */}
          <div>
            <p className="font-semibold mb-1">Select Sizes</p>

            <p className="text-sm font-medium mt-2">Adult Sizes</p>
            <div className="flex gap-3 flex-wrap mb-2">
              {adultSizes.map((size) => (
                <div key={size} onClick={() => toggleSize(size)}>
                  <p
                    className={`px-3 py-1 rounded cursor-pointer border ${
                      sizes.includes(size) ? 'bg-pink-200 border-pink-400' : 'bg-slate-200'
                    }`}
                  >
                    {size}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm font-medium mt-2">Kids Sizes</p>
            <div className="flex gap-3 flex-wrap">
              {kidsSizes.map((size) => (
                <div key={size} onClick={() => toggleSize(size)}>
                  <p
                    className={`px-3 py-1 rounded cursor-pointer border ${
                      sizes.includes(size) ? 'bg-pink-200 border-pink-400' : 'bg-slate-200'
                    }`}
                  >
                    {size}
                  </p>
                </div>
              ))}
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
