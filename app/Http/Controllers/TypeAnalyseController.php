<?php

namespace App\Http\Controllers;

use App\Models\TypeAnalyse;
use Illuminate\Http\Request;

class TypeAnalyseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $typeAnalyses=TypeAnalyse::all();
        return $typeAnalyses;
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TypeAnalyse $typeAnalyse)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TypeAnalyse $typeAnalyse)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TypeAnalyse $typeAnalyse)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TypeAnalyse $typeAnalyse)
    {
        //
    }
}
