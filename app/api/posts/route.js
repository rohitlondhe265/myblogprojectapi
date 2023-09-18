import dbConnect from "@/db/dbConnect";
import Category from "@/db/models/categorySchema";
import Post from "@/db/models/postSchema";
import { NextResponse } from "next/server";

async function getCatId(slug) {
  await dbConnect();
  const category = await Category.findOne({ slug });
  return category._id;
}
export async function GET(request) {
  const url = new URL(request.url);

  const slug = url.searchParams.get("category");
  const search = url.searchParams.get("search");
  const page = parseInt(url.searchParams.get("page")) || 1;
  const perPage = parseInt(url.searchParams.get("perPage")) || 6;
  let category;
  if (slug) {
    category = await getCatId(slug);
  }
  const query = {
    ...(category && { category }), // Include category condition if provided
    ...(search && { metaKeywords: { $regex: search, $options: "i" } }), // Include tag condition using regex
  };
  const populateOptions = [{ path: "category", select: "title" }];
  const options = {
    select: "title banner category metaDescription slug updatedAt createdAt",
    populate: populateOptions,
    skip: (page - 1) * perPage,
    limit: perPage,
    sort: { createdAt: -1 }, // Sort by date in descending order
  };

  try {
    await dbConnect();
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query, null, options);
    const res = { total, perPage, page, posts };
    return new NextResponse(JSON.stringify(res), { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  try {
    await dbConnect();
    const newPost = new Post(body);
    await newPost.save();
    return new NextResponse("Post inserted successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    await Post.deleteMany();
    return new NextResponse("Posts deleted successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}
