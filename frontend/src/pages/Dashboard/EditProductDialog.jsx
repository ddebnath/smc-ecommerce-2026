import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { API_URL } from "@/config/api";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store.js";
import { setProducts } from "@/redux/slices/productSlice";
import { toast } from "sonner";

const MAX_IMAGES = 5;

const EditProductDialog = ({ open, setOpen, product }) => {
  const dispatch = useDispatch();
  const products = useSelector((store) => store.product);
  const accessToken = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    productName: "",
    productDesc: "",
    productPrice: "",
    brand: "",
    category: "",
    existingImages: [],
    newImages: [],
  });

  const [loading, setLoading] = useState(false);

  // ✅ Populate form
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || "",
        productDesc: product.productDesc || "",
        productPrice: product.productPrice || "",
        brand: product.brand || "",
        category: product.category || "",
        existingImages: product.productImg || [],
        newImages: [],
      });
    }
  }, [product]);

  // ✅ Handle text input
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Upload images with limit
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const total = formData.existingImages.length + formData.newImages.length;

    const available = MAX_IMAGES - total;

    if (available <= 0) {
      alert("Maximum 5 images allowed");
      return;
    }

    const filesToAdd = files.slice(0, available);

    if (files.length > available) {
      alert(`Only ${available} more image(s) allowed`);
    }

    setFormData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...filesToAdd],
    }));
  };

  // ✅ Remove existing image
  const removeExistingImage = (public_id) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter(
        (img) => img.public_id !== public_id,
      ),
    }));
  };

  // ✅ Remove new image
  const removeNewImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const total = formData.existingImages.length + formData.newImages.length;

    if (total > MAX_IMAGES) {
      alert("Max 5 images allowed");
      return;
    }

    try {
      setLoading(true);

      const formDataObj = new FormData();

      // text fields
      Object.keys(formData).forEach((key) => {
        if (key !== "existingImages" && key !== "files") {
          formDataObj.append(key, formData[key]);
        }
      });

      // existing images
      formData.existingImages.forEach((img) => {
        formDataObj.append("existingImages", img.public_id);
      });

      // new images
      formData.newImages.forEach((file) => {
        formDataObj.append("files", file);
      });

      const res = await axios.put(
        `${API_URL}/product/update/${product._id}`,
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("product updated successfully");
        const updatedProducts = products.products.map((p) =>
          p._id === product._id ? res.data.product : p,
        );
        dispatch(setProducts(updatedProducts));
        setOpen(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset when closed
  useEffect(() => {
    if (!open) {
      setFormData({
        productName: "",
        productDesc: "",
        productPrice: "",
        brand: "",
        category: "",
        existingImages: [],
        newImages: [],
      });
    }
  }, [open]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await axios.delete(
        `${API_URL}/product/delete/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("product deleted successfully");
        const updatedProducts = products.products.map((p) =>
          p._id !== product._id ? products : p,
        );
        dispatch(setProducts(updatedProducts));
      }
      setOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            {/* Name */}
            <div>
              <Label>Product Name</Label>
              <Input
                name="productName"
                value={formData.productName}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                name="productDesc"
                value={formData.productDesc}
                onChange={handleChange}
              />
            </div>

            {/* Price */}
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleChange}
              />
            </div>

            {/* Brand */}
            <div>
              <Label>Brand</Label>
              <Input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>

            {/* Category */}
            <div>
              <Label>Category</Label>
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            {/* Images */}
            <div>
              <Label>Images</Label>

              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={
                  formData.existingImages.length + formData.newImages.length >=
                  MAX_IMAGES
                }
              />

              <p className="text-sm text-gray-500 mt-1">
                {formData.existingImages.length + formData.newImages.length} /{" "}
                {MAX_IMAGES} images
              </p>

              {/* Existing images */}
              <div className="flex gap-2 flex-wrap mt-3">
                {formData.existingImages.map((img) => (
                  <div key={img.public_id} className="relative">
                    <img
                      src={img.url}
                      alt=""
                      className="w-20 h-20 object-cover rounded border"
                    />

                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.public_id)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* New images */}
                {formData.newImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-20 h-20 object-cover rounded border"
                    />

                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-5 flex justify-between">
            {/* DELETE BUTTON */}
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Product"}
            </Button>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
