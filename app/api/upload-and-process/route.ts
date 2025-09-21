import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractMenuFromText } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.name.endsWith(".txt")) {
      return NextResponse.json(
        { error: "Please upload a .txt file" },
        { status: 400 }
      );
    }

    // Read file content
    const content = await file.text();
    console.log("File content length:", content.length);

    // Process with Gemini AI
    let menuItems: any[] = [];
    try {
      menuItems = await extractMenuFromText(content);
      console.log("Extracted menu items:", menuItems);
    } catch (aiError) {
      console.error("AI processing error:", aiError);
      return NextResponse.json(
        { error: "Failed to process with AI" },
        { status: 500 }
      );
    }

    // Save to database
    const savedItems = [];
    for (const item of menuItems) {
      try {
        const savedItem = await prisma.menuItem.create({
          data: {
            name: item.name || "Unknown Item",
            description: item.description || null,
            price: item.price ? parseFloat(item.price) : null,
            category: item.category || "Uncategorized",
            extractedData: item,
            confidence: item.confidence || null,
          },
        });
        savedItems.push(savedItem);
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed successfully. Extracted ${savedItems.length} menu items.`,
      menuItems: savedItems,
      totalFound: menuItems.length,
      savedCount: savedItems.length,
    });
  } catch (error) {
    console.error("Upload and process error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
