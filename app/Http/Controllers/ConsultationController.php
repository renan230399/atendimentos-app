<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Transaction;

use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user()->load('company');
        $companyId = $user->company->id; // Obtém o ID da empresa do usuário autenticado
        // Validação dos dados da consulta de acordo com as colunas da tabela
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',   // Verifica se o paciente existe
            'date' => 'required|date',                       // Valida a data da consulta
            'start_time' => 'required',                      // Valida o horário de início
            'end_time' => 'required|after:start_time',       // Valida que o horário de fim é após o início
            'professional' => 'string|max:255',     // Valida o nome do profissional
            'notes' => 'nullable|string',                    // Observações são opcionais
            'price' => 'required|numeric',
        ]);
    
        // Criação da consulta
        $consultation = Consultation::create([
            'company_id' => $companyId,        // ID da empresa vindo diretamente do request
            'patient_id' => $validated['patient_id'],        // ID do paciente
            'date' => $validated['date'],                    // Data da consulta
            'start_time' => $validated['start_time'],        // Horário de início
            'end_time' => $validated['end_time'],            // Horário de fim
            'notes' => $validated['notes'] ?? null,          // Observações
            'price' => $validated['price'],                  // Preço da consulta
        ]);
    
        // Criação da transação associada à consulta
        Transaction::create([
            'account_id' => 2,        // Conta associada à transação
            'category_id' => 2,      // Categoria da transação
            'company_id' => $companyId,        // Empresa associada
            'type' => 'income',                              // Transação de receita para a consulta
            'amount' => $validated['price'],           // Valor da consulta em centavos (por exemplo)
            'description' => 'Receita gerada pela consulta', // Descrição da transação
            'transaction_date' => $validated['date'],        // Data da consulta como data da transação
            'status' => false,                                // Considerando que a transação está confirmada
            'related_id' => $consultation->id,               // ID da consulta criada
            'related_type' => Consultation::class,           // Classe relacionada
        ]);
    
        // Retorna uma resposta JSON com a mensagem de sucesso
        return response()->json(['message' => 'Consulta e transação criadas com sucesso.'], 201);
    }
    

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Consultation $consultation)
    {
        // Validação dos dados da consulta de acordo com as colunas da tabela
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',  // Verifica se a empresa existe
            'patient_id' => 'required|exists:patients,id',   // Verifica se o paciente existe
            'date' => 'required|date',                       // Valida a data da consulta
            'start_time' => 'required',                      // Valida o horário de início
            'end_time' => 'required|after:start_time',       // Valida que o horário de fim é após o início
            'professional' => 'required|string|max:255',     // Valida o nome do profissional
            'notes' => 'nullable|string',                    // Observações são opcionais
            'status' => 'required|in:pending,completed,cancelled',  // Valida o status da consulta
        ]);

        // Atualização da consulta
        $consultation->update([
            'company_id' => $validated['company_id'],        // ID da empresa
            'patient_id' => $validated['patient_id'],        // ID do paciente
            'date' => $validated['date'],                    // Data da consulta
            'start_time' => $validated['start_time'],        // Horário de início
            'end_time' => $validated['end_time'],            // Horário de fim
            'professional' => $validated['professional'],    // Profissional
            'notes' => $validated['notes'] ?? null,          // Observações
            'status' => $validated['status'],                // Status
        ]);

        // Retorna uma resposta JSON com a mensagem de sucesso
        return response()->json(['message' => 'Consulta atualizada com sucesso.'], 200);
    }

    /**
     * Método para buscar as consultas de um paciente específico
     */
    public function getConsultationsByPatient($id)
    {
        try {
            // Buscando todas as consultas para o paciente com o ID informado
            $consultations = Consultation::where('patient_id', $id)->get();

            // Retornando as consultas em formato JSON
            return response()->json($consultations);
        } catch (\Exception $e) {
            // Em caso de erro, retornar uma resposta adequada
            return response()->json(['error' => 'Erro ao buscar consultas'], 500);
        }
    }
}
