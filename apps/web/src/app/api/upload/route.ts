import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeErrorResponse } from "@/lib/api/errors";
import { MAX_FILE_SIZE } from "@/data/onboarding/maxFileSize";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp"
];

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { fileName: string; contentType: string; fileSize: number };
  try {
    body = await request.json();
  } catch {
    return safeErrorResponse("Invalid request body", 400);
  }

  if (!body.fileName || !body.contentType || !body.fileSize) {
    return safeErrorResponse(
      "fileName, contentType, and fileSize are required",
      400
    );
  }

  if (body.fileSize > MAX_FILE_SIZE) {
    return safeErrorResponse("File too large. Maximum size is 10 MB.", 400);
  }

  if (!ALLOWED_TYPES.includes(body.contentType)) {
    return safeErrorResponse("File type not allowed", 400);
  }

  const key = `uploads/${user.id}/${Date.now()}-${body.fileName}`;

  // TODO: Generate a real presigned PUT URL using the AWS SDK:
  //
  // import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
  // import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  //
  // const s3 = new S3Client({ region: process.env.AWS_REGION });
  // const command = new PutObjectCommand({
  //   Bucket: process.env.S3_BUCKET,
  //   Key: key,
  //   ContentType: body.contentType,
  // });
  // const url = await getSignedUrl(s3, command, { expiresIn: 300 });

  const url = `https://${process.env.S3_BUCKET ?? "my-bucket"}.s3.amazonaws.com/${key}`;

  console.log("Presigned upload URL generated for:", body.fileName);

  return NextResponse.json({ url, key });
}
