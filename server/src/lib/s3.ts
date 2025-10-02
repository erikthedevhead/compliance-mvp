import AWS from 'aws-sdk';

const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: process.env.AWS_REGION });

export async function s3PutEvidence(key: string, contentType: string, body: Buffer) {
  const params: AWS.S3.PutObjectRequest = {
    Bucket: process.env.S3_BUCKET as string,
    Key: key,
    Body: body,
    ContentType: contentType
  };
  // Optional Object Lock headers if bucket supports it
  const lockDays = parseInt(process.env.S3_OBJECT_LOCK_DAYS || '0', 10);
  if (lockDays > 0) {
    const retainUntil = new Date(Date.now() + lockDays*24*60*60*1000);
    (params as any).ObjectLockMode = 'COMPLIANCE';
    (params as any).ObjectLockRetainUntilDate = retainUntil;
  }
  await s3.putObject(params).promise();
  return `s3://${params.Bucket}/${key}`;
}
