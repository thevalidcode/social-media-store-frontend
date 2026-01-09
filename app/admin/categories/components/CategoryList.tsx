"use client";

import { useEffect, useMemo, useState } from "react";
import CategoryCard from "./CategoryCard";
import CategoryTable from "./CategoryTable";
import { Category, CategoryStatus } from "@/types";
import CategoryFilters from "./CategoryFilters";
import {
  useDeleteMultipleCategorys,
  useGetCategories,
  useUpdateCategory,
} from "@/hooks/use-category";
import Loading from "@/app/loading";
import { EmptyState } from "@/components/empty-state";
import { Folder } from "lucide-react";
import Pagination from "@/components/pagination";
import DeleteDialog from "../../components/DeleteDialog";
import CategoryDialog from "./CategoryDialog";

export default function CategoryList() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: categoriesData, isLoading } = useGetCategories();
  const { mutate: deleteMultipleCategories } = useDeleteMultipleCategorys();
  const { mutate: updateCategory } = useUpdateCategory();

  const handleAddCategoryClick = () => {
    setOpen(true);
    setSelectedCategory(null);
  };

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  const filteredCategories = categories.filter((c) => {
    const matchesSearch = c.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesStatus =
      filters.status === "All" || c.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const sorted = useMemo(() => {
    const arr = [...filteredCategories];
    return arr.sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredCategories]);

  const current = sorted.slice((page - 1) * pageSize, page * pageSize);

  if (isLoading) return <Loading />;

  if (!categories || categories.length === 0) {
    return (
      <>
        <EmptyState
          icon={Folder}
          title="No Categories Found"
          description="No categories have been created yet."
          actionLabel="Create Category"
          onAction={handleAddCategoryClick}
        />
        <CategoryDialog open={open} setOpen={setOpen} />
      </>
    );
  }

  const handleEdit = (category: Category) => {
    setOpen(true);
    setSelectedCategory(category);
  };

  const handleDeleteSingle = (id: number) => {
    setDeleteIds([id]);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    const categoryUids = current
      .filter((c) => deleteIds.includes(c.storeScopedId))
      .map((c) => c.uid);
    deleteMultipleCategories({ uids: categoryUids });
    setCategories((prev) =>
      prev.filter((c) => !deleteIds.includes(c.storeScopedId))
    );
    setDeleteIds([]);
  };

  const namesForDelete = current
    .filter((c) => deleteIds.includes(c.storeScopedId))
    .map((c) => c.name);

  const onToggleStatus = (categoryId: number, newStatus: CategoryStatus) => {
    const category = categories.find((c) => c.storeScopedId === categoryId);
    if (!category) return;

    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.storeScopedId === categoryId ? { ...cat, status: newStatus } : cat
      )
    );
    updateCategory({ uid: category.uid, status: newStatus });
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      <CategoryFilters
        onFilterChange={handleFilterChange}
        addCategory={handleAddCategoryClick}
      />
      {/* Desktop Table */}
      <div className="hidden md:block">
        <CategoryTable
          categories={current}
          onEdit={handleEdit}
          onDeleteSingle={handleDeleteSingle}
          onToggleStatus={onToggleStatus}
        />
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        <CategoryCard
          categories={current}
          onEdit={handleEdit}
          onDeleteSingle={handleDeleteSingle}
          onToggleStatus={onToggleStatus}
        />
      </div>

      <CategoryDialog
        editingItem={selectedCategory}
        open={open}
        setOpen={setOpen}
      />

      {/* Pagination */}
      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={sorted.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[10, 20, 50]}
      />

      {/* Delete dialog */}
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        count={deleteIds.length}
        names={namesForDelete}
        entityName="category"
      />
    </div>
  );
}
