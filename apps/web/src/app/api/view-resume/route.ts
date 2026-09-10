import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing resume URL', { status: 400 });
  }

  // Case 1: Local upload file
  if (targetUrl.startsWith('/') || targetUrl.includes('/uploads/resumes/')) {
    const filename = path.basename(targetUrl);
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'resumes', filename);

    try {
      const fileBuffer = await readFile(filePath);
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'application/pdf';
      if (ext === '.doc') contentType = 'application/msword';
      if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${filename}"`,
        },
      });
    } catch {
      // If direct read fails, redirect to the public static file URL
      return NextResponse.redirect(new URL(targetUrl, req.url));
    }
  }

  // Case 2: Cloudinary URL
  if (targetUrl.includes('cloudinary.com')) {
    try {
      // Try direct fetch first
      let res = await fetch(targetUrl);

      if (!res.ok) {
        // Cloudinary blocks direct PDF downloads by default with 401 ACL error
        // Convert the PDF request to a rendered high-res image format which Cloudinary serves with 200 OK
        const fallbackUrl = targetUrl
          .replace('/image/upload/', '/image/upload/f_jpg,q_auto:best/')
          .replace(/\.pdf$/i, '.jpg');

        res = await fetch(fallbackUrl);
      }

      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const contentType = res.headers.get('content-type') || 'application/pdf';

        return new NextResponse(buffer, {
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': 'inline',
          },
        });
      }
    } catch (err) {
      console.error('Error proxying Cloudinary resume:', err);
    }
  }

  // Fallback: Redirect to the original URL directly
  return NextResponse.redirect(targetUrl);
}
