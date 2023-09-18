import dbConnect from "@/db/dbConnect";
import Post from "@/db/models/postSchema";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug } = params;
  try {
    await dbConnect();
    // const post = await Post.findOne({ slug });
    const populateOptions = [
      { path: "category", select: "title" },
      { path: "faqs", select: "question answer" },
      { path: "comments", select: "content user email" },
    ];
    const post = await Post.findOne({ slug }).populate(populateOptions);
    if (!post) {
      return new NextResponse("Not found", { status: 404 });
    }
    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { slug } = params;
  const body = await request.json();

  try {
    await dbConnect();
    await Post.findOneAndUpdate({ slug }, body, { new: true });
    return new NextResponse("Fields updated successfully.", { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { slug } = params;

  try {
    await dbConnect();
    const deletedPost = await Post.findOneAndDelete({ slug });
    if (!deletedPost) {
      return new NextResponse("Not found", { status: 404 });
    }
    return new NextResponse("Post deleted successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}
