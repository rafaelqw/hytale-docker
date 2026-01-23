import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const apiKey = body.key;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Fetch mod files from CurseForge API
    const response = await fetch(
      `https://api.curseforge.com/v1/mods/${id}/files?pageSize=50`,
      {
        headers: {
          Accept: 'application/json',
          'x-api-key': apiKey,
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CurseForge API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch mod files', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform files to expected format
    const files = (data.data || []).map((file: any) => ({
      id: file.id,
      displayName: file.displayName,
      fileName: file.fileName,
      releaseType: file.releaseType,
      gameVersions: file.gameVersions || [],
      downloadCount: file.downloadCount || 0,
      fileDate: file.fileDate,
    }));

    return NextResponse.json({
      id,
      files,
    });
  } catch (error) {
    console.error('CurseForge API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
