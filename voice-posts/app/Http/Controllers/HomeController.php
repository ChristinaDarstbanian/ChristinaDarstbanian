<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

class HomeController extends Controller
{

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index(Request $request)
    {
        $filter = $request->get("filter");

        if ($filter) {
            $tokens   = explode(".", $filter);
            $filterBy = $tokens[0];
            $param    = $tokens[1];

            // If the filter is by user then transform it to user_id
            if ($filterBy == "user" || $filterBy == "author") {
                $filterBy = "user_id";
                $param    = User::where("name", $param)->first()->id;
            }

            $posts = Post::where($filterBy, $param)->get();
        } else {
            $posts = Post::all();
        }

        return view('home', [
            "allPosts" => $posts
        ]);
    }
}
