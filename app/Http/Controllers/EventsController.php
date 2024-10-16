<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Consultation; // Adiciona a importação do modelo Consultation
use App\Models\Form;
use Illuminate\Support\Facades\Cache;

class EventsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user()->load('company');
        $companyId = $user->company->id; 
    
        // Usando cache e `select()` para otimizar a consulta dos pacientes
        $consultations = Cache::remember('consultations_company_' . $companyId, 60, function () use ($companyId) {
            return Consultation::with([
                'patient' => function ($query) {
                    $query->select([
                        'id', 'company_id', 'patient_name', 'birth_date',
                        'neighborhood', 'street', 'house_number', 'address_complement',
                        'city', 'state', 'cpf', 'contacts', 'complaints', 'notes', 'profile_picture', 'status'
                    ]);
                }
            ])->where('company_id', $companyId)->get();
        });
    
        // Transformando as consultas para o formato de eventos
        $consultationEvents = $consultations->map(function ($consultation) {
            return [
                'id' => $consultation->id,
                'patient_id' => $consultation->patient_id,
                'title' => 'Consulta: ' . $consultation->patient->patient_name,
                'start' => $consultation->date . ' ' . $consultation->start_time,
                'end' => $consultation->date . ' ' . $consultation->end_time,
                'type' => 'consulta',
                'price' => $consultation->price,
                'patient' => $consultation->patient->toArray(), // Enviar os dados do paciente
            ];
        });
    
        // Unindo eventos e consultas
        $events = Event::where('user_id', $user->id)->get()->concat($consultationEvents);
        $forms = Form::where('company_id', $companyId)->get();
    
        return Inertia::render('Agenda/Dashboard', [
            'events' => $events,
            'forms' => $forms,
            'auth' => [
                'user' => $user,
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
