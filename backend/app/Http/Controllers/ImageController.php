<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Image;

use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rules\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File as LaravelFile;
use Tymon\JWTAuth\Facades\JWTAuth;

class ImageController extends Controller
{
    //

    public function uploadImage(Request $request){
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

        try {
            $validator = Validator::make($request->all(), ['image' => ['required', File::image()->max(2 * 1024)]]);
            if ($validator->fails()){
                // Validation failed
                $errors = $validator->errors();


                // Get all error messages
                $allErrors = $errors->all();

                // Now you can return or log all error messages
                return response()->json(['errors' => $allErrors], 400);


                // Get the error message for the 'image' field
                //$imageError = $errors->first('image');

                // Now you can return or log the error message
               //return response()->json(['error' => $imageError], 400);

                //return response()->json($validator->messages());
            }

            $image = new Image();
            $file = $request->file('image');
            $filename = uniqid() . "_" . $file->getClientOriginalName();

            if (!LaravelFile::exists(public_path('images'))) {
                LaravelFile::makeDirectory(public_path('images'), $mode = 0777, true, true);
            }

            $file->move(public_path('images'), $filename);

            $path = '/images/' . $filename;
            $image['url'] = $path;
            $image->save();
            $url = URL::to('/') . $path;

            return response()->json(['url' => $url, 'message' => 'Imagen guardado con éxito',], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Algo salió mal',
                'error' => $th->getMessage(),
            ], 500);
        }
    }


}
