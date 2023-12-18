<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Skill;
use App\Models\ProgrammingLanguage;
use App\Models\TransversalSkill;
use Tymon\JWTAuth\Facades\JWTAuth;


class UserController extends Controller
{

    public function register(Request $request){
        $request->validate([
            'name' => ['required', 'min:5'],
            'email' =>['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8', 'max:15', 'alpha_num'],
            'userName' => ['required', 'min:4'],
            'lastName' => ['required', 'min:5'],
            'birthDate' => ['required', 'date'],
            'skills' => ['required', 'array', 'min:3'],
            'skills.*.name' => ['required'],

            'programmingLanguages' => ['required', 'array', 'min:1'],
            'programmingLanguages.*.name' => ['required'],

            'transversalSkills' => ['required', 'array', 'min:2'],
            'transversalSkills.*.name' => ['required'],
        ], [
            'name.required' => 'El nombre es requerido',
            'name.min' => 'El nombre debe tener al menos 5 carácteres',
            'email.required' => 'El correo electrónico es requerido',
            'email.email' => 'El correo electrónico debe ser válido',
            'email.unique' => 'El correo electrónico ya está en uso',
            'password.required' => 'La contraseña es requerida',
            'password.min' => 'La contraseña debe tener al menos 8 carácteres',
            'password.max' => 'La contraseña no puede tener más de 15 carácteres',
            'password.alpha_num' => 'La contraseña solo puede contener letras y números',
            'userName.required' => 'El nombre de usuario es requerido',
            'userName.min' => 'El nombre de usuario debe tener al menos 4 carácteres',
            'lastName.required' => 'El apellido es requerido',
            'lastName.min' => 'El apellido debe tener al menos 5 carácteres',
            'birthDate.required' => 'La fecha de nacimiento es requerida',
            'birthDate.date' => 'La fecha de nacimiento debe ser válida',
            'skills.min' => 'Debe tener al menos 3 habilidades',
            'skills.*.name.required' => 'El nombre de la habilidad es requerido',
            'programmingLanguages.min' => 'Debe tener al menos 1 lenguaje de programación',
            'programmingLanguages.*.name.required' => 'El nombre del lenguaje de programación es requerido',
            'transversalSkills.min' => 'Debe tener al menos 2 habilidades transversales',
            'transversalSkills.*.name.required' => 'El nombre de la habilidad transversal es requerido',

        ]);


        $user = User::create([
            'name' => $request->name,
            'lastName' => $request->lastName,
            'userName' => $request->userName,
            'birthDate' => $request->birthDate,
            'role' =>1,
            'status' => 'active',
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // Create the skills and associate them with the user
        foreach ($request->skills as $skill) {
            $newSkill = Skill::create([
                'name' => $skill['name'],
                'user_id' => $user->id,
            ]);
            $user->skills()->save($newSkill);
        }

        // Create the programming languages and associate them with the user
        foreach ($request->programmingLanguages as $programmingLanguage) {
            $newProgrammingLanguage = ProgrammingLanguage::create([
                'name' => $programmingLanguage['name'],
                'user_id' => $user->id,
            ]);
            $user->programmingLanguages()->save($newProgrammingLanguage);
        }

        // Create the transversal skills and associate them with the user
        foreach ($request->transversalSkills as $transversalSkill) {
            $newTransversalSkill = TransversalSkill::create([
                'name' => $transversalSkill['name'],
                'user_id' => $user->id,
            ]);
            $user->transversalSkills()->save($newTransversalSkill);
        }

        // Generate a token for the registered user
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Registrado exitosamente',
        ], 201);
    }



    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ], [
            'email.required' => 'El correo electrónico es requerido',
            'email.email' => 'El correo electrónico debe ser válido',
            'password.required' => 'La contraseña es requerida'
        ]);

        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Los datos ingresados no existen.'], 401);
        }

        return $this->respondWithToken($token);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }

    public function verifyToken()
    {
        try {
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['No se encontró al usuario.'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token caducado'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token inválido'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token ausente'], $e->getStatusCode());
        }

        // the token is valid and we have found the user via the sub claim
        return response()->json(compact('user'));
    }

    public function refresh()
    {
        return $this->respondWithToken(JWTAuth::refresh());
    }

    public function me()
    {
        return response()->json(JWTAuth::user());
    }

}
