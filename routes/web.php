<?php
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\PacientController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AccountsController;
use App\Http\Controllers\TransactionCategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\CashFlowController;
use App\Http\Controllers\FinancialController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rota da página inicial
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rota para o dashboard
Route::get('/dashboards', function () {
    return Inertia::render('Dashboards');
})->middleware(['auth', 'verified'])->name('dashboards');
Route::get('/test-middleware', function () {
    return 'Middleware working!';
})->middleware('verifyUserRole:1');

// Grupo de rotas autenticadas
Route::middleware('auth')->group(function () {

    // Rotas para o perfil do usuário
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rota para o dashboard de eventos
    Route::get('/dashboard', [EventsController::class, 'index'])->name('dashboard');

    // Rotas para pacientes
    Route::get('/pacients', [PacientController::class, 'index'])->name('pacients');
    Route::post('/pacients', [PacientController::class, 'store'])->name('pacients.store');

    // Rotas para formulários dinâmicos
    Route::get('/forms', [FormController::class, 'index'])->name('forms.index');
    Route::post('/forms', [FormController::class, 'store'])->name('forms.store');

    // Rotas para empresas (somente para administradores - cargo 1)
    Route::middleware(['verifyUserRole:1'])->group(function () {
        Route::get('/empresas', [EmpresaController::class, 'index'])->name('empresas.index');
        Route::get('/empresas/create', [EmpresaController::class, 'create'])->name('empresas.create');
        Route::post('/empresas', [EmpresaController::class, 'store'])->name('empresas.store');
        Route::get('/empresas/{empresa}', [EmpresaController::class, 'show'])->name('empresas.show');
        Route::get('/empresas/{empresa}/edit', [EmpresaController::class, 'edit'])->name('empresas.edit');
        Route::put('/empresas/{empresa}', [EmpresaController::class, 'update'])->name('empresas.update');
        Route::delete('/empresas/{empresa}', [EmpresaController::class, 'destroy'])->name('empresas.destroy');

        // Rotas para gerenciar funcionários da empresa do usuário autenticado
        Route::get('/employees', [EmpresaController::class, 'employeesIndex'])->name('employees.index');
        Route::get('/employees/{employee}/edit', [EmpresaController::class, 'editEmployee'])->name('employees.edit');
        Route::post('/employees', [EmpresaController::class, 'addEmployee'])->name('employees.store');
        Route::delete('/employees/{employee}', [EmpresaController::class, 'removeEmployee'])->name('employees.destroy');

        // Rotas para relatórios
        Route::get('/reports', [EmpresaController::class, 'index'])->name('reports.index');

        // Rota central para o dashboard financeiro
        Route::get('/financial-dashboard', [FinancialController::class, 'financialDashboard'])->name('financial.dashboard');

        // Rotas para o sistema financeiro (Financial Dashboard)
        Route::get('/accounts', [AccountsController::class, 'index'])->name('accounts.index');
        Route::post('/accounts', [AccountsController::class, 'store'])->name('accounts.store');
        Route::put('/accounts/{account}', [AccountsController::class, 'update'])->name('accounts.update');
        Route::delete('/accounts/{account}', [AccountsController::class, 'destroy'])->name('accounts.destroy');

        Route::get('/transaction-categories', [TransactionCategoryController::class, 'index'])->name('transaction_categories.index');
        Route::post('/transaction-categories', [TransactionCategoryController::class, 'store'])->name('transaction_categories.store');
        Route::put('/transaction-categories/{category}', [TransactionCategoryController::class, 'update'])->name('transaction_categories.update');
        Route::delete('/transaction-categories/{category}', [TransactionCategoryController::class, 'destroy'])->name('transaction_categories.destroy');

        Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
        Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
        Route::put('/transactions/{transaction}', [TransactionController::class, 'update'])->name('transactions.update');
        Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

        Route::get('/transfers', [TransferController::class, 'index'])->name('transfers.index');
        Route::post('/transfers', [TransferController::class, 'store'])->name('transfers.store');
        Route::put('/transfers/{transfer}', [TransferController::class, 'update'])->name('transfers.update');
        Route::delete('/transfers/{transfer}', [TransferController::class, 'destroy'])->name('transfers.destroy');

        Route::get('/cash-flows', [CashFlowController::class, 'index'])->name('cash_flows.index');
        Route::post('/cash-flows', [CashFlowController::class, 'store'])->name('cash_flows.store');
        Route::put('/cash-flows/{cashFlow}', [CashFlowController::class, 'update'])->name('cash_flows.update');
        Route::delete('/cash-flows/{cashFlow}', [CashFlowController::class, 'destroy'])->name('cash_flows.destroy');
    });
});

// Requer autenticação para as rotas de autenticação do Breeze
require __DIR__.'/auth.php';
