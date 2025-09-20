import React from "react";
import { NavLink } from "react-router";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isCollapsed: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, to, isCollapsed }) => (
  <NavLink to={to} title={label} className="flex items-center p-2 hover:bg-gray-700 rounded text-ellipsis whitespace-nowrap">
    <i className={`${icon}`}></i>
    {!isCollapsed && <span className="ml-2">{label}</span>}
  </NavLink>
);

export default MenuItem;