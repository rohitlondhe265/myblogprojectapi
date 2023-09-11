import dbConnect from "@/db/dbConnect";
import Category from "@/db/models/categorySchema";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  const query = {
    ...(slug && { slug }), // Include condition if provided
  };
  const options = {
    sort: { createdAt: -1 }, // Sort by date in descending order
  };
  try {
    await dbConnect();
    const category = await Category.find(query, null, options);
    return new NextResponse(JSON.stringify(category), { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  const { id, title, description, slug, metaKeywords } = body;
  const data = { title, description, slug, metaKeywords };
  try {
    await dbConnect();
    const newcategory = new Category(data);
    await newcategory.save();
    return new NextResponse("New Category Added Succesfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function PUT(request) {
  const body = await request.json();
  const { id, title, description, slug } = body;
  const data = { title, description, slug };
  try {
    await dbConnect();
    await Category.findByIdAndUpdate(id, data, { new: true });
    return new NextResponse("Fields updated successfully.", { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  try {
    await dbConnect();
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return new NextResponse("Not found", { status: 404 });
    }
    return new NextResponse("Category deleted successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}
