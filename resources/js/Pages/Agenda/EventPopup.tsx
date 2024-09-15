// EventDetailsPopup.jsx
import React from 'react';
import PopUpComponent from '@/Layouts/PopupComponent';
import moment from 'moment';
import PropTypes from 'prop-types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';


const EventDetailsPopup = ({ eventoSelecionado, params, onClose, onDelete }) => (
    <PopUpComponent id="detalhesEvento" params={params} onClose={onClose}>
        <div className='flex text-center center flex-wrap px-10 py-5'>
            <div className='w-[100%]'>
                <h2>{eventoSelecionado.title}</h2>
            </div>
            <div className='w-[40%]'>
                <InputLabel htmlFor='conteudo' value='Descrição:' />
                <TextInput
                    id="conteudo"
                    name="conteudo" 
                    className="mt-1 block w-full"
                />
            </div>
            <div className='w-[40%]'>
                <button className='bg-green-500 text-white-500 py-2 px-5 rounded '>Concluir</button>

            </div>
            <p>Início: {moment(eventoSelecionado.start).format('DD/MM/YYYY HH:mm')}</p>
            <p>Fim: {moment(eventoSelecionado.end).format('DD/MM/YYYY HH:mm')}</p>
            <button onClick={() => onDelete(eventoSelecionado.id)}>Excluir Evento</button>
        </div>
    </PopUpComponent>
);

EventDetailsPopup.propTypes = {
    eventoSelecionado: PropTypes.object,
    params: PropTypes.object.isRequired, // Adicione esta linha para os parâmetros
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default EventDetailsPopup;
