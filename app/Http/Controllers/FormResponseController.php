<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\FormResponse;
use App\Models\FormResponseDetail;
use App\Models\Patient;

use Illuminate\Http\Request;

class FormResponseController extends Controller
{
    public function store(Request $request, Form $form)
    {
        // Debugging para ver as respostas e o patient_id
        //dd($request->all()); // Mostrará todas as informações recebidas na requisição
    
        // Verificação de autenticação
        if (!auth()->check()) {
            return redirect()->route('login')->withErrors(['Você precisa estar autenticado para enviar o formulário.']);
        }
    
        // Capturar o ID do paciente
        $patient_id = $request->input('patient_id');
    
        // Validar se o patient_id foi enviado corretamente
        if (!$patient_id) {
            return back()->withErrors(['error' => 'O paciente não foi selecionado.']);
        }
    
        // Criar uma nova entrada na tabela 'form_responses'
        $formResponse = FormResponse::create([
            'form_id' => $form->id,
            'company_id' => auth()->user()->company_id,
            'patient_id' => $patient_id, // O patient_id não será nulo
        ]);
    
        // Verificar o conteúdo das respostas
        if (empty($request->input('responses'))) {
            return back()->withErrors(['error' => 'Nenhuma resposta foi enviada.']);
        }
    
        // Iterar sobre as respostas
        foreach ($request->input('responses') as $fieldId => $response) {
            if ($response !== null) {
                if (!empty($fieldId)) {
                    FormResponseDetail::create([
                        'form_response_id' => $formResponse->id,
                        'form_field_id' => $fieldId,
                        'response' => is_array($response) ? json_encode($response) : $response,
                    ]);
                }
            }
        }
    
        // Redirecionar com sucesso
        return redirect()->route('patients.index')->with('success', 'Respostas do formulário enviadas com sucesso!');
    }
        // Método para buscar todas as respostas de um paciente específico
        public function getFormResponsesByPatient($patient_id)
        {
            try {
                // Verificar se o paciente existe
                $patientExists = Patient::find($patient_id);
                if (!$patientExists) {
                    return response()->json(['message' => 'Paciente não encontrado.'], 404);
                }
        
                // Capturar as informações do paciente e verificar se ele existe
                $formResponses = FormResponse::where('patient_id', $patient_id)
                    ->with(['form', 'formResponseDetails.formField']) // Inclui os detalhes do formulário e os campos
                    ->get();
        
                // Depuração: verificar se os dados estão sendo buscados corretamente
                if ($formResponses->isEmpty()) {
                    return response()->json([
                        'message' => 'Nenhuma resposta encontrada para este paciente.',
                    ], 404);
                }
        
                // Depuração: verificar os dados retornados
                 //dd($formResponses);
                // Log::info($formResponses);
        
                // Retorna as respostas encontradas
                return response()->json($formResponses, 200);
        
            } catch (\Exception $e) {
                // Registrar o erro no log para rastrear a origem do problema
                \Log::error('Erro ao buscar as respostas de formulários do paciente: ' . $e->getMessage());
        
                // Retornar uma resposta de erro com a mensagem da exceção
                return response()->json([
                    'message' => 'Ocorreu um erro ao buscar as respostas do formulário.',
                    'error' => $e->getMessage(),  // Mostrar a mensagem do erro
                ], 500);
            }
        }
        
  

    
}
