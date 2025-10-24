# Bitcoin Tracker

**Português** | [English](#english)

## Sobre o Projeto

O **Bitcoin Tracker** é uma aplicação web para registro e acompanhamento de transações de compra e venda de Bitcoin (BTC), com cálculo automático do total vendido por mês e verificação de isenção de Imposto de Renda (IR) no Brasil. No Brasil, vendas de criptoativos até R$ 35.000 por mês são isentas de IR, conforme Instrução Normativa RFB nº 1.888/2019. A aplicação ajuda investidores a gerenciar suas transações e monitorar se estão dentro do limite de isenção.

### Funcionalidades
- **Autenticação Segura:** Geração e validação de chaves API (JWT) para acesso seguro.
- **Registro de Transações:** Insira compras e vendas de BTC com data, quantidade, preço unitário (BRL) e notas.
- **Listagem e Filtro:** Visualize transações filtradas por mês, com resumo de vendas e status de isenção de IR.
- **Exportação CSV:** Baixe o extrato de transações em formato CSV.
- **Validações:** Campos obrigatórios (quantidade BTC e preço unitário) com feedback visual.
- **Design Responsivo:** Interface amigável com Tailwind CSS, otimizada para desktop e mobile.

## Contexto Brasileiro
No Brasil, a Receita Federal exige que vendas de criptoativos (como Bitcoin) sejam declaradas. Vendas mensais até R$ 35.000 são isentas de Imposto de Renda, mas acima disso podem estar sujeitas a tributação. O **Bitcoin Tracker** calcula automaticamente o total vendido no mês e indica se o usuário está isento ou não, facilitando a conformidade fiscal.

## Pré-requisitos
- **Node.js** (v18+ recomendado)
- **MongoDB** (local ou Atlas)
- **NPM** (v8+)

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/bitcoin-tracker.git
   cd bitcoin-tracker
   ```

2. **Instale dependências do backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Configure variáveis de ambiente:**
   Crie um arquivo `.env` na pasta `backend`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bitcoin-tracker
   JWT_SECRET=sua-chave-secreta-aqui
   PORT=5001
   ```

4. **Inicie o backend:**
   ```bash
   npm start
   ```

5. **Instale dependências do frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Inicie o frontend:**
   ```bash
   npm run serve
   ```

7. **Acesse a aplicação:**
   - Frontend: `http://localhost:8080`
   - Backend API: `http://localhost:5001/api`

## Uso

1. **Login:**
   - Acesse `/login` e clique em "Gerar Chave API".
   - Cole a chave gerada e clique em "Salvar Chave" para autenticar.
   - Você será redirecionado para o dashboard.

2. **Registrar Transação:**
   - No dashboard, preencha o formulário com tipo (compra/venda), data, quantidade BTC, preço unitário (BRL) e notas.
   - Validações impedem inserções com valores inválidos (ex: quantidade ou preço zero).

3. **Visualizar Extrato:**
   - Filtre transações por mês usando o campo `<input type="month">`.
   - Veja o total vendido no mês e o status de isenção de IR (≤ R$ 35.000).

4. **Exportar CSV:**
   - Clique em "Exportar CSV" para baixar o extrato do mês selecionado.

## Tecnologias
- **Frontend:** Vue.js 3, Vue Router, Pinia, Tailwind CSS 3, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **Outros:** dotenv, cors

## Notas para Usuários Internacionais
O **Bitcoin Tracker** foi projetado com foco na legislação brasileira, que isenta vendas de criptoativos até R$ 35.000 por mês de Imposto de Renda. Fora do Brasil, as regras fiscais variam, e o cálculo de isenção pode não se aplicar. Para adaptar, modifique a lógica de cálculo no backend (`routes/transactions.js`) ou desative o resumo de isenção no frontend (`TransactionList.vue`).

## Contribuição
1. Fork o repositório.
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas alterações (`git commit -m 'Adiciona nova funcionalidade'`).
4. Push para a branch (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

## Licença
MIT License. Veja [LICENSE](LICENSE) para detalhes.

---

## English

# Bitcoin Tracker

**English** | [Português](#sobre-o-projeto)

## About the Project

**Bitcoin Tracker** is a web application for recording and tracking Bitcoin (BTC) buy and sell transactions, with automatic calculation of monthly sales and verification of tax exemption in Brazil. In Brazil, crypto asset sales up to R$ 35,000 per month are exempt from income tax, as per Normative Instruction RFB nº 1.888/2019. The app helps investors manage transactions and monitor tax compliance.

### Features
- **Secure Authentication:** Generate and validate API keys (JWT) for secure access.
- **Transaction Recording:** Add BTC buy/sell transactions with date, amount, unit price (BRL), and notes.
- **Listing and Filtering:** View transactions filtered by month, with a summary of sales and tax exemption status.
- **CSV Export:** Download transaction statements as CSV files.
- **Validations:** Mandatory fields (BTC amount and unit price) with visual feedback.
- **Responsive Design:** User-friendly interface with Tailwind CSS, optimized for desktop and mobile.

## Brazilian Context
In Brazil, the Federal Revenue Service requires crypto asset sales to be reported. Monthly sales up to R$ 35,000 are exempt from income tax, but amounts above may be taxable. **Bitcoin Tracker** automatically calculates monthly sales and indicates whether the user is exempt, aiding tax compliance.

## Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (local or Atlas)
- **NPM** (v8+)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/bitcoin-tracker.git
   cd bitcoin-tracker
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend` folder:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bitcoin-tracker
   JWT_SECRET=your-secret-key-here
   PORT=5001
   ```

4. **Start the backend:**
   ```bash
   npm start
   ```

5. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Start the frontend:**
   ```bash
   npm run serve
   ```

7. **Access the application:**
   - Frontend: `http://localhost:8080`
   - Backend API: `http://localhost:5001/api`

## Usage

1. **Login:**
   - Go to `/login` and click "Generate API Key."
   - Paste the generated key and click "Save Key" to authenticate.
   - You will be redirected to the dashboard.

2. **Record a Transaction:**
   - In the dashboard, fill out the form with type (buy/sell), date, BTC amount, unit price (BRL), and notes.
   - Validations prevent submissions with invalid values (e.g., zero amount or price).

3. **View Statement:**
   - Filter transactions by month using the `<input type="month">` field.
   - See the total monthly sales and tax exemption status (≤ R$ 35,000).

4. **Export CSV:**
   - Click "Export CSV" to download the statement for the selected month.

## Technologies
- **Frontend:** Vue.js 3, Vue Router, Pinia, Tailwind CSS 3, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **Others:** dotenv, cors

## Notes for International Users
**Bitcoin Tracker** is tailored to Brazilian tax regulations, which exempt crypto sales up to R$ 35,000 per month from income tax. Tax rules vary by country, and the exemption logic may not apply elsewhere. To adapt, modify the tax calculation logic in the backend (`routes/transactions.js`) or disable the exemption summary in the frontend (`TransactionList.vue`).

## Contributing
1. Fork the repository.
2. Create a branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

## License
MIT License. See [LICENSE](LICENSE) for details.