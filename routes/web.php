<?php
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SuppliersController;
use App\Http\Controllers\CategoryProductController;
use App\Http\Controllers\ProductController;

use App\Http\Controllers\StockLocalController;

use App\Http\Controllers\AccountsController;
use App\Http\Controllers\TransactionCategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\CashFlowController;
use App\Http\Controllers\FinancialController;
use App\Http\Controllers\InventoryController;

use App\Http\Controllers\ConsultationController; // Adicionado
use App\Http\Controllers\FormResponseController; // Adicionando o controlador para respostas de formulário

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

    // Rotas para pacientes (patients)
    Route::get('/patients', [PatientController::class, 'index'])->name('patients.index');
    Route::get('/patients/for-consultation', [PatientController::class, 'getPatientsForAddConsultation'])->name('patients.consultation.add');
    Route::post('/patients', [PatientController::class, 'store'])->name('patients.store');
    

    Route::post('/suppliers', [SuppliersController::class, 'store'])->name('suppliers.store');
    Route::put('/suppliers/{product}', [SuppliersController::class, 'update'])->name('suppliers.update');

    Route::post('/categories', [CategoryProductController::class, 'store'])->name('categories.store');
    Route::put('/categories', [CategoryProductController::class, 'update'])->name('categories.update');


    Route::post('/products', [ProductController::class, 'store'])->name('product.store');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('product.update');

    Route::post('/stock-locals', [StockLocalController::class, 'store'])->name('stockLocals.store');
    Route::put('/stock-locals', [StockLocalController::class, 'update'])->name('stockLocals.update');

    // Rotas para formulários dinâmicos
    Route::get('/forms', [FormController::class, 'index'])->name('forms.index');
    Route::post('/forms', [FormController::class, 'store'])->name('forms.store');
    Route::post('/form/update', [FormController::class, 'update'])->name('form.update');
    Route::put('/forms/{form}', [FormController::class, 'update'])->name('forms.update');

    Route::get('/forms/{form}/fields', [FormController::class, 'getFields'])->name('forms.fields');
    Route::post('/dashboard/add-consultation', [ConsultationController::class, 'store'])->name('consultation.store');

    // Rota para enviar respostas do formulário
    Route::post('/forms/{form}/responses', [FormResponseController::class, 'store'])->name('form.responses.store');

    // Rota para buscar as consultas de um paciente específico
    Route::get('/patients/{id}/consultations', [ConsultationController::class, 'getConsultationsByPatient']);
    
    // Rotas para consultas (consultations)
    Route::resource('consultations', ConsultationController::class);

    // Rota para obter as respostas de formulários de um paciente específico
    Route::get('/patients/{id}/form-responses', [FormResponseController::class, 'getFormResponsesByPatient']);

    // Rotas para empresas (companies) (somente para administradores - cargo 1)
    Route::middleware(['verifyUserRole:1'])->group(function () {
        Route::get('/companies', [CompanyController::class, 'index'])->name('companies.index');
        Route::get('/companies/create', [CompanyController::class, 'create'])->name('companies.create');
        Route::post('/companies', [CompanyController::class, 'store'])->name('companies.store');
        Route::get('/companies/{company}', [CompanyController::class, 'show'])->name('companies.show');
        Route::get('/companies/{company}/edit', [CompanyController::class, 'edit'])->name('companies.edit');
        Route::post('/companies/{company}', [CompanyController::class, 'update'])->name('companies.update');
        Route::delete('/companies/{company}', [CompanyController::class, 'destroy'])->name('companies.destroy');
        
        
        
        Route::get('/company', [CompanyController::class, 'companyDashboard'])->name('company');

        // Rotas para gerenciar funcionários da empresa do usuário autenticado
        Route::get('/employees', [CompanyController::class, 'employeesIndex'])->name('employees.index');
        Route::get('/employees/{employee}/edit', [CompanyController::class, 'editEmployee'])->name('employees.edit'); // Rota para exibir o formulário de edição
        Route::put('/employees/{employee}', [CompanyController::class, 'updateEmployee'])->name('employees.update'); // Rota para atualizar o funcionário
        Route::post('/employees', [CompanyController::class, 'addEmployee'])->name('employees.store'); // Rota para adicionar um novo funcionário
        Route::delete('/employees/{employee}', [CompanyController::class, 'removeEmployee'])->name('employees.destroy'); // Rota para excluir o funcionário

        Route::get('/inventory-dashboard', [InventoryController::class, 'inventoryDashboard'])->name('inventory.dashboard');

        // Rotas para relatórios
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

        // Rota central para o dashboard financeiro
        Route::get('/financial-dashboard', [FinancialController::class, 'financialDashboard'])->name('financial.dashboard');

        Route::get('/financial-data', [FinancialController::class, 'financialDashboardData'])->name('financial.data');

        // Rotas para o sistema financeiro (Financial Dashboard)
        Route::get('/accounts', [AccountsController::class, 'index'])->name('accounts.index');
        Route::post('/accounts', [AccountsController::class, 'store'])->name('accounts.store');
        Route::put('/accounts/{account}', [AccountsController::class, 'update'])->name('accounts.update');
        Route::delete('/accounts/{account}', [AccountsController::class, 'destroy'])->name('accounts.destroy');

        Route::get('/transaction-categories', [TransactionCategoryController::class, 'index'])->name('transaction_categories.index');
        Route::post('/transaction-categories', [TransactionCategoryController::class, 'store'])->name('transaction_categories.store');
        Route::put('/transaction-categories/{category}', [TransactionCategoryController::class, 'update'])->name('transaction_categories.update');
        Route::delete('/transaction-categories/{category}', [TransactionCategoryController::class, 'destroy'])->name('transaction_categories.destroy');

        Route::post('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
        Route::get('/transactions/filter', [TransactionController::class, 'filter'])->name('transactions.filter');
        Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
        Route::put('/transactions/{transaction}', [TransactionController::class, 'update'])->name('transactions.update');
        Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

        Route::get('/transfers', [TransferController::class, 'index'])->name('transfers.index');
        Route::post('/transfers', [TransferController::class, 'store'])->name('transfers.store');
        Route::put('/transfers/{transfer}', [TransferController::class, 'update'])->name('transfers.update');
        Route::delete('/transfers/{transfer}', [TransferController::class, 'destroy'])->name('transfers.destroy');
        Route::put('/transactions/{transaction}', [TransactionController::class, 'update'])->name('transactions.update');

        Route::get('/cash-flows', [CashFlowController::class, 'index'])->name('cash_flows.index');
        Route::post('/cash-flows', [CashFlowController::class, 'store'])->name('cash_flows.store');
        Route::put('/cash-flows/{cashFlow}', [CashFlowController::class, 'update'])->name('cash_flows.update');
        Route::delete('/cash-flows/{cashFlow}', [CashFlowController::class, 'destroy'])->name('cash_flows.destroy');
    });
});

// Requer autenticação para as rotas de autenticação do Breeze
require __DIR__.'/auth.php';
