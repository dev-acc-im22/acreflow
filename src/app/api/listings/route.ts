import { NextRequest, NextResponse } from 'next/server';
import { mockListings } from '@/lib/mock-data';
import type { PropertyListing } from '@/types';

// In-memory store for newly created listings (persists for the lifetime of the server)
const customListings: PropertyListing[] = [];

function getAllListings(): PropertyListing[] {
  return [...mockListings, ...customListings];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse search parameters
  const category = searchParams.get('category');
  const query = searchParams.get('query')?.toLowerCase() || '';
  const propertyType = searchParams.get('propertyType');
  const bhkMin = searchParams.get('bhkMin');
  const bhkMax = searchParams.get('bhkMax');
  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
  const directOwnerOnly = searchParams.get('directOwnerOnly') === 'true';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);

  // Start with all listings
  let filtered = getAllListings();

  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter((l) => l.category === category);
  }

  // Filter by property type
  if (propertyType && propertyType !== 'all') {
    filtered = filtered.filter((l) => l.propertyType === propertyType);
  }

  // Filter by search query (title, description, locality, address)
  if (query) {
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        l.locality.toLowerCase().includes(query) ||
        l.address.toLowerCase().includes(query) ||
        l.city.toLowerCase().includes(query),
    );
  }

  // Filter by BHK range
  if (bhkMin) {
    const min = parseInt(bhkMin, 10);
    filtered = filtered.filter((l) => l.bhk >= min);
  }
  if (bhkMax) {
    const max = parseInt(bhkMax, 10);
    filtered = filtered.filter((l) => l.bhk <= max);
  }

  // Filter by price range
  if (priceMin) {
    const min = parseFloat(priceMin);
    filtered = filtered.filter((l) => l.price >= min);
  }
  if (priceMax) {
    const max = parseFloat(priceMax);
    filtered = filtered.filter((l) => l.price <= max);
  }

  // Filter by verified only
  if (verifiedOnly) {
    filtered = filtered.filter((l) => l.verified);
  }

  // Filter by direct owner only
  if (directOwnerOnly) {
    filtered = filtered.filter((l) => l.directFromOwner);
  }

  // Sort
  switch (sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    case 'area-high':
      filtered.sort(
        (a, b) => (b.superBuiltUpArea || b.carpetArea) - (a.superBuiltUpArea || a.carpetArea),
      );
      break;
    default:
      // relevance — keep default order
      break;
  }

  // Pagination
  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginatedListings = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    listings: paginatedListings,
    total,
    page,
    limit,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: PropertyListing = await request.json();

    // Basic validation — ensure required fields exist
    if (!body.title || !body.category || !body.propertyType || !body.locality) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, category, propertyType, locality',
        },
        { status: 400 },
      );
    }

    // Generate a simple unique ID if not provided
    const newListing: PropertyListing = {
      ...body,
      id: body.id || `list-custom-${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: body.updatedAt || new Date().toISOString(),
    };

    customListings.push(newListing);

    return NextResponse.json(
      {
        success: true,
        listing: newListing,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request body. Expected a valid PropertyListing JSON object.',
      },
      { status: 400 },
    );
  }
}
