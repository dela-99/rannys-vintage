import { authService } from "@/services/authService";

export interface CloudinaryUploadResult {
  url: string;
  optimizedUrl: string;
  publicId: string;
  width?: number;
  height?: number;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export function validateImageFiles(files: File[]) {
  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      throw new Error(`${file.name} is not an image file.`);
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`${file.name} is larger than 5MB.`);
    }
  }
}

export async function uploadProductImages(files: File[], onProgress?: (progress: number) => void) {
  if (files.length === 0) {
    return [];
  }

  validateImageFiles(files);

  const token = await authService.createJwt();
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  formData.append("folder", "rannys-clothing/products");

  return new Promise<CloudinaryUploadResult[]>((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    };

    request.onload = () => {
      try {
        const response = JSON.parse(request.responseText) as {
          success?: boolean;
          images?: CloudinaryUploadResult[];
          message?: string;
        };

        if (request.status >= 200 && request.status < 300 && response.success) {
          resolve(response.images ?? []);
          return;
        }

        reject(new Error(response.message || "Image upload failed."));
      } catch {
        reject(new Error("Image upload failed."));
      }
    };

    request.onerror = () => reject(new Error("Image upload failed."));
    request.open("POST", "/api/uploads");
    request.setRequestHeader("Authorization", `Bearer ${token}`);
    request.send(formData);
  });
}
