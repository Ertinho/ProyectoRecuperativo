<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Tymon\JWTAuth\Facades\JWTAuth;

class PostController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::whereHas('user', function ($query) {
            $query->where('status', 'active');
        })->orderBy('created_at', 'desc')->get();

        return response()->json($posts, 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Validamos los datos
        $request->validate([
            'title' => ['required', 'max:255'],
            'description' => ['required'],
            'pathPhoto' => ['required'],
        ], [
            'title.required' => 'El título es requerido',
            'description.required' => 'La descripción es requerida',
            'pathPhoto.required' => 'La foto es requerida',
        ]);

        // Creamos el post
        $post = Post::create([
            'title' => $request->title,
            'description' => $request->description,
            'user_id' => $user->id,
            'pathPhoto' => $request->pathPhoto,
            'likesCount' => 0,
            'commentsCount' => 0,
        ]);


        // Retornamos la respuesta
        return response()->json([
            'message' => 'Post creado exitosamente',
            'post' => $post
        ], 201);
    }



    /**
     * Update the specified resource in storage.
     */
    public function updateLikes(Request $request, int $postId)
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

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // buscamos el post
        $post = Post::findOrFail($postId);
        if(!$post){
            return response()->json([
            'message' => 'No se encontró el post',
            ], 404);
        }

        // vemos si el usuario ya le dio like a este post
        $liked = $post->likes()->where('user_id', $user->id)->first();
        if ($liked) {
            //vemos si el liked es true
            if($liked->liked == true){
                // Actualizamos el post con un like menos
                //obtenemos el numero de likes
                $likes = $post->likesCount - 1;
                $post->update([
                    'likesCount' => $likes,
                ]);

                // actualizamos el like con liked = false
                $liked->update([
                    'liked' => false,
                ]);

                // Retornamos la respuesta
                return response()->json([
                    'message' => 'Se actualizó el post',
                    'post' => $post,
                ], 200);
            }else{
                // Actualizamos el post con un like más
                //obtenemos el numero de likes
                $likesCount = $post->likesCount + 1;
                $post->update([
                    'likesCount' => $likesCount,
                ]);

                // actualizamos el like con liked = true
                $liked->update([
                    'liked' => true,
                ]);

                // Retornamos la respuesta
                return response()->json([
                    'message' => 'Se actualizó el post',
                    'post' => $post,
                ], 200);
            }
        }else{
            // Actualizamos el post con un like más
            //obtenemos el numero de likes
            $likesCount = $post->likesCount + 1;
            $post->update([
                'likesCount' => $likesCount,
            ]);

            // Creamos el like
            $post->likes()->create([
                'user_id' => $user->id,
                'liked' => true,
                'post_id' => $post->id,
            ]);

            // Retornamos la respuesta
            return response()->json([
                'message' => 'Se actualizó el post',
                'post' => $post,
            ], 200);
        }

    }

    public function showLikes($id)
    {
        $post = Post::withCount('likes')->find($id);

        return response()->json([
            'post' => $post,
            'likesCount' => $post->likesCount,
        ]);
    }

}
