
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Programming & Tech",
    sub: ["Web Development", "App Development", "Automation"],
  },
  {
    name: "Marketing & Sales",
    sub: ["Email Marketing", "Social Media", "SEO"],
  },
  {
    name: "Photography & Editing",
    sub: ["Photo Editing", "Retouching", "Color Grading"],
  },
  {
    name: "Graphics & Design",
    sub: ["Logo Design", "Branding", "Illustration"],
  },
  {
    name: "Virtual Assistant",
    sub: ["Admin Tasks", "Data Entry", "Scheduling"],
  },
  {
    name: "Content Writing",
    sub: ["Blogs", "Product Descriptions", "Proofreading"],
  },
  {
    name: "UI/UX Design",
    sub: ["Wireframes", "Prototypes", "User Research"],
  },
  {
    name: "Customer Support",
    sub: ["Live Chat", "Email Support", "CRM Management"],
  },
];

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <ul className="flex flex-wrap gap-4 text-sm font-medium">
        {categories.map((cat) => (
          <li key={cat.name} className="relative group cursor-pointer">
            <button
              onClick={() => {
                setSelectedCategory(cat.name);
                const categoryParam = cat.name ? `category=${cat.name}` : "";
                navigate(`/search?${categoryParam}`);
              }}
              className={`px-4 py-2 rounded hover:bg-gray-100 transition ${
                selectedCategory === cat.name
                  ? " text-white"
                  : "text-gray-700"
              }`}
            >
              {cat.name}
            </button>

            {/* Subcategories on hover */}
            <ul className="absolute hidden group-hover:block top-full left-0 bg-white shadow-lg border rounded z-10 min-w-[180px]">
              {cat.sub.map((subItem) => (
                <li key={subItem}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      const categoryParam = cat.name ? `category=${cat.name}` : "";
                      navigate(
                        `/search?${categoryParam}&subcategory=${encodeURIComponent(
                          subItem
                        )}`
                      );
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-600"
                  >
                    {subItem}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
