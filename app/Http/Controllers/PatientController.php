<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Form;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user()->load('company');
        $companyId = $user->company->id; // Obtém o ID da empresa do usuário autenticado
    
        // Obtém o termo de busca, se disponível
        $search = $request->input('search');
    
        // Busca pacientes pela empresa do usuário e pelo nome, sem diferenciação de maiúsculas/minúsculas
        $patients = Patient::query()
            ->where('company_id', $companyId)
            ->when($search, function ($query, $search) {
                return $query->whereRaw("unaccent(patient_name) ILIKE unaccent(?)", ['%' . $search . '%']);
            })
            ->get(); // Retorna todos os pacientes sem paginação
    
        // Carrega os funcionários da empresa
        $employees = $user->company->users; // Carrega os funcionários da empresa do usuário autenticado
    
        // Carrega os formulários associados à empresa
        $forms = Form::where('company_id', $companyId)->get(); // Busca os formulários da empresa do usuário
    
        // Retorna a página com os pacientes filtrados, funcionários e formulários da empresa
        return Inertia::render('Patients/Patients', [
            'patients' => $patients,
            'employees' => $employees, // Envia os funcionários para o frontend
            'forms' => $forms, // Envia os formulários para o frontend
            'auth' => [
                'user' => $user, // Envia o usuário com a empresa para o frontend
            ],
            'search' => $search,
        ]);
    }
    
    
    public function getPatientsForAddConsultation(Request $request)
    {
        $user = $request->user()->load('company');
        $companyId = $user->company->id; // Obtém o ID da empresa do usuário autenticado
    
        // Busca pacientes pela empresa do usuário e seleciona apenas os campos necessários
        $patients = Patient::query()
            ->where('company_id', $companyId)
            ->select('id','patient_name', 'profile_picture') // Seleciona apenas os campos necessários
            ->get();
    
        // Retorna os dados como JSON
        return response()->json($patients);
    }
    
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Show the creation form (not implemented)
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'patient_name' => 'required|string|max:255',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string',
            'personal_contacts' => 'nullable|array',
            'neighborhood' => 'nullable|string|max:100',
            'street' => 'nullable|string|max:200',
            'house_number' => 'nullable|string|max:10',
            'address_complement' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'cep' => 'nullable|string|max:10',
            'cpf' => 'nullable|string|max:14',
            'contacts' => 'nullable|array',
            'complaints' => 'nullable|array',
            'notes' => 'nullable|string',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'nullable|boolean', // Validate the status field
        ]);
    
        // Define the default status if not provided
        $validatedData['status'] = $validatedData['status'] ?? true;
    
        $validatedData['company_id'] = $request->user()->company->id; // Update to 'company_id'
    
        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('patient_photos', 's3');
            $validatedData['profile_picture'] = Storage::disk('s3')->url($path);
        }
    
        $validatedData['contacts'] = $validatedData['contacts'] ?? [];
        $validatedData['complaints'] = $validatedData['complaints'] ?? [];
        $validatedData['personal_contacts'] = $validatedData['personal_contacts'] ?? []; // Mantenha como array
    
        

        Patient::create($validatedData); // Use 'Patient' instead of 'Pacient'
    
        return redirect()->route('patients.index')->with('success', 'Paciente criado com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        // Show patient details (not implemented)
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        // Show the edit form (not implemented)
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Patient $patient)
    {
        \Log::info('Recebendo dados para atualização do paciente.', ['request_data' => $request->all()]);
    
        // Validação dos dados
        $validatedData = $request->validate([
            'patient_name' => 'required|string|max:255',
            'personal_contacts' => 'nullable|array',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string',
            'neighborhood' => 'nullable|string|max:100',
            'street' => 'nullable|string|max:200',
            'house_number' => 'nullable|string|max:10',
            'address_complement' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'cep' => 'nullable|string|max:10',
            'cpf' => 'nullable|string|max:14',
            'contacts' => 'nullable|array',
            'complaints' => 'nullable|array',
            'notes' => 'nullable|string',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'nullable|boolean',
        ]);
    
        \Log::info('Dados validados com sucesso.', ['validated_data' => $validatedData]);
    
        // Define o status padrão como true se não for fornecido
        $validatedData['status'] = $validatedData['status'] ?? true;
    
        // Atualiza o 'company_id' com base no usuário autenticado
        $validatedData['company_id'] = $request->user()->company->id;
    
        // Verifica se uma nova imagem de perfil foi enviada
        if ($request->hasFile('profile_picture')) {
            \Log::info('Nova imagem de perfil recebida.', ['profile_picture' => $request->file('profile_picture')->getClientOriginalName()]);
    
            // Apagar a foto antiga se existir
            if ($patient->profile_picture) {
                $oldPath = parse_url($patient->profile_picture, PHP_URL_PATH);
                $oldPath = ltrim($oldPath, '/');
    
                if (!empty($oldPath) && Storage::disk('s3')->exists($oldPath)) {
                    Storage::disk('s3')->delete($oldPath);
                    \Log::info('Imagem de perfil antiga deletada do S3.', ['old_path' => $oldPath]);
                }
            }
    
            // Armazena a nova imagem no S3 e atualiza o campo 'profile_picture'
            $path = $request->file('profile_picture')->store('patient_photos', 's3');
            $validatedData['profile_picture'] = Storage::disk('s3')->url($path);
    
            \Log::info('Nova imagem de perfil armazenada no S3.', ['new_path' => $validatedData['profile_picture']]);
        } else {
            // Mantém a foto de perfil antiga se nenhuma nova for enviada
            \Log::info('Nenhuma nova imagem de perfil enviada, mantendo a imagem antiga.');
            $validatedData['profile_picture'] = $patient->profile_picture;
        }
    
        // Converte 'contacts' e 'complaints' para JSON, se não houver, mantém como array vazio
        $validatedData['contacts'] = $validatedData['contacts'?? [] ];
        $validatedData['complaints'] = $validatedData['complaints'] ?? [];
        $validatedData['personal_contacts'] = $validatedData['personal_contacts'] ?? [];

        \Log::info('Atualizando o paciente com os dados validados.', ['validated_data_final' => $validatedData]);
    
        // Atualiza o paciente com os dados validados
        $updated = $patient->update($validatedData);
    
        if ($updated) {
            \Log::info('Paciente atualizado com sucesso no banco de dados.', ['patient_id' => $patient->id]);
        } else {
            \Log::error('Falha ao atualizar o paciente no banco de dados.', ['patient_id' => $patient->id]);
        }
    
        return redirect()->route('patients.index')->with('success', 'Paciente atualizado com sucesso!');
    }
    

    
    
    
    
    
    
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        // Remove the patient (not implemented)
    }
}
