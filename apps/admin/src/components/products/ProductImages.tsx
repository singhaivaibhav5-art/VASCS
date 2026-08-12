"use client";

import { useEffect, useState } from "react";

import { getProductImageUrl } from "@/services/imageStorage";

type ProductImagesProps = {
  files: File[];
  existingImages: string[];
  onChange: (files: File[]) => void;
  onRemoveExisting: (id: string) => void;
};

export default function ProductImages({
  files,
  existingImages,
  onChange,
  onRemoveExisting,
}: ProductImagesProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [savedImageUrls, setSavedImageUrls] = useState<
    Record<string, string>
  >({});

  /*
   * ---------------------------------------------------------
   * NEW IMAGE PREVIEWS
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const urls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews(urls);

    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  /*
   * ---------------------------------------------------------
   * LOAD SAVED IMAGES FROM INDEXEDDB
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    async function loadSavedImages() {
      const urlMap: Record<string, string> = {};

      for (const imageId of existingImages) {
        try {
          const url = await getProductImageUrl(imageId);

          if (url) {
            urlMap[imageId] = url;
          }
        } catch (error) {
          console.error(
            "Failed to load product image:",
            imageId,
            error
          );
        }
      }

      if (!cancelled) {
        setSavedImageUrls(urlMap);
      } else {
        Object.values(urlMap).forEach((url) => {
          URL.revokeObjectURL(url);
        });
      }
    }

    loadSavedImages();

    return () => {
      cancelled = true;
    };
  }, [existingImages]);

  /*
   * ---------------------------------------------------------
   * CLEANUP SAVED IMAGE URLS
   * ---------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      Object.values(savedImageUrls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [savedImageUrls]);

  /*
   * ---------------------------------------------------------
   * UPLOAD IMAGES
   * ---------------------------------------------------------
   */

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (selectedFiles.length === 0) {
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length > 0) {
      onChange([...files, ...validFiles]);
    }

    event.target.value = "";
  }

  /*
   * ---------------------------------------------------------
   * REMOVE NEW IMAGE
   * ---------------------------------------------------------
   */

  function removeNewImage(index: number) {
    const updatedFiles = files.filter(
      (_, fileIndex) => fileIndex !== index
    );

    onChange(updatedFiles);
  }

  /*
   * ---------------------------------------------------------
   * REMOVE SAVED IMAGE
   * ---------------------------------------------------------
   */

  function removeSavedImage(imageId: string) {
    const url = savedImageUrls[imageId];

    if (url) {
      URL.revokeObjectURL(url);
    }

    setSavedImageUrls((previous) => {
      const updated = { ...previous };

      delete updated[imageId];

      return updated;
    });

    onRemoveExisting(imageId);
  }

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      {/* Heading */}

      <h2
        style={{
          margin: 0,
          marginBottom: "18px",
          fontSize: "20px",
          fontWeight: 600,
        }}
      >
        🖼️ Product Images
      </h2>

      {/* Upload Area */}

      <label
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "150px",
          border: "2px dashed #d1d5db",
          borderRadius: "10px",
          cursor: "pointer",
          background: "#fafafa",
        }}
      >
        <div
          style={{
            fontSize: "36px",
            marginBottom: "8px",
          }}
        >
          📷
        </div>

        <div
          style={{
            fontSize: "15px",
            fontWeight: 600,
          }}
        >
          Click to Upload Product Images
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#777",
            marginTop: "5px",
          }}
        >
          JPG, JPEG, PNG or WEBP
        </div>

        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleImageChange}
          style={{
            display: "none",
          }}
        />
      </label>

      {/* ------------------------------------------------ */}
      {/* SAVED IMAGES FROM INDEXEDDB */}
      {/* ------------------------------------------------ */}

      {existingImages.length > 0 && (
        <div
          style={{
            marginTop: "20px",
          }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: "12px",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            Saved Product Images
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "15px",
            }}
          >
            {existingImages.map((imageId, index) => {
              const imageUrl =
                savedImageUrls[imageId];

              return (
                <div
                  key={imageId}
                  style={{
                    position: "relative",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "8px",
                    background: "#ffffff",
                  }}
                >
                  {/* Actual Saved Image */}

                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`Saved Product ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "150px",
                        borderRadius: "8px",
                        background: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#666",
                        fontSize: "13px",
                        textAlign: "center",
                        padding: "10px",
                      }}
                    >
                      Loading Image...
                    </div>
                  )}

                  {/* Delete Button */}

                  <button
                    type="button"
                    onClick={() =>
                      removeSavedImage(imageId)
                    }
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      width: "30px",
                      height: "30px",
                      border: "none",
                      borderRadius: "50%",
                      background: "#DC2626",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: 700,
                    }}
                    title="Delete saved image"
                  >
                    ×
                  </button>

                  {/* Image Label */}

                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "6px",
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    Saved Image {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* NEW IMAGES */}
      {/* ------------------------------------------------ */}

      {files.length > 0 && (
        <div
          style={{
            marginTop: "20px",
          }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: "12px",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            New Images
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "15px",
            }}
          >
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                style={{
                  position: "relative",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "8px",
                  background: "#ffffff",
                }}
              >
                {/* New Image Preview */}

                {previews[index] && (
                  <img
                    src={previews[index]}
                    alt={`New Product ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      display: "block",
                    }}
                  />
                )}

                {/* Delete Button */}

                <button
                  type="button"
                  onClick={() =>
                    removeNewImage(index)
                  }
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "30px",
                    height: "30px",
                    border: "none",
                    borderRadius: "50%",
                    background: "#DC2626",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                  title="Remove new image"
                >
                  ×
                </button>

                {/* File Name */}

                <div
                  style={{
                    textAlign: "center",
                    marginTop: "6px",
                    fontSize: "12px",
                    color: "#666",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={file.name}
                >
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* IMAGE COUNT */}
      {/* ------------------------------------------------ */}

      <div
        style={{
          marginTop: "15px",
          fontSize: "13px",
          color: "#666",
        }}
      >
        {existingImages.length + files.length} image
        {existingImages.length + files.length !== 1
          ? "s"
          : ""}{" "}
        selected
      </div>
    </div>
  );
}