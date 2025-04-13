import React, { useState } from 'react';

function BarChart() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Apple MacBook Pro 17"',
      color: 'Sliver',
      category: 'Laptop',
      price: '$2999'
    },
    {
      id: 2,
      name: 'Microsoft Surface Pro',
      color: 'White',
      category: 'Laptop PC',
      price: '$1999'
    },
    {
      id: 3,
      name: 'Magic Mouse 2',
      color: 'Black',
      category: 'Accessories',
      price: '$99'
    }
  ];

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    const searchString = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchString) ||
      product.color.toLowerCase().includes(searchString) ||
      product.category.toLowerCase().includes(searchString) ||
      product.price.toLowerCase().includes(searchString)
    );
  });

  return (
    <div className="max-w-screen">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="p-4 bg-white border-b-[1px] border-gray-200">
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"></path>
              </svg>
            </div>
            <input 
              type="text" 
              id="table-search" 
              className="bg-[#F8F8FF] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5 " 
              placeholder="Search for items"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-white">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-base font-semibold">
                Product name
              </th>
              <th scope="col" className="px-6 py-3 text-base font-semibold">
                Color
              </th>
              <th scope="col" className="px-6 py-3 text-base font-semibold">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-base font-semibold">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-base font-semibold">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product.id} className="bg-white hover:bg-gray-50 ">
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input id={`checkbox-table-search-${product.id}`} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 " />
                      <label htmlFor={`checkbox-table-search-${product.id}`} className="sr-only">checkbox</label>
                    </div>
                  </td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </th>
                  <td className="px-6 py-4 text-gray-900">
                    {product.color}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {product.price}
                  </td>
                  <td className="px-6 py-4">
                    <a href="#" className="font-medium text-blue-600  hover:underline">Edit</a>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white ">
                <td colSpan="6" className="px-6 py-4 text-center">
                  No products found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BarChart;