import dbConnect from "@/db/dbConnect";
import Comments from "@/db/models/commentSchema";
import Post from "@/db/models/postSchema";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();
    const comments = await Comments.find();
    return new NextResponse(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function POST(request) {
  const { id, ...data } = await request.json();
  try {
    await dbConnect();
    const post = await Post.findById(id);
    if (!post) {
      return new NextResponse("Post Not found", { status: 404 });
    }
    const comment = new Comments(data);
    await comment.save();
    post.comments.push(comment);
    await post.save();
    return new NextResponse("FAQ inserted successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function PUT(request) {
  const { id, ...data } = await request.json();

  try {
    await dbConnect();
    await Comments.findByIdAndUpdate(id, data, { new: true });
    return new NextResponse("Fields updated successfully.", { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function DELETE(request) {
  const { id } = await request.json();
  try {
    await dbConnect();
    const deletedPost = await Comments.findByIdAndDelete(id);
    if (!deletedPost) {
      return new NextResponse("Not found", { status: 404 });
    }
    return new NextResponse("Post deleted successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}
