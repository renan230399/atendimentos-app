import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, 'resources/js/Components'), // Alias para diretório de componentes
            '@images': path.resolve(__dirname, 'storage/app/public/images'), // Alias para diretório de imagens
            '@styles': path.resolve(__dirname, 'resources/css'), // Alias para diretório de estilos
            '@layouts': path.resolve(__dirname, 'resources/js/Layouts'), // Alias para diretório de layouts
            '@pages': path.resolve(__dirname, 'resources/js/Pages'), // Alias para diretório de páginas
            '@lixo': path.resolve(__dirname, 'resources/js/lixo'), // Alias para diretório de páginas
        },
    },
    watch: {
        usePolling: true,
        origin: 'http://localhost'
    },
    server: {
        hmr: {
            host: 'localhost'
        }
    }

});
