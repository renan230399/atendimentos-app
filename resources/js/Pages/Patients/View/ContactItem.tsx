import React from 'react';

interface ContactItemProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    category: string;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, title, value, category }) => {
    return (
        <>
            {category === 'link' ? (
                <a 
                    href={value}
                    className="my-auto"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="flex flex-col my-auto md:flex-row items-start md:items-center bg-gray-50 p-1 rounded-lg shadow-md m-2">
                        <div className="flex flex-col items-center m-2">
                            <div className="flex items-center">
                                {icon && <div className="mr-2">{icon}</div>}
                                <p className="text-gray-700">{title || 'Não cadastrado'}</p>
                            </div>
                        </div>
                    </div>
                </a>
            ) : (
                <div className="flex flex-col my-auto md:flex-row items-start md:items-center rounded-lg">
                    <div className="flex flex-col my-auto md:flex-row items-start md:items-center bg-gray-50  rounded-lg shadow-lg m-4">
                    <a href={`https://wa.me/55${value}`} target="_blank" rel="noopener noreferrer">

                        <div className="flex flex-col items-center m-4">
                            <div className="flex items-center">
                                {icon && <div className="mr-2 text-blue-500">{icon}</div>} {/* Ícone com cor azul */}
                                <p className="text-gray-700 font-semibold">{value || 'Não especificado'}</p>
                            </div>              
                         
                            </div>
                            </a>
                        </div>
                    </div>

            )}
        </>
    );
};

export default ContactItem;
