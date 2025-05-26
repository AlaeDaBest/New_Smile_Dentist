<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Appointment;
use App\Models\Analyse;
use App\Models\TypeAnalyse;
use App\Models\Type;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $invoices=Invoice::with(['items','patient.user','payments'])->orderBy('created_at','desc')->get();
        return $invoices;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }
    public function download(Invoice $invoice)
    {
        // dd($estimate->items);
        $invoice->load(['items.itemable', 'patient.user']);
        // dd($estimate->items->first()->itemable);
        $pdf = Pdf::loadView('invoices.pdf', compact('invoice'));
        return $pdf->download("invoice_{$invoice->id}.pdf");
    }
    public function generatePdf($id)
    {
        $invoice = Invoice::with('payments')->findOrFail($id);

        $totalPaid = $invoice->payments->sum('amount_paid');
        $remaining = $invoice->total_amount - $totalPaid;

        $pdf = Pdf::loadView('payments.pdf', [
            'invoice' => $invoice,
            'totalPaid' => $totalPaid,
            'remaining' => $remaining,
        ]);

        return $pdf->download("invoice-{$invoice->id}.pdf");
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $request->validate([
                'patient_id'=>'required|exists:patients,id',
                'items'=>'required|array|min:1',
                'items.*.unit_price' => 'required|numeric',
                'total'=>'required|numeric'
            ]);
            $invoice=new Invoice();
            $invoice->patient_id=$request->patient_id;
            $invoice->total_amount=$request->total;
            $invoice->save();
            foreach($request->items as $item){
                $invoiceItem=new InvoiceItem();
                $invoiceItem->invoice_id=$invoice->id;
                $invoiceItem->itemable_type=$item['treatmentType']=='appointment'?Type::class:TypeAnalyse::class;
                $invoiceItem->itemable_id=$item['treatment_id'];
                $invoiceItem->unit_price=$item['unit_price'];
                $invoiceItem->save();
            }
            return response()->json([
                'message' => 'Invoice created successfully',
                'id' => $invoice->id,
                'download_url' => route('invoices.download', ['invoice' => $invoice->id])
            ], 201);
        }catch(\Exception $e){
            return response()->json(['message'=>'Error creating the invoice','error'=>$e->getMessage()],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        //
    }
}
