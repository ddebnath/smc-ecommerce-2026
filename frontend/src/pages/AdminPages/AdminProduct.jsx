import { Input } from "@/components/ui/input";
import { Edit2, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import EditProductDialog from "../Dashboard/EditProductDialog";

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="pl-[350px] py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="flex justify-between">
        <div className="relative bg-white rounded-lg">
          <Input
            type="text"
            placeholder="search product..."
            className="w-[400px] h-[40px]"
          />
          <Search className="absolute right-3 top-2 text-gray-400" />
        </div>

        <Select>
          <SelectTrigger className="w-full max-w-60">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High To Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Product list */}
      <div className="mt-10">
        {products?.map((product) => (
          <Card key={product._id} className="px-4 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <img
                  src={product.productImg?.[0]?.url}
                  alt=""
                  className="w-20 h-20"
                />
                <h1 className="w-120 text-gray-700 line-clamp-3">
                  {product.productName}
                </h1>
              </div>

              <h1 className="font-bold text-gray-700">
                ₹ {product.productPrice}
              </h1>

              <div className="flex gap-3 items-center">
                <Button
                  variant="outline"
                  className="border-none"
                  onClick={() => {
                    setSelectedProduct(product); // 👈 store full product
                    setOpen(true);
                  }}
                >
                  <Edit2 className="text-green-500" />
                </Button>

                <Trash2 className="text-red-500 cursor-pointer" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ✅ Single Dialog (outside map) */}
      {open && selectedProduct && (
        <EditProductDialog
          open={open}
          setOpen={setOpen}
          product={selectedProduct} // 👈 pass full product
        />
      )}
    </div>
  );
};

export default AdminProduct;
