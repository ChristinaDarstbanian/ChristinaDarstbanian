<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CreateController extends Controller
{

    public function create(Request $request)
    {
        $title   = $request->get("title");
        $content = $request->get("content");

        $post          = new Post();
        $post->title   = $title;
        $post->content = $content;
        $post->user_id = Auth::user()->id;
        $post->upvotes = 0;
        $post->save();
        return redirect("/");
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('create');
    }
}
