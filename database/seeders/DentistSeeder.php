<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Dentist;
use Illuminate\Support\Facades\DB;

class DentistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('dentists')->insert([
            [
                'recrutement_date' => '2020-05-12',
                'speciality' => 'orthodontics',
            ],
            [
                'recrutement_date' => '2019-03-15',
                'speciality' => 'periodontics',
            ],
        ]);
    }
}
