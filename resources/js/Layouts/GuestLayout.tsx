import ApplicationLogo from '@/Components/ApplicationLogo';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
           <div className='m-auto w-[100%]'>
                <div className=''>
                        <ApplicationLogo className="m-auto w-24 h-24 fill-current text-gray-500" />
                </div>

                <div className=" m-auto  sm:max-w-md mt-6 px-6 py-4 rounded bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                    {children}
                </div>
           </div>
            
        </div>
    );
}
