// server/src/lib/s3.ts (AWS SDK v3)
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function s3PutEvidence(
  key: string,
  contentType: string,
  body: Buffer
) {
  const bucket = process.env.S3_BUCKET as string;
  const lockDays = parseInt(process.env.S3_OBJECT_LOCK_DAYS || "0", 10);
  const params: any = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  };
  if (lockDays > 0) {
    params.ObjectLockMode = "COMPLIANCE";
    params.ObjectLockRetainUntilDate = new Date(Date.now() + lockDays * 864e5);
  }
  await s3.send(new PutObjectCommand(params));
  return `s3://${bucket}/${key}`;
}
