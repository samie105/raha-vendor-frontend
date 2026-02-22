"use client";

import { useState, useCallback } from "react";
import { searchGlobalProducts } from "@/lib/actions/products";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category_id: string;
}

interface ProductSearchProps {
  onSelectProduct: (product: Product) => void;
}

export function ProductSearch({ onSelectProduct }: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setHasSearched(true);

      if (!value.trim()) {
        setResults([]);
        return;
      }

      startTransition(async () => {
        const result = await searchGlobalProducts(value);
        if ("data" in result && result.data) {
          setResults(result.data);
        }
      });
    },
    []
  );

  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder="Search products by name..."
        value={query}
        onChange={handleSearch}
        disabled={isPending}
      />

      {isPending && (
        <p className="text-sm text-muted-foreground">Searching...</p>
      )}

      {hasSearched && results.length === 0 && !isPending && (
        <p className="text-sm text-muted-foreground">No products found</p>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {results.map((product) => (
          <Card
            key={product.id}
            className="p-3 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => onSelectProduct(product)}
          >
            <div className="flex items-start gap-3">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-12 h-12 rounded object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                {product.description && (
                  <p className="text-sm text-muted-foreground truncate">
                    {product.description}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
