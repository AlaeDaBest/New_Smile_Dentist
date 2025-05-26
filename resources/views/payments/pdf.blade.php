<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->id }}</title>
    <style>
        body { font-family: sans-serif; color: #000; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .section { margin-top: 20px; }
        ul { padding-left: 20px; }
    </style>
</head>
<body>
    <div class="title">Facture #{{ $invoice->id }}</div>

    <p><strong>Total:</strong> {{ number_format($invoice->total_amount, 2) }} DH</p>
    <p><strong>Paid:</strong> {{ number_format($totalPaid, 2) }} DH</p>
    <p><strong>Remaining:</strong> {{ number_format($remaining, 2) }} DH</p>
    <p><strong>Status:</strong> {{ ucfirst(str_replace('_', ' ', $invoice->status)) }}</p>

    <hr>

    <div class="section">
        <h3>Payments</h3>
        @if ($invoice->payments->isEmpty())
            <p>No payments recorded.</p>
        @else
            <ul>
                @foreach ($invoice->payments as $p)
                    <li>{{ $p->payment_date }} – {{ number_format($p->amount_paid, 2) }} € ({{ ucfirst($p->payment_method) }})</li>
                @endforeach
            </ul>
        @endif
    </div>
</body>
</html>
