// 1. Configurar o AWS SDK para LocalStack
AWS.config.update({
    region: 'us-east-1', // A região não importa muito no LocalStack
    accessKeyId: 'test', 
    secretAccessKey: 'test', 
    
    // *** OBRIGATÓRIO: Define o endpoint para o LocalStack ***
    endpoint: 'http://localhost:4566' 
});

// Cria uma instância do DynamoDB Client
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'UsuariosLogin';

// =================================================================
// 2. FUNÇÃO PARA CADASTRAR (GRAVAR) USUÁRIO - PutItem
// =================================================================
function cadastrarUsuario() {
    const login = document.getElementById('cadLogin').value;
    const senha = document.getElementById('cadSenha').value;
    const statusEl = document.getElementById('statusCadastro');
    
    if (!login || !senha) {
        statusEl.className = 'status error';
        statusEl.textContent = 'Preencha o Login e a Senha.';
        return;
    }

    const params = {
        TableName: TABLE_NAME,
        Item: {
            'login': login, // Chave Primária
            'senha': senha, // Atenção: Em um ambiente real, NUNCA grave a senha em texto puro! Use hash (ex: bcrypt).
            'criadoEm': new Date().toISOString()
        }
    };

    statusEl.className = 'status info';
    statusEl.textContent = 'Cadastrando usuário...';

    dynamodb.put(params, function(err, data) {
        if (err) {
            console.error("Erro ao cadastrar:", JSON.stringify(err, null, 2));
            statusEl.className = 'status error';
            statusEl.textContent = `ERRO: Não foi possível cadastrar o login "${login}".`;
        } else {
            console.log("Usuário cadastrado com sucesso:", JSON.stringify(data, null, 2));
            statusEl.className = 'status success';
            statusEl.textContent = `Usuário "${login}" cadastrado com sucesso!`;
            // Limpa os campos
            document.getElementById('cadLogin').value = '';
            document.getElementById('cadSenha').value = '';
        }
    });
}

// =================================================================
// 3. FUNÇÃO PARA FAZER LOGIN (BUSCAR) USUÁRIO - GetItem
// =================================================================
function fazerLogin() {
    const login = document.getElementById('logLogin').value;
    const senha = document.getElementById('logSenha').value;
    const statusEl = document.getElementById('statusLogin');

    if (!login || !senha) {
        statusEl.className = 'status error';
        statusEl.textContent = 'Preencha o Login e a Senha.';
        return;
    }

    const params = {
        TableName: TABLE_NAME,
        Key: {
            'login': login // Busca pelo Login (Chave Primária)
        }
    };
    
    statusEl.className = 'status info';
    statusEl.textContent = 'Verificando credenciais...';

    dynamodb.get(params, function(err, data) {
        if (err) {
            console.error("Erro na busca de login:", JSON.stringify(err, null, 2));
            statusEl.className = 'status error';
            statusEl.textContent = 'Ocorreu um erro na conexão. Tente novamente.';
        } else {
            if (data.Item) {
                // Usuário encontrado
                if (data.Item.senha === senha) {
                    statusEl.className = 'status success';
                    statusEl.textContent = `Login bem-sucedido! Bem-vindo(a), ${login}.`;
                } else {
                    // Senha incorreta
                    statusEl.className = 'status error';
                    statusEl.textContent = 'Senha incorreta.';
                }
            } else {
                // Usuário não encontrado
                statusEl.className = 'status error';
                statusEl.textContent = 'Usuário não encontrado.';
            }
        }
    });
}

// =================================================================
// 4. AVISO DE SEGURANÇA (Importante!)
// =================================================================
console.warn("AVISO DE SEGURANÇA: Esta demonstração conecta diretamente o seu frontend ao DynamoDB (mesmo que seja o LocalStack). Em produção, você deve usar um serviço de backend (Lambda, API Gateway, etc.) para isolar o DynamoDB e proteger as credenciais AWS.");