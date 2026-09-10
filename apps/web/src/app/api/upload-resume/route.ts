import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Validate extension
    const ext = path.extname(file.name).toLowerCase();
    const allowed = ['.pdf', '.doc', '.docx'];
    if (!allowed.includes(ext)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format. Please upload PDF or DOC.' },
        { status: 400 }
      );
    }

    // Sanitize filename
    const safeName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_+/g, '_');
    const uniqueName = `resume_${Date.now()}_${safeName}`;

    // Write file to public/uploads/resumes
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
    const targetPath = path.join(uploadDir, uniqueName);

    await writeFile(targetPath, buffer);

    const publicUrl = `/uploads/resumes/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { success: false, error: 'Server error uploading file' },
      { status: 500 }
    );
  }
}
