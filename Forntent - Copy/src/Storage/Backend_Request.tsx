import api from "../config";

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

export async function Login_(data: Login_inp) {
  try {
    data.username = data.email
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
    const response = await api.post("/Account/token/refresh/", {
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
    console.log(response.data);  // contains user info
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

export async function getAllUserList() {
  try {
    const response = await api.get("Master/allusers/");
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
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