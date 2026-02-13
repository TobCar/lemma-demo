/**
 * Uploads a file to S3 via a presigned URL.
 *
 * 1. Calls /api/upload to get a presigned PUT URL and object key.
 * 2. PUTs the file directly to S3.
 * 3. Returns the S3 object key to include in subsequent API calls.
 */
export async function uploadFile(file: File): Promise<string> {
  // Step 1: Get presigned URL from our backend
  const signingResponse = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size
    })
  });

  if (!signingResponse.ok) {
    let message = "Failed to prepare upload";
    try {
      const data = await signingResponse.json();
      message = data.error || message;
    } catch {
      // Server returned non-JSON
    }
    throw new Error(message);
  }

  const { url, key } = await signingResponse.json();

  // Step 2: Upload file directly to S3
  const uploadResponse = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file
  });

  if (!uploadResponse.ok) {
    throw new Error("File upload failed");
  }

  return key;
}
