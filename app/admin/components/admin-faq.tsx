"use client";

import type React from "react";
import {
  useCreateFaq,
  useDeleteMultipleFaqs,
  useDeleteSingleFaq,
  useGetFaqs,
  useUpdateFaqs,
} from "@/hooks/use-faqs";
import { Checkbox } from "@/components/ui/checkbox";
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
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Plus, Trash, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface Faq {
  uid?: string;
  question: string;
  answer: string;
}

export function AdminFaq() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [faq, setFaq] = useState<Faq | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);
  const [selectedFaqs, setSelectedFaqs] = useState<string[]>([]);

  const { data: faqs, isLoading } = useGetFaqs();
  const { mutate: deleteFaq } = useDeleteSingleFaq();
  const { mutate: deleteMultipleFaqs } = useDeleteMultipleFaqs();
  const queryClient = useQueryClient();

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
              error instanceof Error ? error.message : "Failed to delete FAQs",
            );
            setDeleteDialogOpen(false);
          },
        },
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
            error instanceof Error ? error.message : "Failed to delete FAQ",
          );
          setDeleteDialogOpen(false);
        },
      });
    }
  };

  const handleSelectFaq = (uid: string) => {
    setSelectedFaqs((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid],
    );
  };

  const handleSelectAll = () => {
    if (selectedFaqs.length === faqs?.length) {
      setSelectedFaqs([]);
    } else {
      setSelectedFaqs(faqs?.map((faq: Faq) => faq.uid as string) || []);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card className="bg-transparent shadow-none border border-muted/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  FAQ Management
                </CardTitle>
                <CardDescription>
                  Manage frequently asked questions for your application
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedFaqs.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="gap-2"
                >
                  <Trash className="h-4 w-4" />
                  Delete Selected ({selectedFaqs.length})
                </Button>
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
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Loading FAQs...
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

interface FaqDialogProps {
  isOpen: boolean;
  onClose: () => void;
  faq: Faq | null;
  isEdit: boolean;
}

function FaqDialog({ isOpen, onClose, faq, isEdit }: FaqDialogProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const { mutate: createFaq } = useCreateFaq();
  const { mutate: updateFaq } = useUpdateFaqs();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
    } else {
      setQuestion("");
      setAnswer("");
    }
  }, [faq]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error("Question and Answer cannot be empty.");
      return;
    }

    if (isEdit && faq?.uid) {
      updateFaq(
        { uid: faq.uid, question, answer },
        {
          onSuccess: () => {
            toast.success("FAQ updated successfully");
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            onClose();
          },
          onError: (error: Error) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to create FAQ",
            );
          },
        },
      );
    } else {
      createFaq(
        { question, answer },
        {
          onSuccess: () => {
            toast.success("FAQ created successfully");
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            onClose();
          },
          onError: (error: Error) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to create FAQ",
            );
          },
        },
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              <>
                <Pencil className="h-5 w-5 text-blue-500" />
                Edit FAQ
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-green-500" />
                Create New FAQ
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Make changes to your FAQ here. Click save when you're done."
              : "Add a new question and answer to help your users."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-6 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm font-medium">
              Question *
            </Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here..."
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2 flex-1">
            <Label htmlFor="answer" className="text-sm font-medium">
              Answer *
            </Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              required
              className="min-h-[120px] resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              {isEdit ? (
                <>
                  <Pencil className="h-4 w-4" />
                  Update FAQ
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create FAQ
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
