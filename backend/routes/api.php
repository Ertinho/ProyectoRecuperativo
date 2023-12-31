<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ImageController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/



// Public routes
Route::post('login', [UserController::class, 'login']);
Route::post('register', [UserController::class, 'register']);



// Protected routes
Route::group(['middleware' => ['jwt.auth']], function() {
    //Route::get('user-profile', 'App\Http\Controllers\UserController@getProfile');
    // Other protected routes...

    Route::get('profile', [UserController::class, 'me']);
    Route::get('refresh', [UserController::class, 'refresh']);
    Route::post('createPost', [PostController::class, 'store']);
    Route::post('upload', [ImageController::class, 'uploadImage']);
    Route::get('posts', [PostController::class, 'index']);

    //update
    Route::put('profile', [UserController::class, 'updateProfile']);
    //make a comment
    Route::post('posts/{postId}/comments', [CommentController::class, 'store']);
    //like a post
    Route::post('posts/{postId}/like', [PostController::class, 'updateLikes']);
    //show the likes of a post
    Route::get('posts/{postId}/like', [PostController::class, 'showLikes']);
});



