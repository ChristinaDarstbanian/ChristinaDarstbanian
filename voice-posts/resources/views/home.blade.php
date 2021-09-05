@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                @foreach($allPosts as $post)
                    <div class="card mb-4" style="width: 100%">
                        <div class="card-body position-relative">
                            <h3 class="card-title d-inline"
                                data-author="{{ strtolower($post->user->name) }}">{{ $post->title  }}</h3>
                            <small>By {{ $post->user->name }} </small>
                            <small class="position-absolute"
                                   style="right: 20px;"
                                   title="{{ $post->created_at  }}">{{ $post->created_at->diffForHumans() }}</small>
                            <br/>
                            <br/>
                            <p class="card-text" data-title="{{ strtolower($post->title) }}">{{ $post->content  }}</p>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
@endsection
