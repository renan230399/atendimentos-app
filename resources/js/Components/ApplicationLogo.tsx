import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 316 316" xmlns="http://www.w3.org/2000/svg">
            <image href="https://keyar-atendimentos.s3.amazonaws.com/logos_empresas/logo_keyar.svg" width="316" height="316" />
        </svg>
    );
}
