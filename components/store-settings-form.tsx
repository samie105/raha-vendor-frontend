"use client";

import { useState, useMemo } from "react";
import { updateStore, createStore } from "@/lib/actions/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface StoreSettingsFormProps {
  storeData?: any;
}

// Timeline step component
function TimelineStep({
  step,
  title,
  description,
  isCompleted,
  isActive,
  isLast,
  children,
}: {
  step: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  isLast: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex gap-4">
      {/* Timeline line and indicator */}
      <div className="flex flex-col items-center">
        {/* Step indicator */}
        <div
          className={`
            relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300
            ${isCompleted 
              ? "border-accent bg-accent text-white" 
              : isActive 
                ? "border-primary bg-primary text-white" 
                : "border-border bg-background text-muted-foreground"
            }
          `}
        >
          {isCompleted ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            step
          )}
        </div>
        {/* Connecting line */}
        {!isLast && (
          <div className="relative h-full w-0.5 mt-2">
            <div className="absolute inset-0 bg-border" />
            <div 
              className={`absolute inset-x-0 top-0 bg-accent transition-all duration-500 ease-out`}
              style={{ height: isCompleted ? '100%' : '0%' }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="mb-3">
          <h3 className={`text-base font-semibold transition-colors ${isActive || isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className={`rounded-lg border bg-card p-4 transition-all ${isActive ? "border-primary/30 shadow-sm" : "border-border"}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function StoreSettingsForm({ storeData }: StoreSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: storeData?.name || "",
    description: storeData?.description || "",
    contact_email: storeData?.contact_email || "",
    phone: storeData?.phone || "",
    address: storeData?.address || "",
    city: storeData?.city || "",
    state: storeData?.state || "",
    postal_code: storeData?.postal_code || "",
    country: storeData?.country || "",
  });

  // Calculate step completion status
  const stepStatus = useMemo(() => {
    const step1Complete = formData.name.trim().length > 0;
    const step2Complete = formData.contact_email.trim().length > 0;
    const step3Complete = formData.address.trim().length > 0 || formData.city.trim().length > 0;

    // Determine which step is currently active
    let activeStep = 1;
    if (step1Complete) activeStep = 2;
    if (step1Complete && step2Complete) activeStep = 3;

    return {
      step1: { completed: step1Complete, active: activeStep === 1 },
      step2: { completed: step2Complete, active: activeStep === 2 },
      step3: { completed: step3Complete, active: activeStep === 3 },
    };
  }, [formData]);

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
    setMessage("");

    startTransition(async () => {
      const result = storeData?.id
        ? await updateStore(storeData.id, formData)
        : await createStore(formData);

      if ("error" in result) {
        setError(
          typeof result.error === "string"
            ? result.error
            : "Failed to save store"
        );
      } else {
        setMessage("Store saved successfully!");
        router.refresh();
      }
    });
  };

  const isNewStore = !storeData?.id;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">
            {formData.name ? formData.name.charAt(0).toUpperCase() : "S"}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {isNewStore ? "Create Your Store" : "Store Settings"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isNewStore ? "Complete each step to set up your store" : "Update your store information"}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {/* Step 1: Store Branding */}
        <TimelineStep
          step={1}
          title="Store Branding"
          description="Name and description for your store"
          isCompleted={stepStatus.step1.completed}
          isActive={stepStatus.step1.active}
          isLast={false}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Store Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your store name"
                className="mt-1.5"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Displayed to customers on your storefront
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell customers what you sell..."
                className="mt-1.5 min-h-[80px] resize-none"
                rows={3}
              />
            </div>
          </div>
        </TimelineStep>

        {/* Step 2: Contact Information */}
        <TimelineStep
          step={2}
          title="Contact Information"
          description="How customers can reach you"
          isCompleted={stepStatus.step2.completed}
          isActive={stepStatus.step2.active}
          isLast={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_email" className="text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="store@example.com"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className="mt-1.5"
              />
            </div>
          </div>
        </TimelineStep>

        {/* Step 3: Location */}
        <TimelineStep
          step={3}
          title="Store Location"
          description="Physical address (optional)"
          isCompleted={stepStatus.step3.completed}
          isActive={stepStatus.step3.active}
          isLast={true}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                Street Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street"
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-sm font-medium">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="postal_code" className="text-sm font-medium">Postal Code</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  placeholder="12345"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        </TimelineStep>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm text-primary">
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {message}
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-6 flex items-center gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="min-w-[140px]"
        >
          {isPending ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            isNewStore ? "Create Store" : "Save Changes"
          )}
        </Button>
        <span className="text-xs text-muted-foreground">
          {stepStatus.step1.completed && stepStatus.step2.completed ? "Ready to submit" : "Complete required fields"}
        </span>
      </div>
    </form>
  );
}
