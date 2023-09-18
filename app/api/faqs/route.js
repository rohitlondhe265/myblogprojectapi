import dbConnect from "@/db/dbConnect";
import Faqs from "@/db/models/faqSchema";
import Post from "@/db/models/postSchema";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();
    const faqs = await Faqs.find();
    return new NextResponse(JSON.stringify(faqs), { status: 200 });
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
    const faq = new Faqs(data);
    await faq.save();
    post.faqs.push(faq);
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
    await Faqs.findByIdAndUpdate(id, data, { new: true });
    return new NextResponse("Fields updated successfully.", { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function DELETE(request) {
  const { id } = await request.json();
  try {
    await dbConnect();
    const deletedPost = await Faqs.findByIdAndDelete(id);
    if (!deletedPost) {
      return new NextResponse("Not found", { status: 404 });
    }
    return new NextResponse("Post deleted successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}
