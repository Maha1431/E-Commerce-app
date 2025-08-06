import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [discountPrice, setDiscountPrice] = useState("");
  const [bestseller, setBestseller] = useState(false);

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [stockPerSize, setStockPerSize] = useState({});

  const toggleSize = (size) => {
    setSelectedSizes((prev) => {
      const updated = prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size];
      return updated;
    });

    setStockPerSize((prev) => {
      const updated = { ...prev };
      if (size in updated) {
        delete updated[size];
      } else {
        updated[size] = 0;
      }
      return updated;
    });
  };

  const updateSizeQuantity = (size, value) => {
    setStockPerSize((prev) => ({
      ...prev,
      [size]: Number(value),
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("discountPrice", discountPrice);
      const sizesArray = Object.entries(stockPerSize).map(
        ([size, quantity]) => ({
          size,
          quantity,
        })
      );

      formData.append("sizes", JSON.stringify(sizesArray));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setDiscountPrice("");
        setSelectedSizes([]);
        setStockPerSize({});
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      {/* Images */}
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[image1, image2, image3, image4].map((img, i) => (
            <label key={i} htmlFor={`image${i + 1}`}>
              <img
                className="w-20"
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt=""
              />
              <input
                type="file"
                hidden
                id={`image${i + 1}`}
                onChange={(e) => {
                  const setter = [setImage1, setImage2, setImage3, setImage4][
                    i
                  ];
                  setter(e.target.files[0]);
                }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Basic Info */}
      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
            <option value="Ethnicwear">Ethnicwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="25"
          />
        </div>

        <div>
          <p className="mb-2">Discount Price</p>
          <input
            onChange={(e) => setDiscountPrice(e.target.value)}
            value={discountPrice}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="20"
          />
        </div>
      </div>

      {/* Sizes + Quantity per size */}
      <div className="w-full">
        <p className="mb-2 font-semibold">Product Sizes</p>

        {/* Adult Sizes */}
        <p className="text-sm font-medium mt-2 mb-1">Adult Sizes</p>
        <div className="flex gap-3 flex-wrap mb-2">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div key={size} onClick={() => toggleSize(size)}>
              <p
                className={`px-3 py-1 rounded cursor-pointer border ${
                  selectedSizes.includes(size)
                    ? "bg-pink-200 border-pink-400"
                    : "bg-slate-200"
                }`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>

        {/* Kids Sizes */}
        <p className="text-sm font-medium mt-2 mb-1">Kids Sizes</p>
        <div className="flex gap-3 flex-wrap mb-2">
          {[
            "0-3M",
            "3-6M",
            "6-9M",
            "9-12M",
            "1-2Y",
            "2-3Y",
            "3-4Y",
            "4-5Y",
            "5-6Y",
          ].map((size) => (
            <div key={size} onClick={() => toggleSize(size)}>
              <p
                className={`px-3 py-1 rounded cursor-pointer border ${
                  selectedSizes.includes(size)
                    ? "bg-pink-200 border-pink-400"
                    : "bg-slate-200"
                }`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>

        {/* Quantity Inputs per selected size */}
        {selectedSizes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
            {selectedSizes.map((size) => (
              <div key={size}>
                <p className="text-sm font-medium mb-1">Quantity for {size}</p>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border rounded"
                  value={stockPerSize[size] || ""}
                  onChange={(e) => updateSizeQuantity(size, e.target.value)}
                  placeholder="e.g., 10"
                  required
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
