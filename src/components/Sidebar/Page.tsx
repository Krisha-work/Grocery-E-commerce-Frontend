"use client";
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface FilterState {
    categories: string[];
    skinType: string[];
    priceRange: [number, number];
    ratings: number[];
    promotions: string[];
    availability: string[];
}

const Sidebar: React.FC = () => {
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        skinType: [],
        priceRange: [10, 100],
        ratings: [],
        promotions: [],
        availability: []
    });

    const categories = [
        'Skin Care',
        'Makeup',
        'Hair Care',
        'Fragrances',
        'Nail Care',
        'Body Care'
    ];

    const skinTypes = [
        'Normal',
        'Oily',
        'Dry',
        'Combination',
        'Sensitive'
    ];

    const promotionTypes = [
        'New Arrivals',
        'Best Sellers',
        'On Sale'
    ];

    const availabilityOptions = [
        'In Stock',
        'Out of Stocks'
    ];

    const handleCheckboxChange = (
        category: string,
        type: keyof FilterState,
        checked: boolean
    ) => {
        setFilters(prev => ({
            ...prev,
            [type]: checked
                ? [...prev[type], category]
                : prev[type].filter(item => item !== category)
        }));
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                    <FaStar
                        key={index}
                        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                    />
                ))}
                <span className="ml-2">{rating} Star</span>
            </div>
        );
    };

    return (
        <div className="container flex mx-auto px-4 py-8">
            <Sidebar />
            <div className="flex-1">
                <aside className="w-64 p-4 bg-white border-r border-gray-200">
                    <div className="space-y-6">
                        {/* Filter Options Header */}
                        <div className="border-b pb-2">
                            <h2 className="text-lg font-semibold">Filter Options</h2>
                        </div>

                        {/* Categories */}
                        <div className="space-y-2">
                            <h3 className="font-medium">By Categories</h3>
                            {categories.map(category => (
                                <div key={category} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={category}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                        onChange={(e) => handleCheckboxChange(category, 'categories', e.target.checked)}
                                        checked={filters.categories.includes(category)}
                                    />
                                    <label htmlFor={category} className="ml-2 text-sm text-gray-600">
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Skin Type */}
                        <div className="space-y-2">
                            <h3 className="font-medium">By Skin Type</h3>
                            {skinTypes.map(type => (
                                <div key={type} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={type}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                        onChange={(e) => handleCheckboxChange(type, 'skinType', e.target.checked)}
                                        checked={filters.skinType.includes(type)}
                                    />
                                    <label htmlFor={type} className="ml-2 text-sm text-gray-600">
                                        {type}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Price Range */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Price</h3>
                            <div className="px-2">
                                <Slider
                                    range
                                    min={10}
                                    max={100}
                                    defaultValue={[10, 100]}
                                    onChange={(value: number | number[]) =>
                                        setFilters(prev => ({
                                            ...prev,
                                            priceRange: Array.isArray(value) ? [value[0], value[1]] : [value, value]
                                        }))
                                    }
                                    className="text-green-600"
                                />
                                <div className="flex justify-between mt-2 text-sm text-gray-600">
                                    <span>${filters.priceRange[0].toFixed(2)}</span>
                                    <span>${filters.priceRange[1].toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Review */}
                        <div className="space-y-2">
                            <h3 className="font-medium">Review</h3>
                            {[5, 4, 3, 2, 1].map(rating => (
                                <button
                                    key={rating}
                                    className="w-full text-left hover:bg-gray-50 p-1 rounded"
                                    onClick={() => handleCheckboxChange(rating.toString(), 'ratings', !filters.ratings.includes(rating))}
                                >
                                    {renderStars(rating)}
                                </button>
                            ))}
                        </div>

                        {/* Promotions */}
                        <div className="space-y-2">
                            <h3 className="font-medium">By Promotions</h3>
                            {promotionTypes.map(promo => (
                                <div key={promo} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={promo}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                        onChange={(e) => handleCheckboxChange(promo, 'promotions', e.target.checked)}
                                        checked={filters.promotions.includes(promo)}
                                    />
                                    <label htmlFor={promo} className="ml-2 text-sm text-gray-600">
                                        {promo}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Availability */}
                        <div className="space-y-2">
                            <h3 className="font-medium">Availability</h3>
                            {availabilityOptions.map(option => (
                                <div key={option} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={option}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                        onChange={(e) => handleCheckboxChange(option, 'availability', e.target.checked)}
                                        checked={filters.availability.includes(option)}
                                    />
                                    <label htmlFor={option} className="ml-2 text-sm text-gray-600">
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Sidebar;
