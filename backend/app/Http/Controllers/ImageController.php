<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Image;

use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rules\File;
use Illuminate\Support\Facades\Validator;


class ImageController extends Controller
{
    //

    public function uploadImage(Request $request){
        $validator = Validator::make($request->all(), ['image' => ['required', File::image()->max(2 * 1024)]]);
        if ($validator->fails()){
            return response()->json($validator->messages());
        }

        $image = new Image();
        $file = $request->file('image');
        $filename = uniqid() . "_" . $file->getClientOriginalName();
        $file->move(public_path('images'), $filename);
        $path = '/images/' . $filename;
        $image['url'] = $path;
        $image->save();
        $url = URL::to('/') . $path;

        return response()->json(['isSuccess' => true, 'url' => $url]);
    }


}
