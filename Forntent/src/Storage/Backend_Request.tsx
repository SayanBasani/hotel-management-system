import api from "../config";

// Account

type signup_inp = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

type Login_inp = {
  username?: string;
  email: string;
  password: string;
};

export type RoomData = {
  room_number: string;
  room_capacity: number;
  floor: number;
  status: number;
  price_per_night: number;
  location: string;
  features: {
    bed: string;
    ac: boolean;
    tv: boolean;
    wifi: boolean;
    balcony: boolean;
    bathroom: {
      type: string;
      amenities: string[];
    };
  };
};

export async function Singup_(data: signup_inp) {
  try {
    const response = await api.post("Account/signup/", data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Error response from Django (400, 401, 500, etc.)
      console.error("Signup error:", error.response.data);
      throw error.response.data; // rethrow for component
    } else if (error.request) {
      // Request made but no response
      console.error("No response from server:", error.request);
      throw { error: "No response from server" };
    } else {
      // Something went wrong before request
      console.error("Unexpected error:", error.message);
      throw { error: error.message };
    }
  }
}

export async function addUser(data: signup_inp | any) {
  try {
    const response = await api.post("Account/add-user/", data);
    console.log("add User :--- ");
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Error response from Django (400, 401, 500, etc.)
      console.error("Signup error:", error.response.data);
      throw error.response.data; // rethrow for component
    } else if (error.request) {
      // Request made but no response
      console.error("No response from server:", error.request);
      throw { error: "No response from server" };
    } else {
      // Something went wrong before request
      console.error("Unexpected error:", error.message);
      throw { error: error.message };
    }
  }
}

export async function Login_(data: Login_inp) {
  try {
    data.username = data.email;
    const response = await api.post("Account/login/", data);
    // console.log(response)
    const { access, refresh } = response.data;
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Error response from Django (400, 401, 500, etc.)
      console.error("Login error:", error.response.data);
      throw error.response.data; // rethrow for component
    } else if (error.request) {
      // Request made but no response
      console.error("No response from server:", error.request);
      throw { error: "No response from server" };
    } else {
      // Something went wrong before request
      console.error("Unexpected error:", error.message);
      throw { error: error.message };
    }
  }
}

// refresh the refresh token
export async function refreshToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token");

  const response = await api.post("Account/token/refresh/", { refresh });
  localStorage.setItem("access", response.data.access);
  return response.data.access;
}

// decode token is expire or not
export function getTokenExpiry(token: string) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000; // convert to ms
}

export async function refreshAccessToken() {
  try {
    const response = await api.post("Account/token/refresh/", {
      refresh: localStorage.getItem("refresh"), // or HttpOnly cookie if using secure way
    });
    const newAccess = response.data.access;
    localStorage.setItem("access", newAccess);
    return newAccess;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
}

// profile
export async function getOwnProfile() {
  try {
    const response = await api.get("Account/profile/");
    // console.log(response.data);  // contains user info
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

export async function getOwnPermissions() {
  try {
    const response = await api.get("Account/my-permissions/");
    return response.data;
  } catch (error) {
    console.error("Error fetching own permissions:", error);
    throw error;
  }
}

export async function getOwnRole() {
  try {
    const response = await api.get("Account/my-role/");
    return response.data;
  } catch (error) {
    console.error("Error fetching own role:", error);
    throw error;
  }
}

export async function getAllPermissions() {
  try {
    const response = await api.get("Master/permissions_list/");
    return response.data.permissions;
  } catch (error) {
    console.error("Error fetching all permissions:", error);
    throw error;
  }
}

export async function assignPermissions(email: string, permissions: string[]) {
  try {
    const response = await api.post("Master/assignpermissions/", {
      email,
      permissions,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to assign permissions:", error);
    throw error.response?.data || error;
  }
}

export async function getUserPermissions(data: { email: string }) {
  try {
    const response = await api.post(`Master/userpermissions/`, data);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get user permissions:", error);
    throw error.response?.data || error;
  }
}

// master
export async function getAllUserList() {
  try {
    const response = await api.get("Master/allusers/");
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

export async function getAllRoles() {
  try {
    const response = await api.get("Master/allroles/");
    return response.data;
  } catch (error) {
    console.error("Error fetching all roles:", error);
    throw error;
  }
}

export async function getSearchUsers(data: { query: string }) {
  try {
    const response = await api.get("Account/filter-users/?q=" + data.query);
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

export async function getUserRole(data: { email: string }) {
  try {
    const response = await api.post("Master/getUserRole/", data);
    return response.data;
  } catch (error) {
    console.error("Failed to get user roles:", error);
    throw error;
  }
}

export async function assignRoleToUser(data: { email: string; role: string }) {
  try {
    const response = await api.post("Master/assignRoleToUser/", data);
    return response.data;
  } catch (error) {
    console.error("Failed to assign role to user:", error);
    throw error;
  }
}

export async function DeleteUser(data: { email: string }) {
  try {
    const response = await api.post("Master/deleteUser/", data);
    return response.data;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
}

// Rooms
export async function AddNewRoom(data: RoomData | any) {
  try {
    const response = await api.post("Rooms/add-room/", data);
    return response.data;
  } catch (error) {
    console.error("Failed to add new room:", error);
    throw error;
  }
} 

export async function getAllRooms() {
  try {
    const response = await api.get("Rooms/all-rooms/");
    return response.data.rooms;
  } catch (error) {
    console.error("Error fetching all rooms:", error);
    throw error;
  }
}
// 📁 src/api/Rooms.ts

export async function FilterRooms(filters: Record<string, any>) {
  try {
    // build query string from filter object
    const queryString = Object.entries(filters)
      .filter(([_, v]) => v !== "" && v !== null && v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

    const url = queryString ? `Rooms/list/?${queryString}` : `Rooms/list/`;

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    throw error;
  }
}

