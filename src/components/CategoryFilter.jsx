import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Or any arrow icons

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
  const scrollRef = useRef(null);

  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += offset;
    }
  };

  return (
    <div className="relative bg-white border-b py-4 px-2">
      {/* ⬅️ Left Arrow */}
      <button
        onClick={() => scroll(-150)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow hover:bg-gray-100"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {/* Category List */}
      <div
        ref={scrollRef}
        className="overflow-x-auto no-scrollbar scroll-smooth"
      >
        <ul className="flex gap-3 text-sm font-medium whitespace-nowrap px-8">
          {/* All Button */}
          <li>
            <button
              onClick={() => {
                setSelectedCategory("");
                navigate("/search");
              }}
              className={`px-4 py-2 rounded hover:bg-gray-100 transition ${
                selectedCategory === ""
                  ? "text-white bg-green-700"
                  : "text-gray-700"
              }`}
            >
              All
            </button>
          </li>

          {/* Category Items */}
          {categories.map((cat) => (
            <li key={cat.name} className="relative group cursor-pointer">
              <button
                onClick={() => {
                  setSelectedCategory(cat.name);
                  navigate(`/search?category=${encodeURIComponent(cat.name)}`);
                }}
                className={`px-4 py-2 rounded hover:bg-gray-100 transition ${
                  selectedCategory === cat.name
                    ? "text-white bg-green-700"
                    : "text-gray-700"
                }`}
              >
                {cat.name}
              </button>

              {/* Dropdown */}
              <ul className="absolute hidden group-hover:block top-full left-0 bg-white shadow-lg border rounded z-10 min-w-[180px]">
                {cat.sub.map((subItem) => (
                  <li key={subItem}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        navigate(
                          `/search?category=${encodeURIComponent(
                            cat.name
                          )}&subcategory=${encodeURIComponent(subItem)}`
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

      {/* ➡️ Right Arrow */}
      <button
        onClick={() => scroll(150)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow hover:bg-gray-100"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export default CategoryFilter;
