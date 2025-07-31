import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useLocation } from "react-router-dom";

const Collection = () => {
  const location = useLocation();
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');

  const toggleCategory = (e) => {
    const { value } = e.target;
    setCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const { value } = e.target;
    setSubCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  useEffect(() => {
    if (location.state?.category) {
      setCategory([location.state.category]);
    }
  }, [location.state]);

  const applyFilter = () => {
    let productsCopy = [...products];

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let sorted = [...filterProducts];

    switch (sortType) {
      case 'low-high':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        applyFilter();
        return;
    }

    setFilterProducts(sorted);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 pt-10 border-t px-4">

      {/* Sidebar Toggle on small screens */}
      <div className="sm:hidden flex justify-between items-center mb-4">
        <p className="text-xl font-semibold">FILTERS</p>
        <button
          className="flex items-center gap-1 border px-3 py-1 rounded text-sm"
          onClick={() => setShowFilter(!showFilter)}
        >
          Toggle Filters
          <img className={`h-3 transition-transform ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} />
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`w-full sm:w-60 ${showFilter ? 'block' : 'hidden'} sm:block`}>
        {/* Category Filter */}
        <div className="border border-gray-300 p-4 mb-4">
          <p className="mb-2 text-sm font-semibold">CATEGORIES</p>
          {['Men', 'Women', 'Kids'].map(cat => (
            <label key={cat} className="block text-sm text-gray-700">
              <input
                type="checkbox"
                value={cat}
                onChange={toggleCategory}
                checked={category.includes(cat)}
                className="mr-2"
              />
              {cat}
            </label>
          ))}
        </div>

        {/* SubCategory Filter */}
        <div className="border border-gray-300 p-4">
          <p className="mb-2 text-sm font-semibold">TYPE</p>
          {['Topwear', 'Bottomwear', 'Winterwear', 'Ethnicwear'].map(sub => (
            <label key={sub} className="block text-sm text-gray-700">
              <input
                type="checkbox"
                value={sub}
                onChange={toggleSubCategory}
                checked={subCategory.includes(sub)}
                className="mr-2"
              />
              {sub}
            </label>
          ))}
        </div>
      </div>

      {/* Right Side Product Display */}
      <div className="flex-1">
        {/* Heading and Sort */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select
            className="border px-3 py-1 text-sm"
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
          >
            <option value="relavent">Sort by: Relevance</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
