<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $admin = User::create([
            'name' => 'Administrador',
            'lastName'=> '',
            'email' => 'administrador@admin.cl',
            'password' => bcrypt('administrador123'),
            'userName' => '',
            'birthDate' => '2000-01-01',
            'role' => 2
        ]);

        User::factory()->count(10)->create();
    }
}
