import React from 'react';
import { FaUsersBetweenLines, FaMapLocationDot  } from "react-icons/fa6";
import { PiUserListFill } from "react-icons/pi";
import { Contact, ContactDetail } from '../interfacesPatients';
import PersonalContactSection from './PersonalContactSection';
import { TabView } from 'primereact/tabview';
import { TabPanel } from 'primereact/tabview';
import PersonContactCard from './PersonContactCard';
import AddressSection from './AddressSection'
interface ContactSectionProps {
    data: {
        contacts: Contact[];
        personal_contacts: ContactDetail[];
        state: string;
        city: string;
        neighborhood: string;
        street: string;
        house_number: string;
        address_complement?: string;
        [key: string]: any; // Permite campos adicionais
    };
    setData: (field: string, value: any) => void;
    errors: {
        state?: string;
        city?: string;
        neighborhood?: string;
        street?: string;
        house_number?: string;
        address_complement?: string;
        [key: string]: any;
    };
}

const ContactSection: React.FC<ContactSectionProps> = ({ data, setData, errors }) => {

    // Atualiza os dados gerais da pessoa (nome, relação)
    const handlePersonChange = (personIndex: number, field: keyof Contact, value: any) => {
        const updatedContacts = [...data.contacts];
        updatedContacts[personIndex][field] = value;
        setData('contacts', updatedContacts);
    };
    

    // Atualiza os contatos de uma pessoa específica
    const handlePersonContactChange = (personIndex: number, contactIndex: number, field: string, value: any) => {
        const updatedContacts = data.contacts.map((person, pIndex) => {
            if (pIndex === personIndex) {
                const updatedPersonContacts = person.contacts.map((contact, cIndex) => {
                    if (cIndex === contactIndex) {
                        return { ...contact, [field]: value };
                    }
                    return contact;
                });
                return { ...person, contacts: updatedPersonContacts };
            }
            return person;
        });
        setData('contacts', updatedContacts);
    };
    

    // Atualiza o campo de relação da pessoa com o paciente
    const handleRelationChange = (personIndex: number, relationValue: string) => {
        const updatedContacts = data.contacts.map((person, index) => {
            if (index === personIndex) {
                return { ...person, relation: relationValue };
            }
            return person;
        });
        setData('contacts', updatedContacts);
    };
    

// Adiciona uma nova pessoa com um contato vazio
const addContact = () => {
    setData('contacts', [
        ...data.contacts,
        {
            name: '',
            relation: '',
            contacts: [{ type: '', value: '', category: 'phone' }] // Defina 'category' como um dos valores permitidos
        }
    ]);
};


    // Adiciona um novo contato para uma pessoa específica
    const addNewContactForPerson = (personIndex: number) => {
        const newContact = { type: '', value: '', category: 'phone' }; // Defina 'category' como 'phone', 'link' ou 'string'
        const updatedContacts = data.contacts.map((person, index) => {
            if (index === personIndex) {
                return {
                    ...person,
                    contacts: [...person.contacts, newContact],
                };
            }
            return person;
        });
        setData('contacts', updatedContacts);
    };
    
    

    // Remove um contato específico de uma pessoa
    const removeContact = (personIndex: number, contactIndex: number) => {
        const updatedContacts = data.contacts.map((person, pIndex) => {
            if (pIndex === personIndex) {
                const updatedPersonContacts = person.contacts.filter((_, cIndex) => cIndex !== contactIndex);
                return { ...person, contacts: updatedPersonContacts };
            }
            return person;
        });
        setData('contacts', updatedContacts);
    };
    

    // Remove uma pessoa inteira da lista de contatos
    const removePerson = (personIndex: number) => {
        setData('contacts', data.contacts.filter((_, index) => index !== personIndex));
    };
    

    return (
        <>


            <div className='w-[100%] md:w-full flex flex-wrap gap-1 border-b-2 pb overflow-y-auto'>
            <TabView
                className="shadow-lg rounded-lg w-full  dark:border-gray-800 bg-white dark:bg-gray-900"
                panelContainerClassName=""
                >
                        <TabPanel header={ 
                            <div className='flex'>
                                <PiUserListFill 
                                    className="w-8 h-8 md:w-6 md:h-6 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                                />
                                <p className="my-auto ml-2">Contatos</p>
                            </div>
                        }>
                            <div className='flex'>
                                <div className='w-[100%] md:w-[20%] m-auto'>
                                    <img src="https://keyar-atendimentos.s3.amazonaws.com/icones/contatos.png" className="m-auto w-20 h-20 md:w-40 md:h-40" alt="Contatos" />
                                </div>
                                
                            <div className='w-[80%]'>
                                <PersonalContactSection 
                                    personal_contacts={data.personal_contacts}
                                    setData={setData}
                                />
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
                        {Array.isArray(data.contacts) && data.contacts.length > 0 ? (
                        data.contacts.map((person, personIndex) => (
                            <PersonContactCard
                                key={personIndex}
                                person={person}
                                personIndex={personIndex}
                                handlePersonChange={handlePersonChange}
                                handlePersonContactChange={handlePersonContactChange}
                                addNewContactForPerson={addNewContactForPerson}
                                removeContact={removeContact}
                                removePerson={removePerson}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">Nenhuma pessoa inserida.</p>
                    )}

                <div className='w-full'>
                    <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                        onClick={addContact}
                    >
                        Adicionar nova pessoa
                    </button>
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
                        <div className='xl:h-[35vh] overflow-y-auto'>  
                            <AddressSection data={data} setData={setData} errors={errors}/>
                        </div> 
                        </TabPanel>

            </TabView>                

                
            </div>
        </>
    );
};

export default ContactSection;
