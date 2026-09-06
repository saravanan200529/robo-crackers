import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { auth } from '@/lib/auth';

// Maximum upload sizes: 10MB for images, 50MB for videos
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized — Admin session required' }, { status: 401 });
    }

    const formData = await req.formData();

    const files = formData.getAll('files') as File[];
    const folder = (formData.get('folder') as string) || 'products';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedUrls: { url: string; name: string; size: number; isVideo: boolean }[] = [];

    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not supported. Allowed: JPG, PNG, WEBP, GIF, MP4` },
          { status: 400 }
        );
      }

      const isVideo = file.type.startsWith('video/');
      const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds max allowed size of ${isVideo ? '50MB' : '10MB'}` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || (isVideo ? '.mp4' : '.webp');
      const sanitizedName = file.name
        .replace(ext, '')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-');
      const fileName = `${sanitizedName}-${Date.now()}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${folder}/${fileName}`;
      uploadedUrls.push({
        url: publicUrl,
        name: file.name,
        size: file.size,
        isVideo,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedUrls,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload files' },
      { status: 500 }
    );
  }
}
