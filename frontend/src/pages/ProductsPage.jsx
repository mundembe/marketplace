import { useState, useEffect } from "react";
import api from "../api/axios";
import ProductCard from "../component/ProductCard";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("shop/products/");
                const data = res.data.results || res.data;
                setProducts(data);
            } catch (err) {
                setError("Failed to load products.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);


    if (loading) return <p className="text-center mt-10">Loading products...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (products.length === 0) return <p className="text-center mt-10">No products available.</p>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Available Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
}
