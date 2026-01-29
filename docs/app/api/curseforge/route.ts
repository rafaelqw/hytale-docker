import { NextRequest, NextResponse } from 'next/server';

// Cache for Hytale game info
let hytaleGameInfo: { gameId: number; modsClassId: number } | null = null;

async function getHytaleGameInfo(apiKey: string): Promise<{ gameId: number; modsClassId: number }> {
  if (hytaleGameInfo) return hytaleGameInfo;

  // Get all games to find Hytale
  const gamesResponse = await fetch('https://api.curseforge.com/v1/games', {
    headers: {
      Accept: 'application/json',
      'x-api-key': apiKey,
    },
  });

  if (!gamesResponse.ok) {
    throw new Error('Failed to fetch games list');
  }

  const gamesData = await gamesResponse.json();
  const hytaleGame = gamesData.data.find(
    (game: { name: string; slug: string }) => 
      game.slug === 'hytale' || game.name.toLowerCase() === 'hytale'
  );

  if (!hytaleGame) {
    throw new Error('Hytale game not found');
  }

  // Get categories for Hytale to find the Mods class ID
  const categoriesResponse = await fetch(
    `https://api.curseforge.com/v1/categories?gameId=${hytaleGame.id}&classesOnly=true`,
    {
      headers: {
        Accept: 'application/json',
        'x-api-key': apiKey,
      },
    }
  );

  if (!categoriesResponse.ok) {
    throw new Error('Failed to fetch categories');
  }

  const categoriesData = await categoriesResponse.json();
  const modsCategory = categoriesData.data.find(
    (cat: { slug: string; name: string; isClass: boolean }) =>
      cat.isClass && (cat.slug === 'mods' || cat.name.toLowerCase() === 'mods')
  );

  hytaleGameInfo = {
    gameId: hytaleGame.id,
    modsClassId: modsCategory?.id || 0,
  };

  console.log('Hytale game info:', hytaleGameInfo);
  return hytaleGameInfo;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const search = body.search || '';
    const index = body.index || 0;
    const pageSize = body.pageSize || 20;
    const sortField = body.sortField || '2'; // Default to Popularity
    const apiKey = body.key;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const { gameId, modsClassId } = await getHytaleGameInfo(apiKey);

    const params = new URLSearchParams({
      gameId: String(gameId),
      sortField: String(sortField),
      sortOrder: 'desc',
      pageSize: String(pageSize),
      index: String(index),
    });

    // Only add classId if we found the mods class
    if (modsClassId) {
      params.set('classId', String(modsClassId));
    }

    if (search) {
      params.set('searchFilter', search);
    }

    const response = await fetch(`https://api.curseforge.com/v1/mods/search?${params}`, {
      headers: {
        Accept: 'application/json',
        'x-api-key': apiKey,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CurseForge API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch from CurseForge', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('CurseForge API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
