import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { X, Upload } from "lucide-react";

const ImageUpload = ({ productData, setProductData }) => {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setProductData((prev) => ({
        ...prev,
        productImg: [...prev.productImg, ...files],
      }));
    }
  };

  const removeImage = (index) => {
    setProductData((prev) => {
      const updatedImages = prev.productImg.filter((_, i) => i !== index);
      return { ...prev, productImg: updatedImages };
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-sm font-medium">Product Images</Label>

      {/* Hidden Input */}
      <Input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFiles}
      />

      {/* Upload Box */}
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
      >
        <Upload className="w-6 h-6 text-gray-500" />
        <span className="text-sm text-gray-600">
          Click or drag images to upload
        </span>
      </label>

      {/* Image Preview */}
      {productData.productImg.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {productData.productImg.map((file, index) => {
            let preview;

            if (file instanceof File) {
              preview = URL.createObjectURL(file);
            } else if (typeof file === "string") {
              preview = file;
            } else if (file?.url) {
              preview = file.url;
            } else {
              return null;
            }

            return (
              <Card
                key={index}
                className="relative group overflow-hidden rounded-xl shadow-sm"
              >
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
