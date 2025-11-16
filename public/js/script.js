document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastro');
    const mensagem = document.getElementById('mensagem');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const idade = document.getElementById('idade').value;
        const email = document.getElementById('email').value.trim();

        // Validação básica no frontend
        if (!nome || !idade || !email) {
            mostrarMensagem('Preencha todos os campos!', 'red');
            return;
        }

        if (idade < 1) {
            mostrarMensagem('Idade deve ser maior que 0', 'red');
            return;
        }

        try {
            const response = await fetch('/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, idade, email })
            });

            const data = await response.json();

            if (response.ok) {
                mostrarMensagem(data.mensagem, 'green');
                form.reset();
            } else {
                mostrarMensagem(data.erro || 'Erro ao cadastrar', 'red');
            }
        } catch (err) {
            mostrarMensagem('Erro de conexão com o servidor', 'red');
            console.error(err);
        }
    });

    function mostrarMensagem(texto, cor) {
        mensagem.textContent = texto;
        mensagem.style.color = cor;
    }
});