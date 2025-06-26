import React, { useEffect, useState } from 'react';
import EditProductModal from './EditProductModal';

const API_BASE = '';

function getImageUrl(img) {
  return img && img.startsWith('/images/') ? API_BASE + img : img;
}

function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [addModal, setAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Stats
  const totalProducts = products.length;
  const totalCategories = new Set(products.map(p => p.category || 'uncategorized')).size;
  const totalImages = products.reduce((sum, p) => sum + (Array.isArray(p.images) ? p.images.length : 0), 0);
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category || 'uncategorized')))].filter(Boolean);

  // Filter, search, sort
  let filtered = products;
  if (filterCategory !== 'all') filtered = filtered.filter(p => (p.category || 'uncategorized') === filterCategory);
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
  filtered = filtered.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAddProduct = async (update) => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', update.name);
      formData.append('description', update.description);
      formData.append('price', update.price);
      formData.append('category', update.category);
      for (let i = 0; i < update.newImages.length; i++) {
        formData.append('images', update.newImages[i]);
      }
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to add product');
      await fetchProducts();
      setAddModal(false);
    } catch (err) {
      setError('Failed to add product: ' + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete product');
      await fetchProducts();
    } catch (err) {
      setError('Failed to delete product: ' + err.message);
    }
    setLoading(false);
  };

  const handleEditProduct = async (update) => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', update.name);
      formData.append('description', update.description);
      formData.append('price', update.price);
      formData.append('category', update.category);
      formData.append('removeImages', JSON.stringify(update.removeImages));
      for (let i = 0; i < update.newImages.length; i++) {
        formData.append('images', update.newImages[i]);
      }
      const res = await fetch(`${API_BASE}/api/products/${update.id}`, {
        method: 'PUT',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to update product');
      await fetchProducts();
      setShowEditModal(false);
      setEditProduct(null);
    } catch (err) {
      setError('Failed to update product: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin Dashboard</h2>
        <div>
          <button className="btn btn-primary me-2" onClick={() => setAddModal(true)}>Add Product</button>
          <button className="btn btn-secondary" onClick={onLogout}>Logout</button>
        </div>
      </div>
      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Products</h5>
              <h2>{totalProducts}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Categories</h5>
              <h2>{totalCategories}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Images</h5>
              <h2>{totalImages}</h2>
            </div>
          </div>
        </div>
      </div>
      {/* Search, Filter, Sort */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input type="text" className="form-control" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="col-md-4 mb-2">
          <select className="form-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
          </select>
          <button className="btn btn-link" onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>{sortDir === 'asc' ? '↑' : '↓'}</button>
        </div>
      </div>
      {/* Product Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle border rounded shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Price</th>
              <th>Images</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(product => (
              <tr key={product.id}>
                <td className="fw-semibold">{product.name}</td>
                <td>{product.category || 'uncategorized'}</td>
                <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.description}</td>
                <td>${product.price}</td>
                <td>
                  {Array.isArray(product.images)
                    ? product.images.map((img, idx) => (
                        <img key={idx} src={getImageUrl(img)} alt="" style={{ width: 60, marginRight: 4, borderRadius: 6, border: '1px solid #eee' }} />
                      ))
                    : product.image && <img src={getImageUrl(product.image)} alt="" style={{ width: 60, borderRadius: 6, border: '1px solid #eee' }} />}
                </td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => { setEditProduct(product); setShowEditModal(true); }}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center my-3">
            <ul className="pagination">
              <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item${currentPage === i + 1 ? ' active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
              </li>
            </ul>
            <span className="ms-3 align-self-center text-muted">Page {currentPage} of {totalPages}</span>
          </nav>
        )}
      </div>
      <EditProductModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        product={editProduct}
        onSave={handleEditProduct}
      />
      <EditProductModal
        show={addModal}
        onHide={() => setAddModal(false)}
        product={{ name: '', description: '', price: '', category: '', images: [] }}
        onSave={handleAddProduct}
      />
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default AdminDashboard; 