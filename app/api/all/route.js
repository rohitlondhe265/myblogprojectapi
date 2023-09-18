import dbConnect from "@/db/dbConnect";
import Category from "@/db/models/categorySchema";
import Comments from "@/db/models/commentSchema";
import Faqs from "@/db/models/faqSchema";
import Post from "@/db/models/postSchema";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();
    const posts = await Post.find();
    const faqs = await Faqs.find();
    const comments = await Comments.find();
    const categories = await Category.find();
    const res = { posts, categories, faqs, comments };
    return new NextResponse(JSON.stringify(res), { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}
