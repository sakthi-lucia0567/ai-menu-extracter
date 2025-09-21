import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [menuItems, total] = await Promise.all([
      prisma.menuItem.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          category: true,
          confidence: true,
          createdAt: true,
        },
      }),
      prisma.menuItem.count(),
    ]);

    return NextResponse.json({
      success: true,
      menuItems,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch menu items",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
