import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false); 

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="relative">
      {/* Background Overlay */}
      {visible && (
        <div
          className="fixed inset-0 z-[998] bg-black opacity-40"
          onClick={() => setVisible(false)}
        />
      )}

      <div className={`bg-blue-900 text-white py-5 font-medium ${visible ? 'hidden sm:block' : ''}`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 flex items-center justify-between rounded">
          <Link to="/">
            <img src={assets.logo} className="w-36 bg-purple-50" alt="Logo" />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden  sm:flex gap-5 text-sm text-white-700 relative">
            {/* HOME */}
            <div className="group relative">
              <NavLink to="/" className="flex flex-col items-center gap-1 hover:text-black">
                <p>HOME</p>
                <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 group-hover:block hidden" />
              </NavLink>
            </div>

            {/* COLLECTION */}
            <div className="group relative">
              <NavLink to="/collection" className="flex flex-col items-center gap-1 hover:text-black">
                <p>COLLECTION</p>
                <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 group-hover:block hidden" />
              </NavLink>
              <div className="absolute left-0 top-full z-10 hidden group-hover:flex flex-col bg-white rounded shadow-lg py-2 w-40 text-gray-600">
                <Link to="/collection"  state={{ category: "Men" }} className="px-4 py-2 hover:bg-gray-100">Men</Link>
                <Link to="/collection"  state={{ category: "Women" }} className="px-4 py-2 hover:bg-gray-100">Women</Link>
                <Link to="/collection" state={{category: "Kids"}} className="px-4 py-2 hover:bg-gray-100">Kids</Link>
              </div>
            </div>

            {/* ABOUT */}
            <div className="group relative">
              <NavLink to="/about" className="flex flex-col items-center gap-1 hover:text-black">
                <p>ABOUT</p>
                <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 group-hover:block hidden" />
              </NavLink>
              <div className="absolute left-0 top-full z-10 hidden group-hover:flex flex-col bg-white rounded shadow-lg py-2 w-40 text-gray-600">
                <Link to="/about#mission" className="px-4 py-2 hover:bg-gray-100">Our Mission</Link>
                <Link to="/about#team" className="px-4 py-2 hover:bg-gray-100">Team</Link>
              </div>
            </div>

            {/* CONTACT */}
            <div className="group relative">
              <NavLink to="/contact" className="flex flex-col items-center gap-1 hover:text-black">
                <p>CONTACT</p>
                <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 group-hover:block hidden" />
              </NavLink>
              <div className="absolute left-0 top-full z-10 hidden group-hover:flex flex-col bg-white rounded shadow-lg py-2 w-40 text-gray-600">
                <Link to="/contact#support" className="px-4 py-2 hover:bg-gray-100">Support</Link>
                <Link to="/contact#faq" className="px-4 py-2 hover:bg-gray-100">FAQ</Link>
              </div>
            </div>
          </ul>

          {/* Right Section */}
          <div className="flex items-center gap-6  rounded">
            {/* Search */}
            <img
              onClick={() => {
                setShowSearch(true);
                navigate("/collection");
              }}
              src={assets.search_icon}
              className="w-5 cursor-pointer"
              alt="Search"
            />

            {/* Profile */}
            <div className="group relative">
              <img
                onClick={() => (token ? null : navigate("/login"))}
                className="w-5 cursor-pointer"
                src={assets.profile_icon}
                alt="Profile"
              />
             {token && (
  <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50">
    <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-md">
      <p className="cursor-pointer hover:text-black">My Profile</p>
      <p onClick={() => navigate("/orders")} className="cursor-pointer hover:text-black">Orders</p>
      <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
    </div>
  </div>
)}

            </div>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
              <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                {getCartCount()}
              </p>
            </Link>

          {/* Mobile Menu Icon - visible only on small screens */}
<img
  onClick={() => setVisible(true)}
  src={assets.menu_icon}
  className="w-5 cursor-pointer sm:hidden"
  alt="Menu"
/>

          </div>
        </div>
      </div>

     {/* Sidebar Menu for Mobile */}
{visible && (
  <div className="fixed top-0 right-0 bottom-0 z-[999] w-3/4 bg-white shadow-lg sm:hidden transition-transform duration-300 ease-in-out">
    <div className="flex flex-col text-gray-600 h-full">
      {/* Close / Back */}
      <div
        onClick={() => setVisible(false)}
        className="flex items-center gap-4 p-4 cursor-pointer border-b"
      >
        <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="Back" />
        <p>Back</p>
      </div>

      {/* Menu Items */}
      <button onClick={() => { setVisible(false); navigate("/"); }} className="py-3 pl-6 text-left border-b">HOME</button>
      <button onClick={() => { setVisible(false); navigate("/collection"); }} className="py-3 pl-6 text-left border-b">COLLECTION</button>
      <button onClick={() => { setVisible(false); navigate("/about"); }} className="py-3 pl-6 text-left border-b">ABOUT</button>
      <button onClick={() => { setVisible(false); navigate("/contact"); }} className="py-3 pl-6 text-left border-b">CONTACT</button>
    </div>
  </div>
)}

    </div>
  );
};

export default Navbar;
