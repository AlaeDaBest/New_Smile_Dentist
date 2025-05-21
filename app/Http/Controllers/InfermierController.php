<?php

namespace App\Http\Controllers;

use App\Models\Infermier;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class InfermierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $infermier=new Infermier();
            $infermier->date_recrutement=$request->date_recrutement;
            $infermier->save();
            $user=new User();
            $user->CIN=$request->CIN;
            $user->firstname=$request->firstname;
            $user->lastname=$request->lastname;
            $user->tel=$request->tel;
            $user->email=$request->email;
            $user->birthdate=$request->birthdate;
            $user->gender=$request->gender;
            $user->password=Hash::make($request->password);
            $user->roleable_type=Infermier::class;
            $user->roleable_id=$infermier->id;
            if ($request->hasFile('photo')) {
                $file=$request->file('photo');
                $filename=$user->firstname.$user->lastname.time().'.'.$file->getClientOriginalExtension();
                $file->move(public_path('Images/Profiles/'),$filename);
                $request->merge(['photo'=>$filename]);
                $user->photo='Images/Profiles/'.$filename;
            }
            $user->save();
        return response()->json(['message'=>"Assistant created successfully"]);
        }catch(\Exception $e){
            return response()->json(['message'=>'Error creating the assistant',$e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Infermier $infermier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Infermier $infermier)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, String $id)
    {
        try{
            $infermier=Infermier::findOrFail($id);
            $infermier->date_recrutement=$request->date_recrutement;
            $user=$infermier->user;
            $user->CIN=$request->CIN;
            $user->firstname=$request->firstname;
            $user->lastname=$request->lastname;
            $user->tel=$request->tel;
            $user->email=$request->email;
            $user->birthdate=$request->birthdate;
            $user->gender=$request->gender;
            if ($request->hasFile('photo')) {
                // dd($request->file('photo'));
                $file=$request->file('photo');
                $filename=$user->firstname.$user->lastname.time().'.'.$file->getClientOriginalExtension();
                $file->move(public_path('Images/Profiles/'),$filename);
                $request->merge(['photo'=>$filename]);
                $user->photo='Images/Profiles/'.$filename;
            }
            $user->save();
            $infermier->save();
        return response()->json(['message'=>"Assistant updated successfully"]);
        }catch(\Exception $e){
            return response()->json(['message'=>'Error updating the assistant',$e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id)
    {
        $infermier=Infermier::findOrFail($id);
        $infermier->user->delete();
        $infermier->delete();
        return response()->json(['message'=>"Assistant deleted successfully"]);
    }
}
