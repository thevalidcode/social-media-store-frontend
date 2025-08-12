import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateUser } from "@/hooks/use-user";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";

// Props now include open, onOpenChange, formData, and onFormDataChange
interface UpdateUserProps {
  uid: string;
  username: string;
  email: string;
  full_name: string;
  balance: number;
}

interface EditUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UpdateUserProps;
  onFormDataChange: (data: UpdateUserProps) => void;
}

export function EditUser({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
}: EditUserProps) {
  const queryClient = useQueryClient();
  const { mutate: updateUser } = useUpdateUser();

  // Internal state to make the component responsive
  const [internalFormData, setInternalFormData] = useState<UpdateUserProps>(formData);

  // Sync with parent state when it changes
  useEffect(() => {
    setInternalFormData(formData);
  }, [formData]);

  // Handle input changes locally and propagate up
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...internalFormData,
      [name]: name === "balance" ? parseFloat(value) || 0 : value,
    };
    setInternalFormData(newFormData);
    onFormDataChange(newFormData); // Also notify parent
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(internalFormData, {
      onSuccess: () => {
        toast.success("User updated successfully");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        onOpenChange(false); // Close dialog on success
      },
      onError: (error: unknown) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message || "Failed to update user");
        } else {
          toast.error("Failed to update user");
        }
      },
    });
  };

  // Dialog is controlled by parent, but form state is handled internally for responsiveness
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] backdrop-blur-xs bg-background/80">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit a user account.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* UID Field (Read-only) */}
          <div className="space-y-2.5">
            <Label htmlFor="uid">User ID</Label>
            <Input
              id="uid"
              name="uid"
              type="text"
              value={internalFormData.uid}
              readOnly
              disabled
            />
          </div>

          {/* Full Name Field */}
          <div className="space-y-2.5">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Enter your full name"
              value={internalFormData.full_name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Username Field */}
          <div className="space-y-2.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={internalFormData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={internalFormData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Balance Field */}
          <div className="space-y-2.5">
            <Label htmlFor="balance">Balance</Label>
            <Input
              id="balance"
              name="balance"
              type="number"
              placeholder="Enter the balance"
              value={internalFormData.balance}
              onChange={handleInputChange}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-6">
            Update User
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
