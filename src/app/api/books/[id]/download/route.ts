// src/app/api/books/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookId = params.id;
    
    // Get book data from your database
    const book = await getBookById(bookId);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // If book has a file path in uploads folder
    if (book.filePath && book.filePath.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), 'public', book.filePath);
      
      // Check if file exists
      if (!existsSync(filePath)) {
        console.error('File not found:', filePath);
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }

      try {
        const fileBuffer = await readFile(filePath);
        const filename = `${book.title}.${book.format?.toLowerCase() || 'pdf'}`.replace(/[^a-zA-Z0-9.-]/g, '_');
        
        // Convert Buffer to Uint8Array for proper TypeScript compatibility
        const uint8Array = new Uint8Array(fileBuffer);
        
        // Return the file with proper headers using Response instead of NextResponse
        return new Response(uint8Array, {
          status: 200,
          headers: {
            'Content-Type': getContentType(book.format),
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': fileBuffer.length.toString(),
            'Cache-Control': 'public, max-age=3600',
          },
        });
      } catch (error) {
        console.error('Error reading file:', error);
        return NextResponse.json(
          { error: 'Error reading file' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'File not available for download' },
      { status: 404 }
    );
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    );
  }
}

// Helper function to determine content type
function getContentType(format?: string): string {
  const formatLower = format?.toLowerCase();
  
  switch (formatLower) {
    case 'pdf':
      return 'application/pdf';
    case 'epub':
      return 'application/epub+zip';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'txt':
      return 'text/plain';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    default:
      return 'application/octet-stream';
  }
}

// Mock function - replace with your actual database call
async function getBookById(bookId: string) {
  try {
    // Replace this with your actual database query
    // Example using your API client:
    // const response = await apiClient.getBook(bookId);
    // return response.data;
    
    // For now, return a mock book
    return {
      id: bookId,
      title: 'Sample Book',
      format: 'PDF',
      filePath: '/uploads/sample.pdf' // Path to file in uploads folder
    };
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
}

// Also handle POST requests if needed
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return GET(req, { params });
}