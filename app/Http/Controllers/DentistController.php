<?php

namespace App\Http\Controllers;

use App\Models\Dentist;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class DentistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $dentists=Dentist::with('user')->get();
        return $dentists;
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
            // dd($request->all());
            $dentist=new Dentist();
            $dentist->recrutement_date=$request->recrutement_date;
            $dentist->speciality=$request->speciality;
            $dentist->save();
            $user=new User();
            $user->CIN=$request->CIN;
            $user->firstname=$request->firstname;
            $user->lastname=$request->lastname;
            $user->tel=$request->tel;
            $user->email=$request->email;
            $user->birthdate=$request->birthdate;
            $user->gender=$request->gender;
            $user->password=Hash::make($request->password);
            $user->roleable_type=Dentist::class;
            $user->roleable_id=$dentist->id;
            if ($request->hasFile('photo')) {
                $file=$request->file('photo');
                $filename=$user->firstname.$user->lastname.time().'.'.$file->getClientOriginalExtension();
                $file->move(public_path('Images/Profiles/'),$filename);
                $request->merge(['photo'=>$filename]);
                $user->photo='Images/Profiles/'.$filename;
            }
            $user->save();
        return response()->json(['message'=>"Dentist created successfully"]);
        }catch(\Exception $e){
            return response()->json(['message'=>'Error creating the dentist',$e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Dentist $dentist)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dentist $dentist)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Dentist $dentist)
    {
        try{
            $dentist->recrutement_date=$request->recrutement_date;
            $user=$dentist->user;
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
            $dentist->save();
        return response()->json(['message'=>"Assistant updated successfully"]);
        }catch(\Exception $e){
            return response()->json(['message'=>'Error updating the assistant',$e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dentist $dentist)
    {
        // dd($dentist->user->groupChats()->messages());
        $dentist->appointments()->delete();
        $dentist->user->delete();
        $dentist->delete();
        return response()->json(['message'=>"Assistant deleted successfully"]);
    }
}
