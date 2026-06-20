interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    description: string
  }
  onAddToCart: () => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">${product.price}</span>
          <button
            onClick={onAddToCart}
            className="btn-primary text-sm"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  )
}
