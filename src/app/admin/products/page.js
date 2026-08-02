"use client";

import { useEffect, useState, useRef } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../../../firebase";
import Link from "next/link";
import styles from "../admin.module.css";
import pageStyles from "./products.module.css";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "Mugs",
  stock_quantity: "",
  delivery_charges: "",
};

const CATEGORIES = [
  "Mugs",
  "Photo Frames",
  "Gift Boxes",
  "Keg Tags",
  "Customized Gifts",
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Image upload state
  const [imageFiles, setImageFiles] = useState([]); // File objects (new picks)
  const [imagePreviews, setImagePreviews] = useState([]); // preview URLs (blob or remote)
  const [existingImages, setExistingImages] = useState([]); // remote URLs from Firestore
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  /* ─── Fetch products from Firestore ─── */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "products"));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(list);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ─── Helpers ─── */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getStockStatus = (qty) => {
    if (qty <= 0) return "Out of Stock";
    if (qty <= 10) return "Low Stock";
    return "In Stock";
  };

  const getStockClass = (status) => {
    switch (status) {
      case "In Stock": return pageStyles.inStock;
      case "Low Stock": return pageStyles.lowStock;
      case "Out of Stock": return pageStyles.outOfStock;
      default: return "";
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ─── Image helpers ─── */
  const addImageFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!valid.length) return;
    setImageFiles((prev) => [...prev, ...valid]);
    const newPreviews = valid.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    // index is within the combined [existingImages, imageFiles] order
    if (index < existingImages.length) {
      // removing an existing (already-uploaded) image
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      // removing a newly selected file
      const localIdx = index - existingImages.length;
      setImageFiles((prev) => prev.filter((_, i) => i !== localIdx));
      setImagePreviews((prev) => prev.filter((_, i) => i !== localIdx));
    }
  };

  const uploadImages = async (productId) => {
    const urls = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const storageRef = ref(storage, `products/${productId}/${Date.now()}_${file.name}`);
      await new Promise((resolve, reject) => {
        const task = uploadBytesResumable(storageRef, file);
        task.on(
          "state_changed",
          (snap) => {
            const pct = Math.round(((i + snap.bytesTransferred / snap.totalBytes) / imageFiles.length) * 100);
            setUploadProgress(pct);
          },
          reject,
          async () => {
            const url = await getDownloadURL(task.snapshot.ref);
            urls.push(url);
            resolve();
          }
        );
      });
    }
    return urls;
  };

  /* ─── Modal handlers ─── */
  const openAddModal = () => {
    setFormData(EMPTY_FORM);
    setModalMode("add");
    setFormError("");
    setEditingId(null);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setUploadProgress(0);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      category: product.category || "Mugs",
      stock_quantity: product.stock_quantity?.toString() || "",
      delivery_charges: product.delivery_charges?.toString() || "",
    });
    setModalMode("edit");
    setFormError("");
    setEditingId(product.id);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages(product.images || []);
    setUploadProgress(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError("");
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setUploadProgress(0);
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ─── Save (Add / Edit) ─── */
  const handleSave = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) { setFormError("Product name is required."); return; }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setFormError("Enter a valid price."); return;
    }
    if (formData.stock_quantity === "" || isNaN(Number(formData.stock_quantity)) || Number(formData.stock_quantity) < 0) {
      setFormError("Enter a valid stock quantity."); return;
    }

    try {
      setSaving(true);
      setUploadProgress(0);

      let productId = editingId;

      // For ADD: create the doc first to get an ID, then upload images
      if (modalMode === "add") {
        const docRef = await addDoc(collection(db, "products"), {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          category: formData.category,
          stock_quantity: Number(formData.stock_quantity),
          delivery_charges: formData.delivery_charges ? Number(formData.delivery_charges) : 0,
          images: [],
        });
        productId = docRef.id;
      }

      // Upload new image files
      const newUrls = imageFiles.length > 0 ? await uploadImages(productId) : [];
      const allImages = [...existingImages, ...newUrls];

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        stock_quantity: Number(formData.stock_quantity),
        delivery_charges: formData.delivery_charges ? Number(formData.delivery_charges) : 0,
        images: allImages,
      };

      await updateDoc(doc(db, "products", productId), payload);

      showToast(modalMode === "add" ? "Product added successfully!" : "Product updated successfully!");
      closeModal();
      await fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      setFormError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  /* ─── Delete ─── */
  const confirmDelete = (product) => {
    setDeleteTarget(product);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteDoc(doc(db, "products", deleteTarget.id));
      showToast("Product deleted successfully!", "delete");
      setDeleteTarget(null);
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      showToast("Failed to delete product.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Combined previews: existing remote URLs first, then new local blob previews
  const allPreviews = [
    ...existingImages,
    ...imagePreviews,
  ];

  /* ─── Render ─── */
  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px", paddingLeft: "4px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#f472b6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(244,114,182,0.3)" }}>
            <span style={{ fontSize: "18px" }}>🎁</span>
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#1e1b4b", letterSpacing: "-0.5px", lineHeight: "1.1" }}>Viola Gifts</div>
            <div style={{ fontSize: "9px", fontWeight: "700", color: "#9333ea", letterSpacing: "1px", textTransform: "uppercase" }}>Crafted With Love</div>
          </div>
        </div>
        <nav className={styles.navMenu}>
          <Link href="/admin" className={styles.navLink}>Dashboard</Link>
          <Link href="/admin/products" className={`${styles.navLink} ${styles.activeLink}`}>Products</Link>
          <Link href="/admin/orders" className={styles.navLink}>Orders</Link>
          <Link href="/admin/customers" className={styles.navLink}>Customers</Link>
          <Link href="/" className={styles.navLink} style={{ marginTop: "auto" }}>← Back to Store</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.subtitle}>Manage your store&apos;s product catalog.</p>
        </header>

        <div className={pageStyles.actionBar}>
          <input
            className={pageStyles.searchInput}
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={pageStyles.addBtn} onClick={openAddModal}>+ Add Product</button>
        </div>

        {loading ? (
          <div className={pageStyles.loadingState}>
            <div className={pageStyles.spinner}></div>
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={pageStyles.emptyState}>
            <p className={pageStyles.emptyIcon}>📦</p>
            <p className={pageStyles.emptyText}>
              {searchTerm ? "No products match your search." : "No products yet. Click \"+ Add Product\" to get started."}
            </p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Image</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Price (Rs.)</th>
                  <th className={styles.th}>Stock</th>
                  <th className={styles.th}>Delivery</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product.stock_quantity ?? 0);
                  return (
                    <tr key={product.id} className={styles.tr}>
                      <td className={styles.td}>
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className={pageStyles.tableThumb}
                          />
                        ) : (
                          <div className={pageStyles.tableThumbEmpty}>—</div>
                        )}
                      </td>
                      <td className={styles.td} style={{ fontWeight: 600 }}>{product.name}</td>
                      <td className={styles.td}>{product.category}</td>
                      <td className={styles.td}>Rs. {Number(product.price).toLocaleString("en-LK", { minimumFractionDigits: 2 })}</td>
                      <td className={styles.td}>{product.stock_quantity}</td>
                      <td className={styles.td}>Rs. {Number(product.delivery_charges ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}</td>
                      <td className={styles.td}>
                        <span className={`${styles.statusBadge} ${getStockClass(status)}`}>{status}</span>
                      </td>
                      <td className={styles.td}>
                        <div className={pageStyles.actions}>
                          <button className={pageStyles.editBtn} onClick={() => openEditModal(product)}>Edit</button>
                          <button className={pageStyles.deleteBtn} onClick={() => confirmDelete(product)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ─── Add / Edit Modal ─── */}
      {showModal && (
        <div className={pageStyles.overlay} onClick={closeModal}>
          <div className={pageStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={pageStyles.modalHeader}>
              <h2 className={pageStyles.modalTitle}>
                {modalMode === "add" ? "Add New Product" : "Edit Product"}
              </h2>
              <button className={pageStyles.closeBtn} onClick={closeModal}>✕</button>
            </div>

            {formError && <p className={pageStyles.formError}>{formError}</p>}

            <form onSubmit={handleSave} className={pageStyles.form}>
              <div className={pageStyles.fieldGroup}>
                <label className={pageStyles.fieldLabel}>Product Name *</label>
                <input
                  className={pageStyles.fieldInput}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Customized Mug"
                />
              </div>

              <div className={pageStyles.fieldGroup}>
                <label className={pageStyles.fieldLabel}>Description</label>
                <textarea
                  className={pageStyles.fieldTextarea}
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Brief product description..."
                  rows={3}
                />
              </div>

              <div className={pageStyles.fieldRow}>
                <div className={pageStyles.fieldGroup}>
                  <label className={pageStyles.fieldLabel}>Price (Rs.) *</label>
                  <input
                    className={pageStyles.fieldInput}
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className={pageStyles.fieldGroup}>
                  <label className={pageStyles.fieldLabel}>Category *</label>
                  <select
                    className={pageStyles.fieldSelect}
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={pageStyles.fieldRow}>
                <div className={pageStyles.fieldGroup}>
                  <label className={pageStyles.fieldLabel}>Stock Quantity *</label>
                  <input
                    className={pageStyles.fieldInput}
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleFormChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className={pageStyles.fieldGroup}>
                  <label className={pageStyles.fieldLabel}>Delivery Charges (Rs.)</label>
                  <input
                    className={pageStyles.fieldInput}
                    type="number"
                    name="delivery_charges"
                    value={formData.delivery_charges}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {/* ─── Image Upload ─── */}
              <div className={pageStyles.fieldGroup}>
                <label className={pageStyles.fieldLabel}>Product Images</label>

                {/* Drop Zone */}
                <div
                  className={`${pageStyles.dropZone} ${isDragOver ? pageStyles.dropZoneActive : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    addImageFiles(e.dataTransfer.files);
                  }}
                >
                  <div className={pageStyles.dropZoneIcon}>🖼️</div>
                  <p className={pageStyles.dropZoneText}>
                    <strong>Click to browse</strong> or drag & drop images here
                  </p>
                  <p className={pageStyles.dropZoneHint}>PNG, JPG, WEBP — multiple allowed</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => addImageFiles(e.target.files)}
                  />
                </div>

                {/* Image Previews */}
                {allPreviews.length > 0 && (
                  <div className={pageStyles.previewGrid}>
                    {allPreviews.map((src, i) => (
                      <div key={i} className={pageStyles.previewItem}>
                        <img src={src} alt={`Preview ${i + 1}`} className={pageStyles.previewImg} />
                        <button
                          type="button"
                          className={pageStyles.removeImgBtn}
                          onClick={() => removeImage(i)}
                          title="Remove image"
                        >
                          ✕
                        </button>
                        {i === 0 && <span className={pageStyles.primaryBadge}>Primary</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Progress Bar */}
                {saving && imageFiles.length > 0 && uploadProgress > 0 && (
                  <div className={pageStyles.progressWrap}>
                    <div className={pageStyles.progressBar} style={{ width: `${uploadProgress}%` }} />
                    <span className={pageStyles.progressLabel}>{uploadProgress}%</span>
                  </div>
                )}
              </div>

              <div className={pageStyles.modalActions}>
                <button type="button" className={pageStyles.cancelBtn} onClick={closeModal}>Cancel</button>
                <button type="submit" className={pageStyles.saveBtn} disabled={saving}>
                  {saving
                    ? (imageFiles.length > 0 ? `Uploading… ${uploadProgress}%` : "Saving…")
                    : (modalMode === "add" ? "Add Product" : "Save Changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation ─── */}
      {deleteTarget && (
        <div className={pageStyles.overlay} onClick={() => setDeleteTarget(null)}>
          <div className={pageStyles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <div className={pageStyles.confirmIcon}>🗑️</div>
            <h3 className={pageStyles.confirmTitle}>Delete Product</h3>
            <p className={pageStyles.confirmText}>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className={pageStyles.confirmActions}>
              <button className={pageStyles.cancelBtn} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className={pageStyles.deleteBtnConfirm} onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Toast Notification ─── */}
      {toast && (
        <div className={`${pageStyles.toast} ${toast.type === "delete" ? pageStyles.toastDelete : ""}`}>
          <span className={pageStyles.toastIcon}>{toast.type === "delete" ? "🗑️" : "✅"}</span>
          {toast.message}
        </div>
      )}
    </div>
  );
}
