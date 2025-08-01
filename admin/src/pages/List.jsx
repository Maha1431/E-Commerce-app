import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import EditProductForm from '../components/EditProductForm';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="px-4">
      <p className="mb-4 text-xl font-semibold">All Products List</p>

      {/* Header */}
      <div className="hidden md:grid grid-cols-7 gap-4 items-center py-2 px-4 border bg-gray-100 text-sm font-medium">
        <span>Image</span>
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span>Sizes</span>
        <span>Qty</span>
        <span className="text-center">Action</span>
      </div>

      {/* Product Rows */}
      {list.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4 items-center py-3 px-4 border text-sm"
        >
          <img className="w-14 h-14 object-cover" src={item.image[0]} alt={item.name} />
          <p className="truncate">{item.name}</p>
          <p className="hidden sm:block truncate">{item.category}</p>
          <p className="hidden md:block">{currency}{item.price}</p>
          <p className="hidden md:block">{item.sizes?.join(', ') || '-'}</p>
          <p className="hidden md:block">{item.quantity}</p>

          <div className="flex gap-3 sm:col-span-1 justify-end md:justify-center">
            <button
              onClick={() => setEditItem(item)}
              className="text-blue-500 cursor-pointer"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => removeProduct(item._id)}
              className="text-gray-300 cursor-pointer text-lg"
              title="Delete"
            >
              ❌
            </button>
          </div>
        </div>
      ))}

      {/* Edit Form Modal */}
      {editItem && (
        <EditProductForm
          editItem={editItem}
          setEditItem={setEditItem}
          token={token}
          onSuccess={fetchList}
        />
      )}
    </div>
  );
};

export default List;
