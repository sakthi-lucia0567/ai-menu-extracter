interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  confidence: number | null;
  createdAt: string;
}

interface MenuItemCardsProps {
  items: MenuItem[];
}

export default function MenuItemCards({ items }: MenuItemCardsProps) {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        📊 Extracted Menu Items ({items.length})
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md"
          >
            <h4 className="font-semibold text-gray-800 mb-2">{item.name}</h4>
            {item.description && (
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
            )}
            <div className="flex justify-between items-center">
              {item.price !== null && (
                <span className="text-green-600 font-bold">
                  ${item.price.toFixed(2)}
                </span>
              )}
              {item.category && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {item.category}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
