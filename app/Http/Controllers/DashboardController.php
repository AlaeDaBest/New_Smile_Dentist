<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\Dentist;
use App\Models\Infermier;
use App\Models\Appointment;
use App\Models\Estimate;
use App\Models\Invoice;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $now = Carbon::now();
        $startOfYear = $now->copy()->startOfYear();

        // Total Counts
        $totalPatients = Patient::count();
        $totalDentists = Dentist::count();
        $totalNurses = Infermier::count();
        $appointmentsThisMonth = Appointment::whereMonth('appointment_date', $now->month)->count();
        $totalEstimates = Estimate::count();
        $totalInvoices = Invoice::count();
        $totalRevenue = Payment::sum('amount_paid');

        // Appointments per month (last 6 months)
        $appointmentsChart = Appointment::selectRaw('MONTH(appointment_date) as month, COUNT(*) as appointments')
            ->where('appointment_date', '>=', $startOfYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($row) {
                return [
                    'month' => Carbon::create()->month($row->month)->format('M'),
                    'appointments' => $row->appointments,
                ];
            });

        // Revenue per month
        $revenueChart = Payment::selectRaw('MONTH(created_at) as month, SUM(amount_paid) as revenue')
            ->where('created_at', '>=', $startOfYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($row) {
                return [
                    'month' => Carbon::create()->month($row->month)->format('M'),
                    'revenue' => (float) $row->revenue,
                ];
            });
            // dd($revenueChart);

        return response()->json([
            'patients' => $totalPatients,
            'dentists' => $totalDentists,
            'nurses' => $totalNurses,
            'appointments_this_month' => $appointmentsThisMonth,
            'estimates' => $totalEstimates,
            'invoices' => $totalInvoices,
            'revenue' => $totalRevenue,
            'appointments_chart' => $appointmentsChart,
            'revenue_chart' => $revenueChart,
            'patients_list'=>Patient::with('user')->get(),
            'dentists_list'=>Dentist::with('user')->get(),
            'nurses_list'=>Infermier::with('user')->get(),
        ]);
    }
}
