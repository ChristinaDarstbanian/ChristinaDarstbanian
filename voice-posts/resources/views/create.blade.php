@extends('layouts.app')

@section("content")
    <div class="container mw-100">
        <div class="row justify-content-center" style="min-width: 600px">
            <form method="post" action="{{url("/create")}}">
                @csrf
                <h1>Create a new post</h1>

                <div class="form-group">
                    <label for="title">Title</label>
                    <input name="title" type="text" class="form-control" id="title" aria-describedby="emailHelp"
                           placeholder="Post title..." style="width: 700px; font-size: 20px;"/>
                </div>
                <div class="form-group">
                    <label for="content">Content</label>
                    <textarea name="content" class="form-control" id="content" placeholder="Content..."></textarea>
                </div>
                <button type="submit" class="btn btn-dark">Submit</button>
            </form>
        </div>
    </div>
@endsection
