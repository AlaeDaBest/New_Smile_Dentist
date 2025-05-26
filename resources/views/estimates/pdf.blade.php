<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Estimate #{{ $estimate->id }}</title>
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
            <h1>Dental Estimate</h1>
        </div>
        <div class="info">
            <p><strong>Estimate #:</strong> {{ $estimate->id }}</p>
            <p><strong>Patient:</strong> {{ $estimate->patient->user->firstname }} {{ $estimate->patient->user->lastname }}</p>
            <p><strong>Date:</strong> {{ $estimate->created_at->format('d/m/Y') }}</p>
        </div>
        @php
            $hasTooth = $estimate->items->contains(fn($item) => !is_null($item->tooth));
        @endphp

        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Treatment</th>
                    @if ($hasTooth)
                        <th>Tooth</th>
                    @endif
                    <th>Unit Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach($estimate->items as $item)
                    <tr>

                        <td>{{ class_basename($item->itemable_type)=='Type'?'Appoitment':'Analysis' }}</td>
                        <td>{{ $item->itemable->act ?? $item->itemable->label }}</td>
                        @if ($hasTooth)
                            <td>{{ $item->tooth ?? '-' }}</td>
                        @endif
                        <td>{{ number_format($item->unit_price, 2) }} DH</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="total">
            Total: {{ number_format($estimate->total_amount, 2) }} DH
        </div>

        <div class="footer">
            <p>Thank you for your trust. Smile brighter with us!</p>
        </div>
    </div>

</body>
</html>
