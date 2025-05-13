<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $appointments = Appointment::with([
            'type',
            'patient.user',
            'dentist.user'
        ])->get();
        return $appointments;        
    }
    public function toggleStatus(Request $request,String $id)
    {
        $appointment=Appointment::findOrFail($id);
        // dd($request->status);
        $appointment->statut=$request->status;
        $appointment->save();
        // dd($appointment);
        return response()->json(['message'=>'Appointment updated successfully']);
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
        $appointment=new Appointment();
        $appointment->dentist_id=$request->dentist_id;
        $appointment->patient_id=$request->patient_id;
        $appointment->type_id=$request->type_id;
        $appointment->appointment_date=$request->appointment_date;
        $appointment->appointment_time=$request->appointment_time;
        $appointment->statut=$request->statut;
        $appointment->save();
        return response()->json(['message'=>'Appoitment added successfully ','id'=>$appointment->id]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request,Appointment $appointment)
    {
       //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Appointment $appointment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Appointment $appointment)
    {
        // dd($request->all());
        $appointment->dentist_id=$request->dentist_id;
        $appointment->patient_id=$request->patient_id;
        $appointment->type_id=$request->type_id;
        $appointment->appointment_date=$request->appointment_date;
        $appointment->appointment_time=$request->appointment_time;
        $appointment->statut=$request->statut;
        $appointment->save();
        return response()->json(['message'=>'Appointment updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return response()->json(['message'=>'appointment deleted successfully']);
    }
}
