import React, { useState, useEffect, useCallback } from 'react';

interface Product {
    id: number;
    title: string;
    brand: string;
    category: string;
    price: number;
}

type SortKey = 'title' | 'brand' | 'category' | 'price';
interface SortConfig {
  key: SortKey;
}

function ProductTable () {

    const [products, setProducts] = useState<Product[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'price' });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  
    const fetchData = async () => {
        try {
          const response = await fetch('https://dummyjson.com/products');
          const data = await response.json();
          setProducts(data.products);
        } catch (error) {
          console.error('Error in fetching data:', error);
        }
    };
  
    useEffect(() => {
      fetchData();
    }, []);

    const sortData = useCallback((data: Product[]) => {
        const sortedData = [...data];
        return sortedData.sort((a, b) => (a[sortConfig.key] < b[sortConfig.key] ? -1 : 1));
    },[sortConfig]);

    const requestSort = (key: SortKey) => {
        setSortConfig({ key });
    };
  
    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
    };
  
    const handleRecordsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setRecordsPerPage(Number(event.target.value));
      setCurrentPage(1);
    };
  
    const sortedProducts = sortData(products);
    const totalPages = Math.ceil(sortedProducts.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = sortedProducts.slice(indexOfFirstRecord, indexOfLastRecord);
   
  
    return (
        <div className="container mx-auto p-4">
        <h1 className='text-center my-5 text-3xl'>Product Data Table</h1>
        <div className="mb-5 text-right">
          <label>
            Records per page:
            <select value={recordsPerPage} onChange={handleRecordsPerPageChange} className="ml-2 p-1 border rounded">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="cursor-pointer border border-gray-200 p-3 w-[350px]">Title <span className='text-xs float-right border border-blue-500 text-blue-500 rounded-3xl px-3 py-1' onClick={() => requestSort('title')} >&uarr;</span></th>
              <th className="cursor-pointer border border-gray-200 p-3 w-[250px]">Brand <span className='text-xs float-right border border-blue-500 text-blue-500 rounded-3xl px-3 py-1' onClick={() => requestSort('brand')} >&uarr;</span></th>
              <th className="cursor-pointer border border-gray-200 p-3 w-[200px]">Category <span className='text-xs float-right border border-blue-500 text-blue-500 rounded-3xl px-3 py-1' onClick={() => requestSort('category')} >&uarr;</span></th>
              <th className="cursor-pointer border border-gray-200 p-3 w-[200px]">Price <span className='text-xs float-right border border-blue-500 text-blue-500 rounded-3xl px-3 py-1' onClick={() => requestSort('price')} >&uarr;</span></th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-200 p-3 capitalize">{product.title}</td>
                <td className="border border-gray-200 p-3 capitalize">{product.brand}</td>
                <td className="border border-gray-200 p-3 capitalize">{product.category}</td>
                <td className="border border-gray-200 p-3">${product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-8 flex justify-center space-x-2">
          <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="p-2 border rounded disabled:opacity-50">
            First
          </button>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 border rounded disabled:opacity-50">
            Previous
          </button>
          <span className="p-2">
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border rounded disabled:opacity-50">
            Next
          </button>
          <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="p-2 border rounded disabled:opacity-50">
            Last
          </button>
        </div>
      </div>
    );
}

export default ProductTable