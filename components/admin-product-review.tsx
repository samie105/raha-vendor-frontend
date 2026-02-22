"use client";

import { useState } from "react";
import { approveProduct, rejectProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useTransition } from "react";

interface PendingProduct {
  id: string;
  name: string;
  description: string | null;
  local_price: number;
  stock_count: number;
  stores: {
    name: string;
    vendor_id: string;
  };
  created_at: string;
}

interface AdminProductReviewProps {
  products: PendingProduct[];
}

export function AdminProductReview({ products }: AdminProductReviewProps) {
  const [pendingProducts, setPendingProducts] = useState(products);
  const [rejectionNotes, setRejectionNotes] = useState<Record<string, string>>({});
  const [showNotes, setShowNotes] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleApprove = (productId: string) => {
    startTransition(async () => {
      const result = await approveProduct(productId);
      if ("data" in result) {
        setPendingProducts((prev) =>
          prev.filter((p) => p.id !== productId)
        );
        setMessage("Product approved!");
      }
    });
  };

  const handleReject = (productId: string) => {
    const notes = rejectionNotes[productId] || "";
    startTransition(async () => {
      const result = await rejectProduct(productId, notes);
      if ("data" in result) {
        setPendingProducts((prev) =>
          prev.filter((p) => p.id !== productId)
        );
        setRejectionNotes((prev) => {
          const newNotes = { ...prev };
          delete newNotes[productId];
          return newNotes;
        });
        setShowNotes((prev) => {
          const newShow = { ...prev };
          delete newShow[productId];
          return newShow;
        });
        setMessage("Product rejected!");
      }
    });
  };

  if (pendingProducts.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No pending products for review</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-sm">{message}</p>
        </Card>
      )}

      {pendingProducts.map((product) => (
        <Card key={product.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <Badge>Pending Review</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {product.description}
                </p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span>Store: {product.stores.name}</span>
                  <span>Price: ${product.local_price.toFixed(2)}</span>
                  <span>Stock: {product.stock_count}</span>
                  <span>
                    Submitted: {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {showNotes[product.id] && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Rejection Notes</label>
                <Textarea
                  value={rejectionNotes[product.id] || ""}
                  onChange={(e) =>
                    setRejectionNotes((prev) => ({
                      ...prev,
                      [product.id]: e.target.value,
                    }))
                  }
                  placeholder="Why is this product being rejected?"
                  rows={3}
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => handleApprove(product.id)}
                disabled={isPending}
              >
                Approve
              </Button>

              <Button
                variant={showNotes[product.id] ? "default" : "outline"}
                onClick={() =>
                  setShowNotes((prev) => ({
                    ...prev,
                    [product.id]: !prev[product.id],
                  }))
                }
              >
                {showNotes[product.id] ? "Hide Notes" : "Add Notes & Reject"}
              </Button>

              {showNotes[product.id] && (
                <Button
                  variant="destructive"
                  onClick={() => handleReject(product.id)}
                  disabled={isPending}
                >
                  Reject
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
