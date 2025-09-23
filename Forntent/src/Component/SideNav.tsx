import { useState } from 'react';
import MenuItem from './MenuItem';
import DarkToggle from './DarkToggleBtn';

export default function TopNav() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
    <aside className={` h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-48'}`}>
        <nav className='h-full flex flex-col bg-blue-500 text-white p-4'>
            <button className='w-full' onClick={() => {
                setIsCollapsed(!isCollapsed);
                }}>
                <i className='bi bi-list text-2xl'></i>
            </button>

            <MenuItem icon="bi bi-person-circle"        label="Profile"             to="/profile"           isCollapsed={isCollapsed} />
            <MenuItem icon="bi bi-house"                label="Home"                to="/home"              isCollapsed={isCollapsed} />
            <MenuItem icon="bi bi-people"               label="Manage Users"        to="/manage-users"      isCollapsed={isCollapsed} />
            {/* <MenuItem icon="bi bi-person-fill-gear"     label="User Permissions"    to="/user-permissions"  isCollapsed={isCollapsed} /> */}
            <MenuItem icon="bi bi-calendar2-plus"       label="Book Room"           to="/book-room"         isCollapsed={isCollapsed} />
            <MenuItem icon="bi bi-person-plus"          label="Add User"            to="/add-user"          isCollapsed={isCollapsed} />
            <MenuItem icon="bi bi-door-closed"          label="Manage Rooms"        to="/manage-rooms"      isCollapsed={isCollapsed} />
            <MenuItem icon="bi bi-journal-check"        label="Bookings"            to="/bookings"          isCollapsed={isCollapsed} />
            <MenuItem icon="bi bi-person-badge"         label="Staff"               to="/staff"             isCollapsed={isCollapsed} />
            <MenuItem icon="bi bi-bar-chart"            label="Reports"             to="/reports"           isCollapsed={isCollapsed} />
            <MenuItem icon="bi bi-gear"                 label="Settings"            to="/settings"          isCollapsed={isCollapsed} />
            <MenuItem icon="bi bi-box-arrow-right"      label="Logout"              to="/login"             isCollapsed={isCollapsed} />
            <div className='h-full flex items-end p-2'>
                <DarkToggle />
            </div>
        </nav>
    </aside>
  )
}
