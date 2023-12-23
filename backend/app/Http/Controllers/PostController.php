<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Storage;

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

        // Add the user's username to each post.
        foreach ($posts as $post) {
            $post->userName = $post->user->userName;
        }

        // Add the post's likes and their data to each post.
        foreach ($posts as $post) {
            $post->likes = $post->likes()->get();
        }

        // Add the post's comments and their data to each post.
        foreach ($posts as $post) {
            $post->comments = $post->comments()->get();
        }

        // Add the post's Image to each post.
        foreach ($posts as $post) {
            $post->image = $post->image()->get();
        }




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
            'image' => ['required' , 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
        ], [
            'title.required' => 'El título es requerido.',
            'description.required' => 'La descripción es requerida.',
            'image.required' => 'La imágen es requerida.',

        ]);

        try {


            $file = $request->file('image');
            $name =  uniqid() . "_" . $file->getClientOriginalName();

            $path = Storage::putFileAs('public/images', $file, $name);


            // Creamos el post
            $post = Post::create([
                'title' => $request->title,
                'description' => $request->description,
                'user_id' => $user->id,
                'pathPhoto' => $path,
                'likesCount' => 0,
                'commentsCount' => 0,
            ]);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'message' => 'Algo salió mal',
                'error' => $th->getMessage(),
            ], 500);
        }
        // Retornamos la respuesta
        return response()->json([
            'message' => 'Publicación creada exitosamente.',
        ], 200);
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
