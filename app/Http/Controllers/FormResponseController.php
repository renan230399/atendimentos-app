<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\FormResponse;
use App\Models\FormResponseDetail;
use App\Models\Patient;
use App\Models\File;

use Illuminate\Support\Facades\Storage;

use Illuminate\Http\Request;

class FormResponseController extends Controller
{
    public function store(Request $request, Form $form)
    {
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
    
        // Criar uma nova entrada na tabela 'form_responses' com o status inicial 'incomplete'
        $formResponse = FormResponse::create([
            'form_id' => $form->id,
            'company_id' => auth()->user()->company_id,
            'patient_id' => $patient_id,
            'status' => 'incomplete',
        ]);
    
        // Iterar sobre os dados textuais em 'responses'
        $responses = $request->input('responses', []);
        foreach ($responses as $fieldId => $response) {
            if ($response !== null) {
                // Processar o dado textual e criar o registro em form_response_details
                FormResponseDetail::create([
                    'form_response_id' => $formResponse->id,
                    'form_field_id' => $fieldId,
                    'response' => is_array($response) ? json_encode($response) : $response,
                ]);
            }
        }
    
        // Iterar sobre os arquivos em 'responses'
        $files = $request->file('responses', []);
        foreach ($files as $fieldId => $file) {
            if ($file instanceof \Illuminate\Http\UploadedFile) {
                // Armazenar o arquivo no S3
                $filePath = $file->store('uploads', 's3');
    
                // Obter o URL do arquivo no S3
                $fileUrl = Storage::disk('s3')->url($filePath);
    
                // Criar o registro em form_response_details para o arquivo
                $formResponseDetail = FormResponseDetail::create([
                    'form_response_id' => $formResponse->id,
                    'form_field_id' => $fieldId,
                    'response' => $fileUrl, // Salvar o URL do arquivo
                ]);
    
                // Armazenar os metadados do arquivo na tabela 'files'
                File::create([
                    'user_id' => auth()->id(),
                    'form_response_detail_id' => $formResponseDetail->id,
                    'filename' => $file->getClientOriginalName(),
                    'path' => $fileUrl,
                    'type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }
    
        // Verificar se o formulário está completo e atualizar o status e o completed_at
        if ($this->isFormComplete($responses)) {
            $formResponse->status = 'completed';
            $formResponse->completed_at = now();
            $formResponse->save();
        }
    
        // Redirecionar com sucesso
        return redirect()->route('patients.index')->with('success', 'Respostas do formulário enviadas com sucesso!');
    }
    
    
    
    
    /**
     * Verifica se o formulário está completo com base nas respostas enviadas.
     * 
     * @param array $responses
     * @return bool
     */
    protected function isFormComplete($responses)
    {
        foreach ($responses as $response) {
            if ($response === null || $response === '') {
                return false;
            }
        }
        return true;
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
