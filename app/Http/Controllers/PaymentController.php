<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use App\Models\Invoice;

class PaymentController extends Controller
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
        // dd($request->all());
        try {
            $validated = $request->validate([
                'amount_paid' => 'required|numeric|min:0.01',
                'payment_method' => 'nullable|string|max:50',
                'invoice_id' => 'required|exists:invoices,id',
                'payment_date' => 'required|date',
            ]);
        
            $invoice = Invoice::findOrFail($request->invoice_id);
            $totalPaid = $invoice->payments()->sum('amount_paid');
            $remaining = $invoice->total_amount - $totalPaid;
        
            if ($request->amount_paid > $remaining) {
                return response()->json([
                    'error' => 'Amount exceeds remaining balance of the invoice.'
                ], 422);
            }
        
            $payment = new Payment();
            $payment->invoice_id = $request->invoice_id;
            $payment->amount_paid = $request->amount_paid;
            $payment->payment_date = $request->payment_date;
            $payment->payment_method = $request->payment_method;
            $payment->save();
        
            $newTotalPaid = $totalPaid + $request->amount_paid;
        
            if ($newTotalPaid >= $invoice->total_amount) {
                $invoice->status = 'paid';
            } elseif ($newTotalPaid > 0) {
                $invoice->status = 'partially_paid';
            } else {
                $invoice->status = 'unpaid';
            }
        
            $invoice->save();
        
            return response()->json($payment);
        
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Paiment $paiment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Paiment $paiment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Paiment $paiment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Paiment $paiment)
    {
        //
    }
}
