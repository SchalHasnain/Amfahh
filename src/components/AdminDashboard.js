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
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [systemEmails, setSystemEmails] = useState([]);
  const [newSystemEmail, setNewSystemEmail] = useState('');
  const [systemEmailError, setSystemEmailError] = useState('');
  const [smtpCredentials, setSmtpCredentials] = useState([]);
  const [smtpForm, setSmtpForm] = useState({ host: '', port: '', smtp_user: '', pass: '', from_email: '' });
  const [smtpError, setSmtpError] = useState('');
  const [footerDetails, setFooterDetails] = useState({ about_text: '', email: '', facebook: '', instagram: '', linkedin: '' });
  const [footerMsg, setFooterMsg] = useState('');
  const [footerLoading, setFooterLoading] = useState(false);

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

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories: ' + err.message);
    }
  };

  const fetchFeedback = async () => {
    setFeedbackLoading(true);
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      setFeedbackError('Failed to load feedback: ' + err.message);
    }
    setFeedbackLoading(false);
  };

  const fetchSystemEmails = async () => {
    try {
      const res = await fetch('/api/system-emails');
      const data = await res.json();
      setSystemEmails(data);
    } catch (err) {
      setSystemEmailError('Failed to load system emails.');
    }
  };

  const fetchSmtpCredentials = async () => {
    try {
      const res = await fetch('/api/smtp-credentials');
      const data = await res.json();
      setSmtpCredentials(data);
    } catch (err) {
      setSmtpError('Failed to load SMTP credentials.');
    }
  };

  const fetchFooterDetails = async () => {
    try {
      const res = await fetch('/api/footer-details');
      const data = await res.json();
      setFooterDetails({
        about_text: data.about_text || '',
        email: data.email || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        linkedin: data.linkedin || ''
      });
    } catch (err) {
      setFooterMsg('Failed to load footer details.');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchFeedback();
    fetchSystemEmails();
    fetchSmtpCredentials();
    fetchFooterDetails();
  }, []);

  // Stats
  const totalProducts = products.length;
  const totalCategories = new Set(products.map(p => (p.category || 'uncategorized').toLowerCase())).size;
  const totalImages = products.reduce((sum, p) => sum + (Array.isArray(p.images) ? p.images.length : 0), 0);
  const categoriesList = ['all', ...categories.map(c => c.name)].filter(Boolean);

  // Filter, search, sort
  let filtered = products;
  if (filterCategory !== 'all') filtered = filtered.filter(p => (p.category || 'uncategorized').toLowerCase() === filterCategory.toLowerCase());
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
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  // If currentPage is out of range, set to last page
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset currentPage to 1 when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, search]);

  // Helper for pagination truncation
  const getPaginationPages = () => {
    const pages = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 5) {
        for (let i = 1; i <= 7; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 4) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 6; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    // Remove duplicate pages and ellipsis
    const result = [];
    let last;
    for (const p of pages) {
      if (p !== last) result.push(p);
      last = p;
    }
    return result;
  };

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

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory })
      });
      if (!res.ok) throw new Error('Failed to add category');
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      setError('Failed to add category: ' + err.message);
    }
  };

  const handleRemoveCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      // You may want to implement a DELETE endpoint for categories
      // For now, just hide from UI (or implement soft delete)
      // setCategories(categories.filter(c => c.id !== id));
      setError('Category deletion not implemented.');
    } catch (err) {
      setError('Failed to remove category: ' + err.message);
    }
  };

  const startEditCategory = (cat) => {
    setEditingCategory(cat.id);
    setEditingCategoryName(cat.name);
  };

  const saveEditCategory = async (cat) => {
    try {
      const res = await fetch(`${API_BASE}/api/categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategoryName })
      });
      if (!res.ok) throw new Error('Failed to update category');
      setEditingCategory(null);
      setEditingCategoryName('');
      fetchCategories();
    } catch (err) {
      setError('Failed to update category: ' + err.message);
    }
  };

  const moveCategory = async (index, direction) => {
    const newOrder = [...categories];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    // Swap display_order
    const temp = newOrder[index].display_order;
    newOrder[index].display_order = newOrder[targetIdx].display_order;
    newOrder[targetIdx].display_order = temp;
    // Sort by display_order
    newOrder.sort((a, b) => a.display_order - b.display_order);
    setCategories([...newOrder]);
    // Send new order to backend
    try {
      await fetch(`${API_BASE}/api/categories/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder.map((cat, i) => ({ id: cat.id, display_order: i })) })
      });
      fetchCategories();
    } catch (err) {
      setError('Failed to reorder categories: ' + err.message);
    }
  };

  const handleToggleShowOnHome = async (id, show) => {
    try {
      await fetch(`/api/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ show_on_home: !show })
      });
      fetchFeedback();
    } catch (err) {
      setFeedbackError('Failed to update feedback.');
    }
  };

  const handleAddSystemEmail = async () => {
    if (!newSystemEmail) return;
    try {
      const res = await fetch('/api/system-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newSystemEmail })
      });
      if (!res.ok) throw new Error('Failed to add email');
      setNewSystemEmail('');
      fetchSystemEmails();
    } catch (err) {
      setSystemEmailError('Failed to add email.');
    }
  };

  const handleRemoveSystemEmail = async (id) => {
    try {
      await fetch(`/api/system-emails/${id}`, { method: 'DELETE' });
      fetchSystemEmails();
    } catch (err) {
      setSystemEmailError('Failed to remove email.');
    }
  };

  const handleSmtpFormChange = (e) => {
    setSmtpForm({ ...smtpForm, [e.target.name]: e.target.value });
  };

  const handleAddSmtpCredential = async () => {
    if (!smtpForm.host || !smtpForm.port || !smtpForm.smtp_user || !smtpForm.pass || !smtpForm.from_email) return;
    try {
      const res = await fetch('/api/smtp-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpForm)
      });
      if (!res.ok) throw new Error('Failed to add SMTP credential');
      setSmtpForm({ host: '', port: '', smtp_user: '', pass: '', from_email: '' });
      fetchSmtpCredentials();
    } catch (err) {
      setSmtpError('Failed to add SMTP credential.');
    }
  };

  const handleRemoveSmtpCredential = async (id) => {
    try {
      await fetch(`/api/smtp-credentials/${id}`, { method: 'DELETE' });
      fetchSmtpCredentials();
    } catch (err) {
      setSmtpError('Failed to remove SMTP credential.');
    }
  };

  const handleFooterChange = e => {
    setFooterDetails({ ...footerDetails, [e.target.name]: e.target.value });
  };

  const handleSaveFooter = async e => {
    e.preventDefault();
    setFooterLoading(true);
    setFooterMsg('');
    try {
      const res = await fetch('/api/footer-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footerDetails)
      });
      if (!res.ok) throw new Error('Failed to save');
      setFooterMsg('Footer details updated successfully!');
      fetchFooterDetails();
    } catch (err) {
      setFooterMsg('Failed to save footer details.');
    }
    setFooterLoading(false);
  };

  return (
    <div className="container py-4">
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
            {categoriesList.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>
      {/* Add a section for managing categories above the product table */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Manage Categories</h5>
          <div className="d-flex align-items-center mb-2">
            <input type="text" className="form-control me-2" placeholder="New category" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
            <button className="btn btn-success" onClick={handleAddCategory}>Add</button>
          </div>
          <ul className="list-group list-group-flush">
            {categories.map((cat, idx) => (
              <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {editingCategory === cat.id ? (
                    <>
                      <input
                        type="text"
                        className="form-control me-2"
                        value={editingCategoryName}
                        onChange={e => setEditingCategoryName(e.target.value)}
                        onBlur={() => saveEditCategory(cat)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEditCategory(cat); }}
                        autoFocus
                        style={{ width: 150 }}
                      />
                      <button className="btn btn-sm btn-primary me-2" onClick={() => saveEditCategory(cat)}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditingCategory(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span>{cat.name}</span>
                      <button className="btn btn-sm btn-link ms-2" onClick={() => startEditCategory(cat)}>Edit</button>
                    </>
                  )}
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-secondary me-1" disabled={idx === 0} onClick={() => moveCategory(idx, 'up')}>↑</button>
                  <button className="btn btn-sm btn-outline-secondary me-1" disabled={idx === categories.length - 1} onClick={() => moveCategory(idx, 'down')}>↓</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleRemoveCategory(cat.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Product Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle border rounded shadow-sm">
          <thead className="table-light">
            <tr>
              <th style={{cursor: 'pointer'}} onClick={() => { setSortBy('name'); setSortDir(sortBy === 'name' && sortDir === 'asc' ? 'desc' : 'asc'); }}>
                Name {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{cursor: 'pointer'}} onClick={() => { setSortBy('category'); setSortDir(sortBy === 'category' && sortDir === 'asc' ? 'desc' : 'asc'); }}>
                Category {sortBy === 'category' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{cursor: 'pointer'}} onClick={() => { setSortBy('description'); setSortDir(sortBy === 'description' && sortDir === 'asc' ? 'desc' : 'asc'); }}>
                Description {sortBy === 'description' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
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
          <nav className="d-flex justify-content-center my-3" style={{overflowX: 'auto'}}>
            <ul className="pagination flex-nowrap">
              <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
              </li>
              {getPaginationPages().map((page, idx) =>
                page === '...'
                  ? <li key={`ellipsis-${idx}`} className="page-item disabled"><span className="page-link">...</span></li>
                  : <li key={`page-${page}-${idx}`} className={`page-item${currentPage === page ? ' active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                    </li>
              )}
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
        categories={categories.map(c => c.name)}
      />
      {addModal && (
        <EditProductModal
          show={addModal}
          onHide={() => setAddModal(false)}
          product={{ name: '', description: '', price: '', category: '', images: [] }}
          onSave={handleAddProduct}
          categories={categories.map(c => c.name)}
        />
      )}
      {/* Feedback Management Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">User Feedback</h5>
          {feedbackLoading ? (
            <div>Loading feedback...</div>
          ) : feedbackError ? (
            <div className="alert alert-danger">{feedbackError}</div>
          ) : feedback.length === 0 ? (
            <div>No feedback yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Comment</th>
                    <th>Rating</th>
                    <th>Date</th>
                    <th>Show on Home</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.map(fb => (
                    <tr key={fb.id}>
                      <td>{fb.name}</td>
                      <td>{fb.comment}</td>
                      <td>{[...Array(5)].map((_, i) => <i key={i} className={`fa fa-star${i < fb.rating ? '' : '-o'} text-warning`}></i>)}</td>
                      <td>{new Date(fb.created_at).toLocaleString()}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={!!fb.show_on_home}
                          onChange={() => handleToggleShowOnHome(fb.id, fb.show_on_home)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* System Emails Management Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Order/Contact Notification Emails</h5>
          <div className="d-flex align-items-center mb-2">
            <input type="email" className="form-control me-2" placeholder="Add email" value={newSystemEmail} onChange={e => setNewSystemEmail(e.target.value)} />
            <button className="btn btn-success" onClick={handleAddSystemEmail}>Add</button>
          </div>
          {systemEmailError && <div className="alert alert-danger py-2">{systemEmailError}</div>}
          <ul className="list-group list-group-flush">
            {systemEmails.map(email => (
              <li key={email.id} className="list-group-item d-flex justify-content-between align-items-center">
                {email.email}
                <button className="btn btn-sm btn-danger" onClick={() => handleRemoveSystemEmail(email.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* SMTP Credentials Management Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">SMTP Credentials</h5>
          <div className="row g-2 mb-2">
            <div className="col-md-2">
              <input type="text" className="form-control" name="host" placeholder="Host" value={smtpForm.host} onChange={handleSmtpFormChange} />
            </div>
            <div className="col-md-1">
              <input type="number" className="form-control" name="port" placeholder="Port" value={smtpForm.port} onChange={handleSmtpFormChange} />
            </div>
            <div className="col-md-2">
              <input type="text" className="form-control" name="smtp_user" placeholder="SMTP User" value={smtpForm.smtp_user} onChange={handleSmtpFormChange} />
            </div>
            <div className="col-md-2">
              <input type="password" className="form-control" name="pass" placeholder="Password" value={smtpForm.pass} onChange={handleSmtpFormChange} />
            </div>
            <div className="col-md-3">
              <input type="email" className="form-control" name="from_email" placeholder="From Email" value={smtpForm.from_email} onChange={handleSmtpFormChange} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success w-100" onClick={handleAddSmtpCredential}>Add</button>
            </div>
          </div>
          {smtpError && <div className="alert alert-danger py-2">{smtpError}</div>}
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Host</th>
                  <th>Port</th>
                  <th>SMTP User</th>
                  <th>From Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {smtpCredentials.map(cred => (
                  <tr key={cred.id}>
                    <td>{cred.host}</td>
                    <td>{cred.port}</td>
                    <td>{cred.smtp_user}</td>
                    <td>{cred.from_email}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleRemoveSmtpCredential(cred.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Footer Details Section */}
      <div className="card my-5">
        <div className="card-header bg-primary text-white fw-bold">Footer Details</div>
        <div className="card-body">
          <form onSubmit={handleSaveFooter}>
            <div className="mb-3">
              <label className="form-label fw-bold">About Text</label>
              <textarea className="form-control" name="about_text" value={footerDetails.about_text} onChange={handleFooterChange} rows={2} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Contact Email</label>
              <input className="form-control" name="email" value={footerDetails.email} onChange={handleFooterChange} type="email" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Facebook Link</label>
              <input className="form-control" name="facebook" value={footerDetails.facebook} onChange={handleFooterChange} type="url" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Instagram Link</label>
              <input className="form-control" name="instagram" value={footerDetails.instagram} onChange={handleFooterChange} type="url" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">LinkedIn Link</label>
              <input className="form-control" name="linkedin" value={footerDetails.linkedin} onChange={handleFooterChange} type="url" />
            </div>
            {footerMsg && <div className={`alert ${footerMsg.includes('success') ? 'alert-success' : 'alert-danger'} py-2`}>{footerMsg}</div>}
            <button className="btn btn-primary fw-bold" type="submit" disabled={footerLoading}>{footerLoading ? 'Saving...' : 'Save Footer Details'}</button>
          </form>
        </div>
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default AdminDashboard; 