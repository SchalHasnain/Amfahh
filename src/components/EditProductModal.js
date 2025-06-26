import React, { useState } from 'react';

const EditProductModal = ({ show, onHide, product, onSave }) => {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || '');
  const [category, setCategory] = useState(product?.category || 'surgical');
  const [images, setImages] = useState(product?.images || []);
  const [newImages, setNewImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);

  React.useEffect(() => {
    setName(product?.name || '');
    setDescription(product?.description || '');
    setPrice(product?.price || '');
    setCategory(product?.category || 'surgical');
    setImages(product?.images || []);
    setNewImages([]);
    setRemoveImages([]);
  }, [product, show]);

  const handleRemoveImage = (img) => {
    setRemoveImages([...removeImages, img]);
    setImages(images.filter(i => i !== img));
  };

  const handleAddNewImages = (e) => {
    setNewImages([...newImages, ...e.target.files]);
  };

  const handleSave = () => {
    onSave({
      id: product.id,
      name,
      description,
      price,
      category,
      removeImages,
      newImages
    });
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product?.id ? 'Edit Product' : 'Add Product'}</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="surgical">Surgical</option>
                <option value="special">Special</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Price</label>
              <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Current Images</label>
              <div className="d-flex flex-wrap gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="position-relative">
                    <img src={img} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }} />
                    <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0" style={{ borderRadius: '50%' }} onClick={() => handleRemoveImage(img)}>&times;</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Add New Images</label>
              <input type="file" className="form-control" multiple accept="image/*" onChange={handleAddNewImages} />
              <div className="d-flex flex-wrap gap-2 mt-2">
                {Array.from(newImages).map((file, idx) => (
                  <img key={idx} src={URL.createObjectURL(file)} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }} />
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal; 