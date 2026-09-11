import React, { useState } from 'react';
import { X, UploadCloud, Loader2 } from 'lucide-react';
import { API_URL } from '../data/service';
import '../styles/Courses.css';

const emptyForm = {
  title: '',
  category: '',
  duration: '',
  fee: '',
  description: '',
  image: '',
};

export default function CourseModal({ course, saving, onClose, onSave }) {
  const [formData, setFormData] = useState(
    course
      ? {
          title: course.title || '',
          category: course.category || '',
          duration: course.duration || '',
          fee: course.fee || '',
          description: course.description || '',
          image: course.image || '',
        }
      : emptyForm
  );

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(course?.image || '');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  // Upload to your secure backend endpoint
  const uploadToBackend = async (file) => {
    const token = localStorage.getItem('token');
    const uploadData = new FormData();
    uploadData.append('image', file);

 const res = await fetch(`${API_URL}/api/courses/upload-image`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: uploadData,
});

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Image upload failed');
    }

    return data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = formData.image;

    if (imageFile) {
      try {
        setUploadingImage(true);
        finalImageUrl = await uploadToBackend(imageFile);
      } catch (err) {
        console.error('Upload Error:', err);
        alert('Image upload failed: ' + err.message);
        setUploadingImage(false);
        return;
      } finally {
        setUploadingImage(false);
      }
    }

    onSave({
      ...formData,
      image: finalImageUrl,
    });
  };

  const isBusy = saving || uploadingImage;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{course ? 'Edit Course' : 'Add Course'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} disabled={isBusy}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-field">
            <label>Course Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Category</label>
              <input
                type="text"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                required
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Fee (₹)</label>
              <input
                type="number"
                name="fee"
                required
                min="0"
                value={formData.fee}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Cloudinary Image Selector */}
          <div className="form-field">
            <label>Course Image</label>
            <div className="image-upload-wrapper">
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Course Preview" className="uploaded-thumbnail" />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={handleRemoveImage}
                    title="Remove image"
                    disabled={isBusy}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="file-upload-dropzone">
                  <UploadCloud size={24} className="upload-icon" />
                  <span>Click to select an image (JPG, PNG, WEBP)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    disabled={isBusy}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isBusy}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isBusy}>
              {uploadingImage ? (
                <>
                  <Loader2 size={15} className="spin-icon" /> Uploading Image...
                </>
              ) : saving ? (
                'Saving...'
              ) : course ? (
                'Save Changes'
              ) : (
                'Add Course'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}