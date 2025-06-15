<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->id }}</title>
    <style>
        body { 
            font-family: 'Helvetica Neue', Arial, sans-serif; 
            color: #333;
            line-height: 1.6;
            padding: 30px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e1e1e1;
        }
        
        .header img {
            width: 60px;
            height: 55px;
        }
        
        .clinic-info {
            text-align: right;
            font-size: 12px;
            color: #666;
        }
        
        .title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #0013a5;
        }
        
        .invoice-meta {
            display: flex;
            justify-content: space-between;
            margin: 25px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .meta-item {
            flex: 1;
        }
        
        .meta-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        
        .meta-value {
            font-size: 16px;
            font-weight: 500;
        }
        
        .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-paid {
            background: #e6f7f5;
            color: #2a9d8f;
        }
        
        .status-partially_paid {
            background: #fff8e6;
            color: #ff9800;
        }
        
        .status-unpaid {
            background: #ffebee;
            color: #f44336;
        }
        
        .section {
            margin-top: 30px;
        }
        
        h3 {
            font-size: 18px;
            color: #0013a5;
            border-bottom: 2px solid #e1e1e1;
            padding-bottom: 8px;
            margin-bottom: 15px;
        }
        
        .payment-list {
            width: 100%;
            border-collapse: collapse;
        }
        
        .payment-list th {
            text-align: left;
            padding: 10px;
            background: #f8f9fa;
            font-weight: 500;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 1px;
        }
        
        .payment-list td {
            padding: 12px 10px;
            border-bottom: 1px solid #eee;
        }
        
        .payment-list tr:last-child td {
            border-bottom: none;
        }
        
        .amount {
            text-align: right;
            font-family: 'Courier New', monospace;
        }
        
        .no-payments {
            color: #666;
            font-style: italic;
            padding: 20px;
            text-align: center;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e1e1e1;
            font-size: 11px;
            color: #999;
            text-align: center;
        }
        
        .total-summary {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }
        
        .total-label {
            font-weight: 500;
        }
        
        .total-value {
            font-weight: bold;
            font-family: 'Courier New', monospace;
        }
        
        .remaining {
            color: #f44336;
        }
        
        .paid {
            color: #2a9d8f;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('Images/Logo/NewSmile_colored.png') }}">
    </div>
    
    
    <div class="invoice-meta">
        <div class="meta-item">
            <div class="meta-label">Date Issued</div>
            <div class="meta-value">{{ date('F j, Y', strtotime($invoice->created_at)) }}</div>
        </div>
        <div class="meta-item">
            <div class="meta-label">Patient</div>
            <div class="meta-value">{{ $invoice->patient->user->firstname }} {{ $invoice->patient->user->lastname }}</div>
        </div>
        <div class="meta-item">
            <div class="meta-label">Status</div>
            <div class="meta-value">
                <span class="status status-{{ strtolower($invoice->status) }}">
                    {{ ucfirst(str_replace('_', ' ', $invoice->status)) }}
                </span>
            </div>
        </div>
    </div>
    
    <div class="total-summary">
        <div class="total-row">
            <span class="total-label">Total Amount:</span>
            <span class="total-value">{{ number_format($invoice->total_amount, 2) }} DH</span>
        </div>
        <div class="total-row">
            <span class="total-label paid">Amount Paid:</span>
            <span class="total-value paid">{{ number_format($totalPaid, 2) }} DH</span>
        </div>
        <div class="total-row">
            <span class="total-label remaining">Amount Due:</span>
            <span class="total-value remaining">{{ number_format($remaining, 2) }} DH</span>
        </div>
    </div>
    
    <div class="section">
        <h3>Payment History</h3>
        @if ($invoice->payments->isEmpty())
            <div class="no-payments">No payments recorded for this invoice</div>
        @else
            <table class="payment-list">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Method</th>
                        <th class="amount">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($invoice->payments as $p)
                        <tr>
                            <td>{{ date('M j, Y', strtotime($p->payment_date)) }}</td>
                            <td>{{ ucfirst($p->payment_method) }}</td>
                            <td class="amount">{{ number_format($p->amount_paid, 2) }} DH</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>
    
    <div class="footer">
        Thank you for choosing NewSmile Dental Clinic.<br>.
    </div>
</body>
</html>