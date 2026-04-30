import { Category } from "@/types/admin/Category";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect } from "react";
import TableHeader from "./table-header";
export default function CategoryList({
  id,
  categories,
  onCategoriesFetched,
}: {
  id: number;
  categories: Category[];
  onCategoriesFetched: Dispatch<SetStateAction<Item[]>>;
}) {
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/restaurants/${id}/categories`,
      );
      console.log(res.data);
      onCategoriesFetched(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="my-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-center">
              <tr className="border-b border-gray-50 bg-slate-50/50">
                <TableHeader
                  allHeader={["ID", "Category Name", "Items Count"]}
                />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-center">
              {categories.length ? (
                categories.map((category) => (
                  <tr
                    key={category.categoryId}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-500">
                        {category.categoryId}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">
                        {category.name}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-slate-900 font-semibold">
                        {category.itemsCount}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <p className="text-center py-10 text-lg text-gray-400">
                      No categories found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
