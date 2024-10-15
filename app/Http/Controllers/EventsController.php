<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Consultation; // Adiciona a importação do modelo Consultation
use App\Models\Form;

class EventsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Obtém o usuário autenticado com a empresa associada
        $user = $request->user()->load('company');
        
        // Obtém o ID da empresa do usuário autenticado
        $companyId = $user->company->id; 

        // Busca eventos do usuário autenticado
        $events = Event::where('user_id', $user->id)->get();
        
        // Busca consultas relacionadas à empresa do usuário e carrega os dados completos dos pacientes
        $consultations = Consultation::with('patient')->where('company_id', $user->company->id)->get();
        
        // Transforma as consultas no formato esperado para o calendário, incluindo os dados completos dos pacientes
        $consultationEvents = $consultations->map(function ($consultation) {
            return [
                'id' => $consultation->id,
                'patient_id' => $consultation->patient_id,
                'title' => 'Consulta: ' . $consultation->patient->patient_name,
                'start' => $consultation->date . ' ' . $consultation->start_time,
                'end' => $consultation->date . ' ' . $consultation->end_time,
                'type' => 'consulta',
                'price' => $consultation->price,
                'patient' => [ // Inclui todas as informações relevantes do paciente
                    'id' => $consultation->patient->id,
                    'company_id' => $consultation->patient->company_id,
                    'patient_name' => $consultation->patient->patient_name,
                    'phone' => $consultation->patient->phone,
                    'birth_date' => $consultation->patient->birth_date,
                    'neighborhood' => $consultation->patient->neighborhood,
                    'street' => $consultation->patient->street,
                    'house_number' => $consultation->patient->house_number,
                    'address_complement' => $consultation->patient->address_complement,
                    'city' => $consultation->patient->city,
                    'state' => $consultation->patient->state,
                    'cpf' => $consultation->patient->cpf,
                    'contacts' => $consultation->patient->contacts,
                    'complaints' => $consultation->patient->complaints,
                    'notes' => $consultation->patient->notes,
                    'profile_picture' => $consultation->patient->profile_picture,
                    'status' => $consultation->patient->status,
                ]
            ];
        });
        
        // Junta eventos e consultas
        $allEvents = $events->concat($consultationEvents);
        $forms = Form::where('company_id', $companyId)->get(); // Busca os formulários da empresa do usuário

        // Retorna os dados para o Inertia com eventos e consultas, incluindo dados completos dos pacientes
        return Inertia::render('Agenda/Dashboard', [
            'events' => $allEvents,
            'forms' => $forms, // Envia os formulários para o frontend
            'auth' => [
                'user' => $user, // Envia o usuário com a empresa para o frontend
            ],
        ]);
    }
    
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'start' => 'required|date',
            'end' => 'nullable|date|after_or_equal:start',
        ]);

        Event::create($request->all());

        return redirect()->back()->with('success', 'Evento criado com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(events $events)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(events $events)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, events $events)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(events $events)
    {
        //
    }
}
