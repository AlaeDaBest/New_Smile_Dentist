<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use App\Models\User;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.resource
     */
    public function index()
    {
        $patients=Patient::with('user')->get();
        return $patients;
    }

    public function GetAppointments(String $id)
    {
        $patient = Patient::with('appointments.type', 'appointments.dentist.user')->findOrFail($id);
        $sortedAppointments = $patient->appointments->sortByDesc('appointment_date')->values();

        return response()->json([
            'patient'=>$patient,
            'appointments' => $sortedAppointments
        ]);
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
        // dd($request->all());
        $request->validate([
            'firstname'=>'required',
            'lastname'=>'required',
        ]);
        try{
            $patient=new Patient();
            $patient->allergies=$request->allergies;
            $patient->medical_conditions=$request->medical_conditions;
            $patient->had_operations=$request->had_operations;
            $patient->save();
            // dd($patient);
            $user=new User();
            $user->CIN=$request->CIN;
            $user->firstname=$request->firstname;
            $user->lastname=$request->lastname;
            $user->gender=$request->gender;
            $user->birthdate=$request->birthdate;
            $user->email=$request->email;
            $user->tel=$request->tel;
            $user->address=$request->address;
            $user->photo=$request->photo;
            $user->roleable_type=Patient::class;
            $user->roleable_id=$patient->id;
            // dd($user);
            $user->save();
        }catch(\Exception $e){
            return response()->json(['message'=>'Error creating the patient',$e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Patient $patient)
    {
        // dd($patient);
        $patient->allergies=$request->allergies;
        $patient->medical_conditions=$request->medical_conditions;
        $patient->had_operations=$request->had_operations;
        $patient->user->firstname=$request->user['firstname'];
        $patient->user->lastname=$request->user['lastname'];
        $patient->user->tel=$request->user['tel'];
        $patient->user->email=$request->user['email'];
        $patient->user->birthdate=$request->user['birthdate'];
        $patient->user->gender=$request->user['gender'];
        $patient->user->save();
        $patient->save();
        return response()->json(['message'=>"Patient updated successfully"]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        // dd($patient->appointments()->first());
        $patient->appointments()->delete();
        $patient->user->delete();
        $patient->delete();
        return response()->json(['message'=>'Patient deleted successfully']);
    }
}
