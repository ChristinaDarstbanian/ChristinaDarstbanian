<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

class HomeController extends Controller
{

    /**
     * Show the application dashboard.
     */
    public function index(Request $request)
    {
        $filter = $request->get("filter");

        if ($filter) {
            $tokens   = explode(".", $filter);
            $filterBy = $tokens[0];
            $param    = $tokens[1];

            // If the filter is by user then transform it to user_id
            if (strtolower($filterBy) == "user" || strtolower($filterBy) == "author") {
                $filterBy = "user_id";
                $param    = User::where("name", $param)->first()->id;
            }

            try {
                $posts = Post::where($filterBy, $param)->orderBy('created_at', 'desc')->get();
            } catch (\Exception $e) {
                return redirect()->back()->withErrors(["filter" => "Invalid filter <b>$filterBy</b>"]);
            }

        } else {
            $posts = Post::latest()->get();
        }

        return view('home', [
            "allPosts" => $posts
        ]);
    }
}
