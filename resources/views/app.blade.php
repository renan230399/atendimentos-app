<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Keyar') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link rel="icon" id="dynamic-favicon" href="{{ asset('favicon.ico') }}" type="image/x-icon">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Supondo que você tenha uma variável global com dados do usuário
                const user = @json(auth()->user());

                function updateFavicon(iconUrl) {
                    const favicon = document.getElementById('dynamic-favicon');
                    if (favicon) {
                        favicon.href = iconUrl;
                    }
                }
                // Lógica para definir o favicon com base no perfil do usuário
                if (user) {
                    if (user.role === 'admin') {
                        updateFavicon('{{ asset('favicons/keyar.ico') }}'); // Favicon para administrador
                    } else if (user.role === 'guest') {
                        updateFavicon('{{ asset('favicons/keyar.ico') }}'); // Favicon para administrador
                    } else {
                        updateFavicon('{{ asset('favicons/keyar.ico') }}'); // Favicon para administrador
                    }
                }
            });
        </script>

    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
