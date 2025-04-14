'use client';


export default function StorePage() {

    return (
        <div className="container text-black h-screen mx-auto px-4 py-8 mt-20" >
            <h1 className="text-center text-black text-2xl font-bold">Store</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto mt-10">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold">Product 1</h2>
                    <p className="text-gray-600">Description of Product 1</p>
                </div>
            </div>
            <div className="grid grid-cols-1 h-100  md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto mt-10">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold">Product 1</h2>
                    <p className="text-gray-600">Description of Product 1</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto mt-10">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold">Product 1</h2>
                    <p className="text-gray-600">Description of Product 1</p>
                </div>
            </div>
        </div>
    );
}

