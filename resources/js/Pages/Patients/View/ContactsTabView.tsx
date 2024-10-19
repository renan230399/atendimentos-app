import React, { useState} from 'react';
import { TabView, TabPanel } from 'primereact/tabview'; // Certifique-se de estar importando o TabView e TabPanel corretamente
import { UserIcon, PhoneIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Contact, ContactDetail, Patient } from '../interfacesPatients';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaEnvelope,FaPhone,FaMapMarkerAlt } from 'react-icons/fa';
import { RiWhatsappFill } from "react-icons/ri";
import { FaUsersBetweenLines, FaMapLocationDot  } from "react-icons/fa6";
import { PiUserListFill } from "react-icons/pi";
import ConsultationsList from './ConsultationsList';
import ContactItem from './ContactItem';
import { FaListCheck } from "react-icons/fa6";
import { FaIdCard,FaCalendarAlt } from 'react-icons/fa';
import { formatDateAndAge } from '@/Components/Utils/dateUtils';
import { FaTransgender } from "react-icons/fa6";

// Função para obter o ícone e o título com base no tipo de contato
const getIconAndTitle = (type:number, category:string) => {
  if(category === 'link'){
      switch (type) {
        case 1:
            return { icon: <FaInstagram className="text-pink-500" />, title: 'Instagram' };
        case 2:
            return { icon: <FaFacebook className="text-blue-600" />, title: 'Facebook' };
        case 3:
            return { icon: <FaTwitter className="text-blue-400" />, title: 'Twitter' };
        case 4:
            return { icon: <FaLinkedin className="text-blue-700" />, title: 'LinkedIn' };
        case 5:
            return { icon: <FaEnvelope className="text-gray-600" />, title: 'E-mail' };
        default:
            return { icon: null, title: 'Contato' }; // Valor padrão se não encontrar correspondência
    }
  }else{
    switch (type) {
      case 1:
          return { icon: <RiWhatsappFill className="text-green-500" />, title: 'Whatsapp' };
      case 2:
          return { icon: <FaPhone className="text-blue-600" />, title: 'Telefone Fixo' };
      default:
        return { icon: null, title: 'Contato' }; // Valor padrão se não encontrar correspondência
  }
  }
};
interface Address {
  state: string;
  city: string;
  neighborhood: string;
  street: string | null;          // Rua pode ser nula
  house_number: string | null;    // Número da casa pode ser nulo
  address_complement: string;     // Complemento do endereço
};
interface ContactsTabViewProps {
  patientId:number | undefined;
  personalContacts: ContactDetail[];
  contacts: Contact[];
  address:Address;
  patient:Patient;
}

const ContactsTabView: React.FC<ContactsTabViewProps> = ({ personalContacts, contacts, address, patientId, patient }) => {
 // const sortedContacts = personalContacts.sort((a, b) => a.type - b.type);
  //const sortedPersonalContacts = [...personalContacts].sort((a, b) => (a.type ?? 0) - (b.type ?? 0));
  const groupedPersonalContacts = personalContacts.reduce((acc, contact) => {
    const type = contact.category ?? ''; // Use '0' como valor padrão se 'type' for nulo ou indefinido
    if (!acc[type]) {
        acc[type] = []; // Se não existir um grupo para esse 'type', cria-se um array vazio
    }
    acc[type].push(contact); // Adiciona o contato ao grupo correspondente
    return acc;
}, {} as Record<string, ContactDetail[]>);

  return (
      
 
    <TabView
      className="rounded-lg w-full border-b dark:border-gray-800 bg-white dark:bg-gray-900"
      panelContainerClassName=""
    >
   <TabPanel header={ 
    <div className='flex'>
                    <PiUserListFill 
                        className="w-8 h-8 md:w-6 md:h-6 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                    <p className="my-auto ml-2">Informações do Paciente</p>
    </div>
}>
     <div className="flex flex-wrap  xl:h-[60vh] md:h-[70vh]">

    <div className='w-full flex flex-wrap m-auto'>
    <div className="flex space-x-4 mx-auto">
            <FaCalendarAlt className="w-8 h-8 text-blue-500" />
            <div>
                <p className="text-sm text-gray-500">Data de Nascimento</p>
                <p className="text-md font-semibold">
                    {patient.birth_date ? formatDateAndAge(patient.birth_date) : 'Data de nascimento não disponível'}
                </p>
            </div>
        </div>

        {/* CPF */}
        <div className="flex space-x-4 mx-auto">
            <FaIdCard className="w-8 h-8 text-blue-500" />
            <div>
                <p className="text-sm text-gray-500">CPF</p>
                <p className="text-md font-semibold">
                    {patient.cpf ?? 'Não informado'}
                </p>
            </div>
        </div>

        {/* Gênero */}
        <div className="flex space-x-4 mx-auto">
            <FaTransgender className="w-8 h-8 text-gray-600" />
            <div>
                <p className="text-sm text-gray-500">Gênero</p>
                <p className="text-md font-semibold">
                    {patient.gender ?? 'Não informado'}
                </p>
            </div>
        </div>

    </div>
    <div className="flex space-x-4 mx-auto w-full">
            <div className='w-full'>
                <p className="text-sm text-gray-500">Observações</p>
                <div className='w-full'>
                  <textarea readOnly className="text-md w-full text-sm text-gray-500  border border-gray-200 p-2 rounded">
                      {patient.notes ?? 'Não informado'}
                  </textarea>
                </div>

            </div>
        </div>
    <div className="w-[78%] flex-grow flex overflow-y-auto">

        <div className='flex '>
        {Object.keys(groupedPersonalContacts).map((category) => (
            <div key={category}>
                <h3 className="text-lg font-bold">Type {category}</h3>
                <div className="w-full flex-wrap flex border p-3">
                    {groupedPersonalContacts[String(category)].map((personalContact, index) => {
                        const { icon, title } = getIconAndTitle(Number(personalContact.type), personalContact.category);
                        return (
                          <>
                          {personalContact.category}
                              <ContactItem
                                key={index}
                                icon={icon}
                                title={title}
                                value={personalContact.value}
                                category={personalContact.category}
                            />
                          </>

                        );
                    })}
                </div>
            </div>
        ))}
        </div>

        </div>
        <div className="md:w-[18%] xl:w-[20%] m-auto" >
                  <img src="https://keyar-atendimentos.s3.amazonaws.com/icones/contatos.png" className="m-auto w-20 h-20 md:w-40 md:h-40" />
          </div>
        </div>
</TabPanel>

<TabPanel header={ 
    <div className='flex'>
        <FaUsersBetweenLines className="w-8 h-8 md:w-6 md:h-6 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
        <p className="my-auto ml-2">Contatos Próximos</p>
    </div>
}>
      <div className="flex flex-wrap gap-4 h-[70vh] overflow-y-auto">

  {contacts.length > 0 ? (
    <>
      {contacts.map((contact, index) => (
        <div
          key={index}
          className="w-full md:w-[100%] py-3 bg-white flex flex-wrap "
        >
          <div className="flex items-center m-auto">
            <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
            <p>
              <strong>Nome:</strong> {contact.name}
            </p>
          </div>
          <div className="flex items-center m-auto">
            <UserGroupIcon className="h-5 w-5 text-green-500 mr-2" />
            <p>
              <strong>Relação:</strong> {contact.relation}
            </p>
          </div>
          <div className="flex flex-wrap items-center m-auto w-full md:w-[60%]">
          {Array.isArray(contact.contacts) && contacts.length > 0 ? (
                contact.contacts.map((detail, contactIndex) => {
                    const { icon, title } = getIconAndTitle(Number(detail.type), detail.category);
                    return (
                        <ContactItem
                            key={contactIndex}
                            icon={icon}
                            title={title}
                            value={detail.value}
                            category={detail.category}
                        />
                    );
                })
            ) : (
                <p className="text-gray-600">Nenhum detalhe de contato disponível.</p>
            )}
            
          </div>
        </div>
       
      ))}
   </>) : (
    <p className="text-gray-600">Não há contatos disponíveis.</p>
  )}
      </div>

</TabPanel>

<TabPanel header={ 
    <div className='flex'>
        <FaMapLocationDot 
            className="w-8 h-8 md:w-6 md:h-6 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
        <p className="my-auto ml-2">Endereço</p>
    </div>
}>
         <div className='h-[70vh] flex flex-wrap md:flex-col xl:flex-wrap place-items-start'>
            <div className="mx-auto flex justify-center w-[20%] md:w-full">
                <img 
                    src="https://keyar-atendimentos.s3.amazonaws.com/icones/localizacao.png" 
                    className="w-full md:w-24 md:h-24 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                    alt="Ícone de localização" 
                />
            </div>
         <div className="w-[68%] md:w-[68%] flex flex-col mx-auto">
                {/* Estado, Cidade, e Bairro */}
                    <p className="text-lg text-gray-800">
                        <strong>Estado:</strong> {address.state}
                    </p>
                    <p className="text-lg text-gray-800">
                        <strong>Cidade:</strong> {address.city}
                    </p>
                    <p className="text-lg text-gray-800">
                        <strong>Bairro:</strong> {address.neighborhood}
                    </p>
                    </div>
                {/* Rua e Complemento */}
                <div className="flex mx-auto w-full md:w-[68%]">
                    <FaMapMarkerAlt className="text-blue-500 my-auto mr-3" />
                    <div>
                        <h1>
                            <strong>Endereço:</strong>{' '}
                            {address.street && address.house_number ? (
                                `${address.street}, ${address.house_number}`
                            ) : (
                                'Endereço não informado'
                            )}
                        </h1>
                        <p>
                            <strong>Complemento:</strong> {address.address_complement}
                        </p>
               
            </div>
        </div>
         </div>

</TabPanel>
<TabPanel header={ 
    <div className='flex'>
        <FaListCheck 
            className="w-8 h-8 md:w-6 md:h-6 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
        <p className="my-auto ml-2">Atendimentos</p>
    </div>
}>
    <div className="flex flex-wrap gap-4 h-[70vh] overflow-y-auto w-full mx-auto">
                {/* Lista de Consultas do Paciente */}
                <ConsultationsList patientId={Number(patientId)} />
    </div>


</TabPanel>
    </TabView>
   

  );
};

export default ContactsTabView;
