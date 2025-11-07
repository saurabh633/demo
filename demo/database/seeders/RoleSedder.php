<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;


class RoleSedder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::truncate();

        // Create dummy roles
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'User']);
        
        // You can add more roles as needed

        $this->command->info('Roles seeded successfully!');
    }
}
