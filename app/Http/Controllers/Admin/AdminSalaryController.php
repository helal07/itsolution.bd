<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Leave;
use App\Models\Salary;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSalaryController extends Controller
{
    /**
     * Display Monthly Payroll & Salary Management Sheet.
     */
    public function index(Request $request): Response
    {
        $currentMonth = (int) $request->query('month', now()->month);
        $currentYear = (int) $request->query('year', now()->year);

        $salaries = Salary::with('employee')
            ->where('month', $currentMonth)
            ->where('year', $currentYear)
            ->latest('id')
            ->get();

        $employees = Employee::where('status', 'active')
            ->orderBy('name')
            ->get();

        // Calculate summary statistics
        $stats = [
            'total_net_payout' => $salaries->sum('net_salary'),
            'total_base_payroll' => $salaries->sum('base_salary'),
            'total_bonus' => $salaries->sum('bonus'),
            'total_deductions' => $salaries->sum('deduction'),
            'paid_count' => $salaries->where('status', 'paid')->count(),
            'pending_count' => $salaries->where('status', '!=', 'paid')->count(),
        ];

        return Inertia::render('Admin/Salary/Index', [
            'salaries' => $salaries,
            'employees' => $employees,
            'stats' => $stats,
            'selectedMonth' => $currentMonth,
            'selectedYear' => $currentYear,
        ]);
    }

    /**
     * Auto-Generate Monthly Payroll linking Live Attendance & Leave records.
     */
    public function generateMonthly(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|between:2020,2035',
            'working_days' => 'required|integer|min:1|max:31',
            'employee_id' => 'nullable|exists:employees,id',
        ]);

        $month = (int) $validated['month'];
        $year = (int) $validated['year'];
        $workingDays = (int) $validated['working_days'];

        $employeesQuery = Employee::where('status', 'active');
        if (!empty($validated['employee_id'])) {
            $employeesQuery->where('id', $validated['employee_id']);
        }
        $employees = $employeesQuery->get();

        $generatedCount = 0;

        foreach ($employees as $employee) {
            $baseSalary = (float) ($employee->salary ?? 0);
            if ($baseSalary <= 0) {
                continue;
            }

            // Calculate present days in that month
            $presentDays = Attendance::where(function ($q) use ($employee) {
                    $q->where('employee_id', $employee->id);
                    if ($employee->user_id) {
                        $q->orWhere('user_id', $employee->user_id);
                    }
                })
                ->whereMonth('date', $month)
                ->whereYear('date', $year)
                ->whereIn('status', ['present', 'late'])
                ->count();

            // Calculate approved leaves in that month
            $approvedLeaves = Leave::where(function ($q) use ($employee) {
                    $q->where('employee_id', $employee->id);
                    if ($employee->user_id) {
                        $q->orWhere('user_id', $employee->user_id);
                    }
                })
                ->where('status', 'approved')
                ->whereMonth('start_date', $month)
                ->whereYear('start_date', $year)
                ->sum('total_days');

            $effectiveDays = $presentDays + $approvedLeaves;
            $absentDays = max(0, $workingDays - $effectiveDays);

            // Daily rate based on standard working days
            $dailyRate = $workingDays > 0 ? ($baseSalary / $workingDays) : 0;
            $deduction = round($absentDays * $dailyRate, 2);
            $bonus = 0.00;
            $netSalary = max(0, round($baseSalary + $bonus - $deduction, 2));

            Salary::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'month' => $month,
                    'year' => $year,
                ],
                [
                    'base_salary' => $baseSalary,
                    'working_days' => $workingDays,
                    'present_days' => $presentDays,
                    'leave_days' => $approvedLeaves,
                    'absent_days' => $absentDays,
                    'bonus' => $bonus,
                    'deduction' => $deduction,
                    'net_salary' => $netSalary,
                    'status' => 'unpaid',
                ]
            );

            $generatedCount++;
        }

        $monthName = Carbon::createFromDate($year, $month, 1)->format('F Y');
        return redirect()->back()->with('success', "Payroll generated successfully for {$generatedCount} employees for {$monthName}!");
    }

    /**
     * Update individual Salary Record (Adjust Bonus, Deduction, Notes).
     */
    public function update(Request $request, Salary $salary): RedirectResponse
    {
        $validated = $request->validate([
            'base_salary' => 'required|numeric|min:0',
            'bonus' => 'nullable|numeric|min:0',
            'deduction' => 'nullable|numeric|min:0',
            'present_days' => 'nullable|integer|min:0',
            'working_days' => 'nullable|integer|min:1',
            'note' => 'nullable|string|max:1000',
        ]);

        $baseSalary = (float) $validated['base_salary'];
        $bonus = (float) ($validated['bonus'] ?? 0);
        $deduction = (float) ($validated['deduction'] ?? 0);
        $netSalary = max(0, round($baseSalary + $bonus - $deduction, 2));

        $salary->update([
            'base_salary' => $baseSalary,
            'bonus' => $bonus,
            'deduction' => $deduction,
            'net_salary' => $netSalary,
            'present_days' => $validated['present_days'] ?? $salary->present_days,
            'working_days' => $validated['working_days'] ?? $salary->working_days,
            'note' => $validated['note'] ?? $salary->note,
        ]);

        return redirect()->back()->with('success', 'Salary record updated successfully.');
    }

    /**
     * Mark Salary as Paid.
     */
    public function markPaid(Request $request, Salary $salary): RedirectResponse
    {
        $validated = $request->validate([
            'payment_method' => 'required|string|max:50',
            'payment_date' => 'required|date',
            'transaction_ref' => 'nullable|string|max:100',
            'note' => 'nullable|string|max:500',
        ]);

        $salary->update([
            'status' => 'paid',
            'payment_method' => $validated['payment_method'],
            'payment_date' => $validated['payment_date'],
            'transaction_ref' => $validated['transaction_ref'] ?? null,
            'note' => $validated['note'] ?? $salary->note,
        ]);

        return redirect()->back()->with('success', "Salary marked as Paid for {$salary->employee?->name}.");
    }

    /**
     * Delete Salary Record.
     */
    public function destroy(Salary $salary): RedirectResponse
    {
        $salary->delete();
        return redirect()->back()->with('success', 'Salary entry deleted successfully.');
    }
}
