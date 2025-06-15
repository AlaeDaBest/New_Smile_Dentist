<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'CIN' => 'KB1234',
                'firstname' => 'Alice',
                'lastname' => 'Smith',
                'gender'=>'female',
                'birthdate'=>'1990-01-01',
                'email'=>'alice.smith@clinic.com',
                'is_admin'=>'1',
                'tel'=>'0612345678',
                'password' => Hash::make('12345678'),
                'address' => '123 Main St, Cityville',
                'photo'=>'',
                'roleable_type' => 'App\Models\Dentist',
                'roleable_id' => 1,
            ],
            [
                'CIN' => 'KB1235',
                'firstname' => 'Bob',
                'lastname' => 'Johnson',
                'gender'=>'male',
                'birthdate'=>'1990-02-02',
                'email'=>'bob.johnson@clinic.com',
                'is_admin'=>'0',
                'tel'=>'0612345679',
                'password' => Hash::make('12345678'),
                'address' => '123 Main St, Cityville',
                'photo'=>'',
                'roleable_type' => 'App\Models\Dentist',
                'roleable_id' => 1,
            ],
        ]);
    }
}
