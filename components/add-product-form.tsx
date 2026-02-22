"use client";

import { useState } from "react";
import { addProductToStore } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductSearch } from "@/components/product-search";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface AddProductFormProps {
  storeId: string;
}

interface SelectedProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

export function AddProductForm({ storeId }: AddProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    local_price: "",
    cost_price: "",
    stock_count: "",
    min_stock_level: "",
  });
  const [error, setError] = useState("");

  const handleProductSelect = (product: SelectedProduct) => {
    setSelectedProduct(product);
    setFormData((prev) => ({
      ...prev,
      name: product.name,
      description: product.description || "",
    }));
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
    setFormData((prev) => ({
      ...prev,
      name: "",
      description: "",
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        local_price: parseFloat(formData.local_price),
        cost_price: formData.cost_price
          ? parseFloat(formData.cost_price)
          : undefined,
        stock_count: parseInt(formData.stock_count),
        min_stock_level: formData.min_stock_level
          ? parseInt(formData.min_stock_level)
          : undefined,
        global_product_id: selectedProduct?.id || null,
      };

      const result = await addProductToStore(storeId, payload);

      if ("error" in result) {
        setError(
          typeof result.error === "string"
            ? result.error
            : "Failed to add product"
        );
      } else {
        router.push(`/dashboard/products`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Search Global Directory */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border bg-muted">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">1</div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Search Global Directory</h3>
              <p className="text-sm text-muted-foreground">Find products from our catalog</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <ProductSearch onSelectProduct={handleProductSelect} />
          
          {selectedProduct && (
            <div className="flex items-center justify-between p-4 bg-secondary border border-secondary rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Selected Product</p>
                  <p className="font-semibold text-foreground">{selectedProduct.name}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                className="text-muted-foreground hover:text-destructive"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Product Details */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border bg-muted">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">2</div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Product Details</h3>
              <p className="text-sm text-muted-foreground">
                {selectedProduct ? "Review the product information" : "Or create a custom product"}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className="mt-2"
                required
                disabled={selectedProduct !== null}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                className="mt-2 min-h-[100px]"
                disabled={selectedProduct !== null}
                rows={4}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Pricing & Inventory */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border bg-muted">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">3</div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Pricing & Inventory</h3>
              <p className="text-sm text-muted-foreground">Set your prices and stock levels</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="local_price" className="text-sm font-medium">
                Selling Price <span className="text-destructive">*</span>
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="local_price"
                  name="local_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.local_price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="pl-7"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">The price customers will pay</p>
            </div>

            <div>
              <Label htmlFor="cost_price" className="text-sm font-medium">
                Cost Price
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="cost_price"
                  name="cost_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost_price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Your cost (for profit tracking)</p>
            </div>

            <div>
              <Label htmlFor="stock_count" className="text-sm font-medium">
                Stock Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock_count"
                name="stock_count"
                type="number"
                min="0"
                value={formData.stock_count}
                onChange={handleInputChange}
                placeholder="0"
                className="mt-2"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Available units in stock</p>
            </div>

            <div>
              <Label htmlFor="min_stock_level" className="text-sm font-medium">
                Minimum Stock Level
              </Label>
              <Input
                id="min_stock_level"
                name="min_stock_level"
                type="number"
                min="0"
                value={formData.min_stock_level}
                onChange={handleInputChange}
                placeholder="0"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Alert when stock falls below</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="flex-1 sm:flex-none sm:min-w-[200px]"
        >
          {isPending ? (
            <>
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding product...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          className="sm:min-w-[120px]"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
