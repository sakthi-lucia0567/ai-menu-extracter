interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  confidence: number | null;
  createdAt: string;
}

interface MenuItemsTableProps {
  items: MenuItem[];
}

export default function MenuItemsTable({ items }: MenuItemsTableProps) {
  if (items?.length === 0) return null;

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        📋 All Menu Items ({items?.length ?? 0})
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-600 max-w-xs">
                    {item.description || "-"}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {item.price !== null ? (
                    <span className="text-green-600 font-bold">
                      ${item.price.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {item.category ? (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {item.category}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
