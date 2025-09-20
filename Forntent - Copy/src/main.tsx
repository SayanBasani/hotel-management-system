import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Home from './pages/Home.tsx';
import Layout from './pages/Layout.tsx';
import { StorageProvider } from './Storage/StorageProvider.tsx';
import Profile from './pages/Profile.tsx';
import ProtectRout from './Storage/ProtectRout.tsx';
import Login from './pages/Accounts/Login.tsx';
import Signup from './pages/Accounts/Singup.tsx';
import AddUser from './pages/AddUser.tsx';
import ManageUsers from './pages/ManageUsers.tsx';
import UserPermissions from './pages/UserPermissions.tsx';

const router = createBrowserRouter([
  {
    path:"/",
    element: <ProtectRout><Layout /></ProtectRout>,
    children:[
      {
        path: "",
        element: <Home />
      },
      {
        path: "home",
        element: <Home />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "add-user",
        element: <AddUser />
      },
      {
        path: "manage-users",
        element: <ManageUsers />
      },
      {
        path: "user-permissions",
        element: <UserPermissions />
      },
      {
        path:"*",
        element:<div className='p-4'>404 Not Found</div>
      }
    ],
  },
  {
    path:"/signup",
    element:<Signup />
  },
  {
    path:"/login",
    element:<Login />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StorageProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </StorageProvider>,
)
