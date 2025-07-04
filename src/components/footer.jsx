import React from "react";

const Footer = () => {
  const footerLinks = {
    Categories: [
      "Graphics & Design",
      "Digital Marketing",
      "Writing & Translation",
      "Video & Animation",
      "Music & Audio",
      "Programming & Tech",
      "AI Services",
      "Consulting",
      "Data",
      "Business",
      "Personal Growth & Hobbies",
      "Photography",
      "Finance",
      "End-to-End Projects",
      "Service Catalog",
    ],
    "For Clients": [
      "How Fiverr Works",
      "Customer Success Stories",
      "Trust & Safety",
      "Quality Guide",
      "Fiverr Learn – Online Courses",
      "Fiverr Guides",
      "Fiverr Answers",
    ],
    "For Freelancers": [
      "Become a Fiverr Freelancer",
      "Become an Agency",
      "Freelancer Equity Program",
      "Community Hub",
      "Forum",
      "Events",
    ],
    "Business Solutions": [
      "Fiverr Pro",
      "Project Management Service",
      "Expert Sourcing Service",
      "ClearVoice – Content Marketing",
      "Working Not Working – Creative Talent",
      "AutoDS – Dropshipping Tool",
      "AI store builder",
      "Fiverr Logo Maker",
      "Contact Sales",
      "Fiverr Go",
    ],
    Company: [
      "About Fiverr",
      "Help & Support",
      "Social Impact",
      "Careers",
      "Terms of Service",
      "Privacy Policy",
      "Do not sell or share my personal information",
      "Partnerships",
      "Creator Network",
      "Affiliates",
      "Invite a Friend",
      "Press & News",
      "Investor Relations",
    ],
  };

  return (
    <footer className="bg-white border-t text-sm text-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h3 className="font-semibold mb-3">{title}</h3>
            <ul className="space-y-2">
              {links.map((link, i) => (
                <li key={i} className="hover:underline cursor-pointer">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t py-4 px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 max-w-7xl mx-auto">
        <div className="mb-2 md:mb-0">© Fiverr International Ltd. 2025</div>
        <div className="flex gap-3 text-gray-600 text-xl">
          {/* Replace with icons or images as needed */}
          <i className="fab fa-tiktok" />
          <i className="fab fa-instagram" />
          <i className="fab fa-linkedin" />
          <i className="fab fa-facebook" />
          <i className="fab fa-pinterest" />
          <i className="fab fa-x-twitter" />
          <i className="fab fa-apple" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
