import { useState } from "react";
import { NavLink } from "react-router-dom";

interface MenuSectionProps {
  icon: string;
  label: string;
  isCollapsed: boolean;
  items: {
    label: string;
    to: string;
    icon?: string;
  }[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ icon, label, items, isCollapsed }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center w-full p-2 hover:bg-gray-700 rounded transition-all"
        title={label}
      >
        <i className={`${icon}`}></i>
        {!isCollapsed && (
          <span className="ml-2 flex-1 text-left">{label}</span>
        )}
        {!isCollapsed && (
          <i
            className={`bi bi-chevron-${open ? "up" : "down"} ml-auto text-sm`}
          ></i>
        )}
      </button>

      {/* Dropdown items */}
      {open && !isCollapsed && (
        <div className="ml-6 mt-1 flex flex-col space-y-1">
          {items.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.to}
              className="flex items-center p-2 text-sm hover:bg-gray-600 rounded"
            >
              {item.icon && <i className={`${item.icon}`}></i>}
              <span className="ml-2">{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuSection;
