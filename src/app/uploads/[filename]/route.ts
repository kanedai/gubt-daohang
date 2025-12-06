import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile, stat } from "fs/promises";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const filename = (await params).filename;

    // Prevent directory traversal
    if (filename.includes("..") || filename.includes("/")) {
        return new NextResponse("Invalid filename", { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    try {
        // Check if file exists
        await stat(filePath);

        // Read file
        const fileBuffer = await readFile(filePath);

        // Determine content type (simple version)
        const ext = path.extname(filename).toLowerCase();
        let contentType = "application/octet-stream";

        const mimeTypes: Record<string, string> = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".svg": "image/svg+xml",
            ".ico": "image/x-icon"
        };

        if (mimeTypes[ext]) {
            contentType = mimeTypes[ext];
        }

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable"
            }
        });

    } catch (error) {
        return new NextResponse("File not found", { status: 404 });
    }
}
