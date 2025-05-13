<?php

namespace App\Http\Controllers;

use App\Models\Estimate;
use App\Models\EstimateItem;
use App\Models\Appointment;
use App\Models\Analyse;
use App\Models\TypeAnalyse;
use App\Models\Type;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class EstimateController extends Controller
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
    public function download(Estimate $estimate)
    {
        // dd($estimate->items);
        $estimate->load(['items.itemable', 'patient.user']);
        // dd($estimate->items->first()->itemable);
        $pdf = Pdf::loadView('estimates.pdf', compact('estimate'));
        return $pdf->download("estimate_{$estimate->id}.pdf");
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        try{
            $request->validate([
                'patient_id'=>'required|exists:patients,id',
                'items'=>'required|array|min:1',
                'items.*.unit_price' => 'required|numeric',
                'total'=>'required|numeric'
            ]);
            $estimate=new Estimate();
            $estimate->patient_id=$request->patient_id;
            $estimate->total_amount=$request->total;
            $estimate->save();
            foreach($request->items as $item){
                $estimateItem=new EstimateItem();
                $estimateItem->estimate_id=$estimate->id;
                $estimateItem->itemable_type=$item['treatmentType']=='appointment'?Type::class:TypeAnalyse::class;
                $estimateItem->itemable_id=$item['treatment_id'];
                $estimateItem->unit_price=$item['unit_price'];
                $estimateItem->save();
            }
            return response()->json([
                'message' => 'Estimate created successfully',
                'id' => $estimate->id,
                'download_url' => route('estimates.download', ['estimate' => $estimate->id])
            ], 201);
        }catch(\Exception $e){
            return response()->json(['message'=>'Error creating the estimate','error'=>$e->getMessage()],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Estimate $estimate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Estimate $estimate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Estimate $estimate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Estimate $estimate)
    {
        //
    }
}
