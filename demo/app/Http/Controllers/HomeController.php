<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;


class HomeController extends Controller
{
    public function index()
    {
        $users = User::all();
        $roles = Role::all();
        return view('User.index',compact('users','roles'));
    }

    public function create()
    {
        return view('User.create');
    }

    public function store(Request $request)
    {
       
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'description' => 'nullable|string',
            'role_id' => 'required|numeric',
            
        ]);

       
        if ($request->hasFile('profile_image')) {
            $imagePath = $request->file('profile_image')->store('profile_images', 'public');
        } else {
            $imagePath = null;
        }

       
        $yourModel = new User(); 

       
        $yourModel->name = $request->input('name');
        $yourModel->email = $request->input('email');
        $yourModel->phone = $request->input('phone');
        $yourModel->description = $request->input('description');
        $yourModel->role_id = $request->input('role_id');
        $yourModel->profile_image = $imagePath; 

        
        $yourModel->save();
        $role = Role::where('id', '=', $request->input('role_id'))->first('name');
        $yourModel->role_name = $role;
     
        return $yourModel;
    }

    public function show($id){
        $user = User::where('id', '=', $id)->first();
        return $user;
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'description' => 'nullable|string',
            'role_id' => 'required|numeric',
           
        ]);
        if ($request->hasFile('profile_image')) {
            $imagePath = $request->file('profile_image')->store('profile_images', 'public');
        } else {
            $imagePath = null;
        }

       
        $yourModel = User::find($id); 

      
        $yourModel->name = $request->input('name');
        $yourModel->email = $request->input('email');
        $yourModel->phone = $request->input('phone');
        $yourModel->description = $request->input('description');
        $yourModel->role_id = $request->input('role_id');
        $yourModel->profile_image = $imagePath; 

        
        $yourModel->save();
       
        $role = Role::where('id', '=', $request->input('role_id'))->first('name');
        $yourModel->role_name = $role;
        return $yourModel;
    }

    public function destroy($id)
    {
        $user = User::destroy($id);
        return $user;
    }
}
