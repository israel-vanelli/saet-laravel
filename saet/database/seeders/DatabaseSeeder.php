<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $random_password = isEnvLocal() ? 'password' : str()->random(12);

        $user = User::updateOrCreate([
            'email' => 'admin@utfpr.edu.br',
        ], [
            'name' => 'Admin',
            'email_verified_at' => now(),
            'password' => Hash::make($random_password),
        ]);

        $role = Role::findOrCreate('admin');

        if($user->wasRecentlyCreated) {
            $user->assignRole($role);
            line("Admin user created with email '{$user->email}' and password '{$random_password}'");
        }
    }
}
