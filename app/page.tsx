"use client";
import FileUpload from "@/components/FileUpload";
import MenuItemCards from "@/components/MenuItemCards";
import MenuItemsTable from "@/components/MenuItemsTable";
import { useEffect, useState } from "react";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  confidence: number | null;
  createdAt: string;
  sourceFilename?: string | null;
}

export default function Home() {
  const [previewItems, setPreviewItems] = useState<MenuItem[] | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/menu-items?page=${page}&limit=${limit}`);
        const data = await res.json();
        if (data.success) {
          setMenuItems(data.menuItems || []);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [page, limit]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <FileUpload onExtracted={(items) => setPreviewItems(items)} />

        {previewItems && previewItems.length > 0 ? (
          <MenuItemCards items={previewItems} />
        ) : loading ? (
          <p className="text-center text-gray-500 mt-6">
            Loading menu items...
          </p>
        ) : (
          <>
            <MenuItemsTable items={menuItems} />
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                {/* Page size selector */}
                <div className="flex items-center gap-2">
                  <label htmlFor="page-size" className="text-sm text-gray-600">
                    Items per page:
                  </label>
                  <select
                    id="page-size"
                    value={limit}
                    onChange={(e) => {
                      setPage(1); // reset to first page when limit changes
                      setLimit(Number(e.target.value));
                    }}
                    className="border bg-gray-600 hover:cursor-pointer border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>

                {/* Page navigation */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ⬅ Prev
                  </button>
                  <span className="text-gray-600 text-sm">
                    Page <span className="font-medium">{page}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next ➡
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
