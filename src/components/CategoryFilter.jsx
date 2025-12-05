import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const categories = [
  {
    name: "Programming & Tech",
    sub: ["Web Development", "App Development","Software Development"],
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
    <div className="bg-white border-b py-3 px-6 shadow-sm">
      <ul className="flex flex-wrap justify-center gap-4 text-[12px] font-medium text-gray-700">
        {/* All Button */}
        <li className="relative z-50">
          <button
            onClick={() => {
              setSelectedCategory("");
              navigate("/search");
            }}
            className={`flex items-center gap-1 py-2 hover:text-green-600 ${
              selectedCategory === ""
                ? "text-green-700 font-semibold"
                : "text-gray-700"
            }`}
          >
            All
          </button>
        </li>

        {/* Categories with dropdown */}
        {categories.map((cat) => (
          <li key={cat.name} className="relative group">
            <button
              onClick={() => {
                setSelectedCategory(cat.name);
                navigate(`/search?category=${encodeURIComponent(cat.name)}`);
              }}
              className={`flex items-center gap-1 py-2 hover:text-green-600 ${
                selectedCategory === cat.name
                  ? "text-green-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {cat.name}
           
            </button>

            {/* Dropdown menu */}
            <div className="absolute left-0 top-full  hidden group-hover:block z-50 bg-white border rounded shadow-md min-w-[180px]">
              {cat.sub.map((subItem) => (
                <button
                  key={subItem}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    navigate(
                      `/search?category=${encodeURIComponent(
                        cat.name
                      )}&subcategory=${encodeURIComponent(subItem)}`
                    );
                  }}
                  className="block w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100"
                >
                  {subItem}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
