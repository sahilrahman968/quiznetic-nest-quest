
import { toast } from "sonner";
import { Teacher } from "@/types/api";

const API_BASE_URL = "http://localhost:3001";

export const login = async (
  email: string,
  password: string
): Promise<{ teacher: Teacher; token: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("teacher", JSON.stringify(data.teacher));
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("teacher");
  toast("Logged out successfully!");
};

export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

export function getLoggedInTeacher() {
  const teacherData = localStorage.getItem('teacher');
  return teacherData ? JSON.parse(teacherData) : null;
}
