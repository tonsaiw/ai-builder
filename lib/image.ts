"use client";

export type ProcessedImage = {
  /** Full data URL, e.g. "data:image/jpeg;base64,...." */
  dataUrl: string;
  /** Raw base64 payload without the data URL prefix */
  base64: string;
  mediaType: "image/jpeg";
};

/**
 * Downscales an image file client-side before it's sent to the API or
 * stored, so uploads stay fast and localStorage doesn't fill up with
 * full-resolution photos.
 */
export function resizeImage(
  file: File,
  maxDimension: number,
  quality = 0.85
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image"));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const base64 = dataUrl.split(",")[1] ?? "";
        resolve({ dataUrl, base64, mediaType: "image/jpeg" });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
