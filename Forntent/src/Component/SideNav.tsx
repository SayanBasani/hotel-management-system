import { useState } from 'react';
import MenuItem from './MenuItem';
import DarkToggle from './DarkToggleBtn';
import MenuSection from './MenuSection';

export default function TopNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-56'}`}>
      <nav className="h-full flex flex-col bg-blue-500 text-white p-4 overflow-y-auto">
        <button
          className="w-full mb-4"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <i className="bi bi-list text-2xl"></i>
        </button>

        {/* Basic Items */}
        <MenuItem icon="bi bi-house" label="Home" to="/home" isCollapsed={isCollapsed} />
        <MenuItem icon="bi bi-person-circle" label="Profile" to="/profile" isCollapsed={isCollapsed} />

        {/* Dropdown Sections */}
        <MenuSection
          icon="bi bi-door-closed"
          label="Manage Rooms"
          isCollapsed={isCollapsed}
          items={[
            { label: "Add Room", to: "/add-room", icon: "bi bi-plus-circle" },
            { label: "View Rooms", to: "/manage-rooms", icon: "bi bi-list-ul" },
            { label: "Bookings", to: "/room-bookings", icon: "bi bi-house-check-fill" },
            // { label: "Room Types", to: "/room-types", icon: "bi bi-grid" },
          ]}
        />

        <MenuSection
          icon="bi bi-people"
          label="Manage Users"
          isCollapsed={isCollapsed}
          items={[
            { label: "Add User", to: "/add-user", icon: "bi bi-person-plus" },
            { label: "User Roles", to: "/manage-users", icon: "bi bi-shield-lock" },
          ]}
        />

        <MenuItem icon="bi bi-journal-check" label="Bookings" to="/bookings" isCollapsed={isCollapsed} />
        <MenuItem icon="bi bi-bar-chart" label="Reports" to="/reports" isCollapsed={isCollapsed} />
        <MenuItem icon="bi bi-gear" label="Settings" to="/settings" isCollapsed={isCollapsed} />
        <MenuItem icon="bi bi-box-arrow-right" label="Logout" to="/login" isCollapsed={isCollapsed} />

        <div className="h-full flex items-end p-2 mt-auto">
          <DarkToggle />
        </div>
      </nav>
    </aside>
  );
}


// import { useState } from 'react';
// import MenuItem from './MenuItem';
// import DarkToggle from './DarkToggleBtn';

// export default function TopNav() {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     return (
//     <aside className={` h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-48'}`}>
//         <nav className='h-full flex flex-col bg-blue-500 text-white p-4'>
//             <button className='w-full' onClick={() => {
//                 setIsCollapsed(!isCollapsed);
//                 }}>
//                 <i className='bi bi-list text-2xl'></i>
//             </button>

//             <MenuItem icon="bi bi-person-circle"        label="Profile"             to="/profile"           isCollapsed={isCollapsed} />
//             <MenuItem icon="bi bi-house"                label="Home"                to="/home"              isCollapsed={isCollapsed} />
//             <MenuItem icon="bi bi-people"               label="Manage Users"        to="/manage-users"      isCollapsed={isCollapsed} />
//             {/* <MenuItem icon="bi bi-person-fill-gear"     label="User Permissions"    to="/user-permissions"  isCollapsed={isCollapsed} /> */}
//             <MenuItem icon="bi bi-calendar2-plus"       label="Book Room"           to="/book-room"         isCollapsed={isCollapsed} />
//             <MenuItem icon="bi bi-person-plus"          label="Add User"            to="/add-user"          isCollapsed={isCollapsed} />
//             <MenuItem icon="bi bi-door-closed"          label="Manage Rooms"        to="/manage-rooms"      isCollapsed={isCollapsed} />
//             <MenuItem icon="bi bi-journal-check"        label="Bookings"            to="/bookings"          isCollapsed={isCollapsed} />
//             <MenuItem icon="bi bi-person-badge"         label="Staff"               to="/staff"             isCollapsed={isCollapsed} />
//             <MenuItem icon="bi bi-bar-chart"            label="Reports"             to="/reports"           isCollapsed={isCollapsed} />
//             <MenuItem icon="bi bi-gear"                 label="Settings"            to="/settings"          isCollapsed={isCollapsed} />
//             <MenuItem icon="bi bi-box-arrow-right"      label="Logout"              to="/login"             isCollapsed={isCollapsed} />
//             <div className='h-full flex items-end p-2'>
//                 <DarkToggle />
//             </div>
//         </nav>
//     </aside>
//   )
// }
