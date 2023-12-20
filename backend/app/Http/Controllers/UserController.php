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
            'name' => ['required', 'min:2'],
            'email' =>['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8', 'max:15', 'alpha_num'],
            'userName' => ['required', 'min:2', 'unique:users', 'max:15', 'alpha_num'],
            'lastName' => ['required', 'min:2'],
            'birthDate' => ['required', 'date'],
            'skills' => [ 'array', 'min:3'],
            'programmingLanguages' => ['array', 'min:1'],
            'transversalSkills' => [ 'array', 'min:2'],
        ], [
            'name.required' => 'El nombre es requerido.',
            'name.min' => 'El nombre debe tener al menos 2 carácteres.',
            'email.required' => 'El correo electrónico es requerido.',
            'email.email' => 'El correo electrónico debe ser válido.',
            'email.unique' => 'El correo electrónico ya está en uso.',
            'password.required' => 'La contraseña es requerida.',
            'password.min' => 'La contraseña debe tener al menos 8 carácteres.',
            'password.max' => 'La contraseña no puede tener más de 15 carácteres.',
            'password.alpha_num' => 'La contraseña solo puede contener letras y números.',
            'userName.required' => 'El nombre de usuario es requerido.',
            'userName.min' => 'El nombre de usuario debe tener al menos 2 carácteres.',
            'userName.max' => 'El nombre de usuario no puede tener más de 15 carácteres.',
            'userName.unique' => 'El nombre de usuario ya está en uso.',
            'userName.alpha_num' => 'El nombre de usuario solo puede contener letras, solo números, o una combinación de ambos. Los espacios y otros carácteres no están permitidos.',
            'lastName.required' => 'El apellido es requerido.',
            'lastName.min' => 'El apellido debe tener al menos 2 carácteres.',
            'birthDate.required' => 'La fecha de nacimiento es requerida.',
            'birthDate.date' => 'La fecha de nacimiento debe ser válida.',
            'skills.min' => 'Debe tener al menos 3 habilidades.',
            'programmingLanguages.min' => 'Debe tener al menos 1 lenguaje de programación.',
            'transversalSkills.min' => 'Debe tener al menos 2 habilidades transversales.',
        ]);

        try {
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
                    'name' => $skill,
                    'user_id' => $user->id,
                ]);
                $user->skills()->save($newSkill);
            }

            // Create the programming languages and associate them with the user
            foreach ($request->programmingLanguages as $programmingLanguage) {
                $newProgrammingLanguage = ProgrammingLanguage::create([
                    'name' => $programmingLanguage,
                    'user_id' => $user->id,
                ]);
                $user->programmingLanguages()->save($newProgrammingLanguage);
            }

            // Create the transversal skills and associate them with the user
            foreach ($request->transversalSkills as $transversalSkill) {
                $newTransversalSkill = TransversalSkill::create([
                    'name' => $transversalSkill,
                    'user_id' => $user->id,
                ]);
                $user->transversalSkills()->save($newTransversalSkill);
            }

        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al registrar el usuario.',
                'error' => $th->getMessage(),
            ], 500);
        }


        try {
            // Generate a token for the registered user
            $token = JWTAuth::fromUser($user);

            /*
            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Registrado exitosamente',
            ], 201);
            */

            return $this->respondWithToken($token);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al generar el token.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }



    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required','email'],
            'password' => ['required'],
        ], [
            'email.required' => 'El correo electrónico es requerido.',
            'email.email' => 'El correo electrónico debe ser válido.',
            'password.required' => 'La contraseña es requerida.'
        ]);

        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Los datos ingresados no existen.'], 401);
            }
            return $this->respondWithToken($token);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al iniciar sesión.',
                'error' => $th->getMessage(),
            ], 500);
        }
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
            return response()->json(['token caducado.'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token inválido.'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token ausente.'], $e->getStatusCode());
        }

        // the token is valid and we have found the user via the sub claim
        return response()->json(compact('user'));
    }

    public function refresh()
    {
        try {
            return $this->respondWithToken(JWTAuth::refresh());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            // Handle invalid token
            return response()->json(['error' => 'Token is invalid'], 400);
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            // Handle expired token
            return response()->json(['error' => 'Token is expired'], 400);
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            // Handle error while trying to encode the token
            return response()->json(['error' => 'Error while encoding the token'], 500);
        }
    }

    public function me()
    {
        try {
            $user = JWTAuth::user();
            // Load the relationships
            $user->load('skills', 'programming_languages', 'transversal_skills', 'posts');

            return response()->json($user);
        } catch (\Exception $e) {
            // Handle any exceptions
            return response()->json(['error' => 'No se pudieron recuperar los datos del usuario. ' . $e->getMessage()], 500);
        }
    }


    public function updateProfile(Request $request)
    {
        // Validate the request data
        $request->validate([
            'name' => ['required', 'min:2'],
            'lastName' => ['required', 'min:2'],
            'birthDate' => ['required', 'date'],

            'skills' => [ 'array', 'min:3'],
            'programmingLanguages' => ['array', 'min:1'],
            'transversalSkills' => [ 'array', 'min:2'],
        ], [
            'name.required' => 'El nombre es requerido.',
            'name.min' => 'El nombre debe tener al menos 2 carácteres.',
            'lastName.required' => 'El apellido es requerido.',
            'lastName.min' => 'El apellido debe tener al menos 2 carácteres.',
            'birthDate.required' => 'La fecha de nacimiento es requerida.',
            'birthDate.date' => 'La fecha de nacimiento debe ser válida.',
            'skills.min' => 'Debe tener al menos 3 habilidades.',
            'programmingLanguages.min' => 'Debe tener al menos 1 lenguaje de programación.',
            'transversalSkills.min' => 'Debe tener al menos 2 habilidades transversales.',
        ]);

        try {
            $user = JWTAuth::user();
        } catch (\Throwable $th) {
            return response()->json(['error' => 'No se pudo recuperar el usuario. ' . $th->getMessage()], 500);
        }

        try {
            // Update the user's basic information
            $user->update($request->only('name', 'lastName', 'birthDate'));


            // Get the current skills
            $currentSkills = $user->skills()->pluck('name')->toArray();

            // Find the skills to add and the skills to remove
            $skillsToAdd = array_diff($request->skills, $currentSkills);
            $skillsToRemove = array_diff($currentSkills, $request->skills);

            // Add the new skills
            foreach ($skillsToAdd as $skillName) {
                $user->skills()->create(['name' => $skillName , 'user_id' => $user->id]);
            }

            // Remove the skills that are no longer present
            foreach ($skillsToRemove as $skillName) {
                $user->skills()->where('name', $skillName)->delete();
            }

            //
            // Get the current programming languages
            $currentLanguages = $user->programming_languages()->pluck('name')->toArray();

            // Find the languages to add and the languages to remove
            $languagesToAdd = array_diff($request->programming_languages, $currentLanguages);
            $languagesToRemove = array_diff($currentLanguages, $request->programming_languages);

            // Add the new languages
            foreach ($languagesToAdd as $languageName) {
                $user->programming_languages()->create(['name' => $languageName , 'user_id' => $user->id]);
            }

            // Remove the languages that are no longer present
            foreach ($languagesToRemove as $languageName) {
                $user->programming_languages()->where('name', $languageName)->delete();
            }

            // Get the current transversal skills
            $currentTransversalSkills = $user->transversal_skills()->pluck('name')->toArray();

            // Find the transversal skills to add and the transversal skills to remove
            $transversalSkillsToAdd = array_diff($request->transversal_skills, $currentTransversalSkills);
            $transversalSkillsToRemove = array_diff($currentTransversalSkills, $request->transversal_skills);

            // Add the new transversal skills
            foreach ($transversalSkillsToAdd as $transversalSkillName) {
                $user->transversal_skills()->create(['name' => $transversalSkillName , 'user_id' => $user->id]);
            }

            // Remove the transversal skills that are no longer present
            foreach ($transversalSkillsToRemove as $transversalSkillName) {
                $user->transversal_skills()->where('name', $transversalSkillName)->delete();
            }

            // return a message
            return response()->json(['message' => 'Datos actualizados correctamente.'], 200);
        } catch (\Exception $e) {
            // Handle any exceptions
            return response()->json(['error' => 'No se pudieron actualizar los datos del usuario. ' . $e->getMessage()], 500);
        }
    }

}
