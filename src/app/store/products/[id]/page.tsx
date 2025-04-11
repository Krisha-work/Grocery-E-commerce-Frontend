import { getProductById } from '../../../../lib/api/products';
import Image from 'next/image';
import AddToCartButton from '../../../../components/products/AddToCartButton';
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="bg-white p-4 rounded-lg">
          <Image 
            src={product.image} 
            alt={product.name}
            width={600}
            height={400}
            className="rounded-lg"
          />
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-green-600 text-xl my-2">${product.price}</p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}