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
            $token = str_replace('Bearer ', '', $request->header('Authorization'));
            $user = JWTAuth::toUser($token);
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
    public function updateLikes(UpdatePostRequest $request, int $id)
    {
        //

        try{
            DB::beginTransaction();
            $post = Post::find($id);
             if(!$post){
                return response()->json([
                'message' => 'No se encontró el post',
                ], 404);
                 }
            $updateLikes = $post->likesCount + 1;
            $post->update([
                'likesCount' => $updateLikes,
            ]);
            DB::commit();
            return response()->json([
                'message' => 'Se actualizó el post',
                'post' => $post,
            ], 200);
        }
        catch (JWTException $e) {
            // Retornamos la respuesta
            return response()->json([
                'message' => 'Oops ha ocurido un error...',
            ], 500);
        }

    }







}
