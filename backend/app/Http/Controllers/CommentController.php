<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Post;
use Tymon\JWTAuth\Facades\JWTAuth;


class CommentController extends Controller
{
    //

    public function store(Request $request, $postId)
    {
        try {
            $user = JWTAuth::user();
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'El token no es válido'], 400);
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'El token ha caducado'], 400);
        } catch (Exception $e) {
            return response()->json(['error' => 'Algo salió mal'], 500);
        }

        $request->validate([
            'text' => 'required',
        ], [
            'text.required' => 'El texto es requerido.',
        ]);

        $post = Post::findOrFail($postId);

        $comment = Comment::create([
            'text' => $request->text,
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);

        $comment->save();

        return response()->json(['message' => 'Comment created successfully', 'comment' => $comment], 201);
    }

}
