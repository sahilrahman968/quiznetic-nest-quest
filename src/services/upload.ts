
const API_BASE_URL = "http://localhost:3001";

export const uploadFile = async (file: File): Promise<{ uploadUrl: string; fileUrl: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export function getUploadUrl() {
  // Mock implementation
  return Promise.resolve({ uploadUrl: 'https://example.com/upload', fileUrl: 'https://example.com/file.jpg', url: 'https://example.com/upload', key: 'file-key' });
}
