// ...imports...
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ useParams must be imported here
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const navigate = useNavigate();

  const imageRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [bgPos, setBgPos] = useState("center");

  const KIDS_SIZES = [
    "0-3M",
    "0-6M",
    "0-9M",
    "0-12M",
    "1-2Y",
    "2-3Y",
    "3-4Y",
    "4-5Y",
    "5-6Y",
    "S",
  ];
  const ADULT_SIZES = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const found = products.find((item) => item._id === productId);
    if (found) {
      setProductData(found);
      setImage(found.image[0]);
    }
  }, [productId, products]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBgPos(`${x}% ${y}%`);
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

 const isOutOfStock = !productData?.sizes || productData.sizes.every((s) => s.quantity === 0);


  const renderSizeButtons = (sizesArray, label) => {
    if (!productData?.sizes || productData.sizes.length === 0) return null;

    return (
      <div className="my-4">
        <p className="font-semibold text-sm mb-1">{label}</p>
        <div className="flex gap-2 flex-wrap">
    {sizesArray.map((s, index) => {
  const sizeObj = productData.sizes.find((item) => item.size === s);
  const isAvailable = sizeObj && sizeObj.quantity > 0;
  const isSelected = s === size;

  return (
    <div key={index} title={!isAvailable ? "Out of stock" : ""}>
      <button
        disabled={!isAvailable}
        onClick={() => isAvailable && setSize(s)}
        className={`py-2 px-4 rounded border text-sm transition
          ${isSelected ? "border-orange-500" : "border-gray-300"}
          ${
            !isAvailable
              ? "text-gray-400 line-through cursor-not-allowed bg-gray-100"
              : "bg-white hover:border-black"
          }
        `}
      >
        {s}
      </button>
    </div>
  );
})}
</div>
</div>
    )};

  console.log("Product Data:", productData);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Section */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Thumbnail Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>

          {/* Main Image with Zoom */}
          <div className="w-full sm:w-[80%] h-[500px] relative">
            <div
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="w-full h-full bg-no-repeat bg-center bg-cover transition-all duration-300 ease-in-out"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: isHovering ? "200%" : "100%",
                backgroundPosition: isHovering ? bgPos : "center",
              }}
            />
            {isOutOfStock && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded">
                Sold Out
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <img key={i} src={assets.star_icon} alt="" className="w-3.5" />
            ))}
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>
          <div className="mt-5 flex items-center gap-4">
            {/* Show discounted pricing if discountPrice is valid and less than price */}
            {productData.discountPrice &&
            productData.discountPrice < productData.price ? (
              <>
                <p className="text-3xl font-semibold text-red-600">
                  {currency}
                  {productData.discountPrice}
                </p>
                <p className="text-lg text-gray-500 line-through">
                  {currency}
                  {productData.price}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  (
                  {Math.round(
                    100 - (productData.discountPrice / productData.price) * 100
                  )}
                  % OFF)
                </p>
              </>
            ) : (
              <p className="text-3xl font-semibold text-red-600">
                {currency}
                {productData.price}
              </p>
            )}
          </div>

          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          {/* Size Select Section */}
          {/* Size Select Section */}
          {!isOutOfStock ? (
            <div className="my-6">
              {productData.category?.toLowerCase() === "kids"
                ? renderSizeButtons(KIDS_SIZES, "Available Kids Sizes")
                : renderSizeButtons(ADULT_SIZES, "Available Adult Sizes")}
            </div>
          ) : (
            <div className="text-red-500 font-semibold mt-6">
              This product is currently sold out.
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={() => {
                if (!size) return toast.error("Please select a size first!");
                addToCart(productData._id, size);
                toast.success("Product added to cart successfully!");
              }}
              disabled={isOutOfStock}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-800 disabled:opacity-50"
            >
              ADD TO CART
            </button>

            <button
              onClick={() => {
                if (!size) return toast.error("Please select a size first!");
                addToCart(productData._id, size);
                navigate("/place-order");
              }}
              disabled={isOutOfStock}
              className="bg-orange-600 text-white px-8 py-3 text-sm active:bg-orange-700 disabled:opacity-50"
            >
              BUY NOW
            </button>
          </div>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      {/* Description & Reviews */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
      </div>
      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
        currentProductId={productData._id}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
