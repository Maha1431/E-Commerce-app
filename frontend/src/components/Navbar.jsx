import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FaHeart } from "react-icons/fa";

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
      {/* Overlay for mobile */}
      {visible && (
        <div
          className="fixed inset-0 z-[998] bg-black opacity-40 sm:hidden"
          onClick={() => setVisible(false)}
        />
      )}

      <div className="bg-slate-300 text-black py-5 font-medium">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 flex items-center justify-between rounded">
          {/* Logo */}
          <Link to="/">
            <img src={assets.logo} className="w-28 sm:w-36" alt="Logo" />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden sm:flex gap-5 text-sm text-white-700 relative">
            {[
              { to: "/", label: "HOME" },
              { to: "/collection", label: "COLLECTION" },
              { to: "/about", label: "ABOUT" },
              { to: "/contact", label: "CONTACT" },
            ].map((item, idx) => (
              <div key={idx} className="group relative">
                <NavLink
                  to={item.to}
                  className="flex flex-col items-center gap-1 hover:text-black"
                >
                  <p>{item.label}</p>
                  <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 group-hover:block hidden" />
                </NavLink>
              </div>
            ))}
          </ul>

          {/* Right Section */}
          <div className="flex items-center gap-4 sm:gap-6 p-3 rounded">
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

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="flex items-center gap-1 text-gray-700 hover:text-red-500"
            >
              <FaHeart className="text-lg" />
              <span className="hidden md:inline">Wishlist</span>
            </Link>

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
                    <p
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer hover:text-black"
                    >
                      My Profile
                    </p>
                    <p
                      onClick={() => navigate("/orders")}
                      className="cursor-pointer hover:text-black"
                    >
                      Orders
                    </p>
                    <p
                      onClick={logout}
                      className="cursor-pointer hover:text-black"
                    >
                      Logout
                    </p>
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

            {/* Mobile Menu Icon */}
            <img
              onClick={() => setVisible(true)}
              src={assets.menu_icon}
              className="w-5 cursor-pointer sm:hidden"
              alt="Menu"
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar with Slide-in Effect */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[999] w-3/4 bg-white shadow-lg sm:hidden transform transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col text-gray-600 h-full">
          {/* Close */}
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer border-b"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="Back"
            />
            <p>Back</p>
          </div>

          {/* Menu Items */}
          {[
            { label: "HOME", path: "/" },
            { label: "COLLECTION", path: "/collection" },
            { label: "ABOUT", path: "/about" },
            { label: "CONTACT", path: "/contact" },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setVisible(false);
                navigate(item.path);
              }}
              className="py-3 pl-6 text-left border-b hover:bg-gray-100"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
