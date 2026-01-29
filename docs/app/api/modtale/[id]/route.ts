import { NextRequest, NextResponse } from 'next/server';

const MODTALE_API_BASE = 'https://api.modtale.net';

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

    const response = await fetch(`${MODTALE_API_BASE}/api/v1/projects/${id}`, {
      headers: {
        Accept: 'application/json',
        'X-MODTALE-KEY': apiKey,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Modtale API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch project details', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform versions to expected format
    const versions = (data.versions || []).map((v: any) => ({
      version: v.versionNumber || v.version,
      fileName: v.fileName || `${data.title}-${v.versionNumber}.jar`,
      fileSize: v.fileSize || 0,
      releaseDate: v.createdAt || v.releaseDate,
    }));

    return NextResponse.json({
      id: data.id,
      versions,
    });
  } catch (error) {
    console.error('Modtale API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
