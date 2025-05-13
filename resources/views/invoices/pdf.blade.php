<div>
    <!-- I begin to speak only when I am certain what I will say is not better left unsaid. - Cato the Younger -->
</div>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Estimate #{{ $invoice->id }}</title>
    <style>
        @page { margin: 0; }
        body {
            margin: 40px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f4f6f9;
            color: #333;
        }

        .estimate-container {
            background: #ffffff;
            border-radius: 10px;
            padding: 30px 40px;
            max-width: 800px;
            margin: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .header {
            border-bottom: 2px solid #0013a5;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
            color: #0013a5;
        }

        .info {
            margin-bottom: 20px;
            font-size: 15px;
        }

        .info strong {
            color: #da2b04;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 14px;
        }

        thead {
            background-color: #0013a5;
            color: #fff;
        }

        th, td {
            padding: 12px 15px;
            text-align: left;
        }

        tbody tr:nth-child(even) {
            background-color: #f1f1f1;
        }

        .total {
            margin-top: 30px;
            text-align: right;
            font-size: 18px;
            padding-top: 10px;
            border-top: 2px solid #002d72;
            color: #da2b04;
        }

        .footer {
            text-align: center;
            margin-top: 50px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>

    <div class="estimate-container">
        <div class="header">
            <h1>Dental Invoice</h1>
        </div>

        <div class="info">
            <p><strong>Invoice #:</strong> {{ $invoice->id }}</p>
            <p><strong>Patient:</strong> {{ $invoice->patient->user->firstname }} {{ $invoice->patient->user->lastname }}</p>
            <p><strong>Date:</strong> {{ $invoice->created_at->format('d/m/Y') }}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Treatment</th>
                    <th>Unit Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                    <tr>

                        <td>{{ class_basename($item->itemable_type)=='Type'?'Appoitment':'Analysis' }}</td>
                        <td>{{ $item->itemable->act ?? $item->itemable->label }}</td>
                        <td>{{ number_format($item->unit_price, 2) }} DH</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="total">
            Total: {{ number_format($invoice->total_amount, 2) }} DH
        </div>

        <div class="footer">
            <p>Thank you for your trust. Smile brighter with us!</p>
        </div>
    </div>

</body>
</html>
