"use client";

import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteMultipleFaqs,
  useDeleteSingleFaq,
  useGetFaqs,
} from "@/hooks/use-faqs";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, Pencil, Plus, Trash, TrashIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FaqDialog from "./components/FaqDialog";
import { Faq } from "@/types/models/faq";
import { EmptyState } from "@/components/empty-state";
import { TypographyH2 } from "@/components/typography";

export default function FaqPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [faq, setFaq] = useState<Faq | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);
  const [selectedFaqs, setSelectedFaqs] = useState<string[]>([]);
  const isVisible = false;
  const { data: faqsData, isLoading } = useGetFaqs();
  const { mutate: deleteFaq } = useDeleteSingleFaq();
  const { mutate: deleteMultipleFaqs } = useDeleteMultipleFaqs();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (faqsData) {
      setFaqs(faqsData);
    }
  }, [faqsData]);

  const handleOpenDialog = (faq?: Faq) => {
    setFaq(faq || null);
    setIsEdit(!!faq);
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setFaq(null);
  };

  const handleDeleteClick = (faq: Faq) => {
    setFaqToDelete(faq);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedFaqs.length > 0) {
      deleteMultipleFaqs(
        { uids: selectedFaqs },
        {
          onSuccess: () => {
            toast.success("FAQs deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            setDeleteDialogOpen(false);
            setSelectedFaqs([]);
          },
          onError: (error: Error) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to delete FAQs"
            );
            setDeleteDialogOpen(false);
          },
        }
      );
    } else if (faqToDelete?.uid) {
      deleteFaq(faqToDelete.uid, {
        onSuccess: () => {
          toast.success("FAQ deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["faqs"] });
          setDeleteDialogOpen(false);
          setFaqToDelete(null);
        },
        onError: (error: Error) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to delete FAQ"
          );
          setDeleteDialogOpen(false);
        },
      });
    }
  };

  const handleSelectFaq = (uid: string) => {
    setSelectedFaqs((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const handleSelectAll = () => {
    if (selectedFaqs.length === faqs?.length) {
      setSelectedFaqs([]);
    } else {
      setSelectedFaqs(faqs?.map((faq: Faq) => faq.uid as string) || []);
    }
  };

  if (!faqs || faqs.length === 0) {
    return (
      <>
        <EmptyState
          icon={HelpCircle}
          title="No Faq Found"
          description="No faq have been created yet."
          actionLabel="Create Faq"
          onAction={() => handleOpenDialog()}
        />
        <FaqDialog
          isOpen={isOpen}
          onClose={handleCloseDialog}
          faq={faq}
          isEdit={isEdit}
        />
      </>
    );
  }
  return (
    <div>
      <Card className="bg-transparent shadow-none border border-muted/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-8 w-8 text-primary" />
              <div>
                <TypographyH2 className="text-2xl mb-1">FAQ Management</TypographyH2>
                <CardDescription>
                  Manage frequently asked questions for your application
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedFaqs.length > 0 && (
                <AnimatePresence>
                  {!isVisible && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <Button
                        onClick={() => setDeleteDialogOpen(true)}
                        id="deleteMany"
                      >
                        <TrashIcon />
                        Delete selected( {`${selectedFaqs.length}`})
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Add FAQ
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedFaqs.length === faqs?.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[30%]">Question</TableHead>
                  <TableHead className="w-[50%]">Answer</TableHead>
                  <TableHead className="w-[20%] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loading />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : faqs?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <HelpCircle className="h-8 w-8 text-muted-foreground/50" />
                        <span>
                          No FAQs found. Add your first FAQ to get started.
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  faqs?.map((faq: Faq) => (
                    <TableRow key={faq.uid} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedFaqs.includes(faq.uid as string)}
                          onCheckedChange={() =>
                            handleSelectFaq(faq.uid as string)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="line-clamp-3 text-sm">
                          {faq.question}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="line-clamp-3 text-sm text-muted-foreground">
                          {faq.answer}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(faq)}
                            className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(faq)}
                            className="hover:bg-red-50 hover:text-red-600 curor-pointer"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Form Dialog */}
      <FaqDialog
        isOpen={isOpen}
        onClose={handleCloseDialog}
        faq={faq}
        isEdit={isEdit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              {selectedFaqs.length > 0
                ? `Are you sure you want to delete ${selectedFaqs.length} selected FAQs?`
                : "Are you sure you want to delete this FAQ?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="cursor-pointer"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
