# Política de segurança | OBVA-Capanema

## Como relatar um problema

Se você encontrou uma falha de segurança ou um dado exposto por engano nesta página ou nos materiais do projeto, escreva para **[E-MAIL DE CONTATO DO PROJETO]** com o assunto "Segurança". Não publique o problema antes de falarmos. Respondemos em até 5 dias úteis.

## O que esta página faz para se proteger

- **Página estática:** não há servidor, banco de dados, login nem formulário próprio. Os questionários ficam no Google Formulários.
- **Política de segurança de conteúdo (CSP)** no `index.html`: só roda código e carrega fontes e estilos do próprio site; bloqueia scripts de terceiros e conexões externas. Só aceita painéis incorporados do Looker Studio e do Power BI.
- **Sem recursos de terceiros:** as fontes (Inter e Space Grotesk) ficam no próprio repositório, o que evita enviar o endereço IP dos visitantes ao Google Fonts.
- **Links externos** abrem com `noopener noreferrer`, e o `config.js` só aceita endereços `https://`.
- **Sem cookies, sem anúncios, sem rastreadores.**
- **Referrer** limitado ao mínimo (`strict-origin-when-cross-origin`).

## Limites do GitHub Pages

O GitHub Pages não permite configurar cabeçalhos HTTP (como `X-Frame-Options`, `Strict-Transport-Security` próprio ou `frame-ancestors`). A CSP por `<meta>` cobre a maior parte, mas não essas. Se precisar delas, hospede em um serviço que permita cabeçalhos (por exemplo, a Cloudflare) e repita a CSP como cabeçalho.

## Checklist de quem administra (faça uma vez e revise a cada semestre)

**Conta e repositório (GitHub)**
- [ ] Conta do projeto (não pessoal), com **verificação em duas etapas** ligada.
- [ ] Guarde os códigos de recuperação em local seguro e com mais de uma pessoa de confiança.
- [ ] No máximo 2 ou 3 pessoas com acesso de escrita; os demais por *pull request*.
- [ ] Em **Settings > Pages**, marque **Enforce HTTPS**.
- [ ] Em **Settings > Branches**, proteja a `main` (exigir revisão antes de juntar mudanças).
- [ ] Nunca coloque no repositório: senhas, tokens, planilhas de respostas, listas de contatos ou o link de **edição** dos formulários.
- [ ] Ao sair da equipe, remova o acesso da pessoa no mesmo dia.

**Google (formulários, planilhas, Drive)**
- [ ] Contas de quem administra com verificação em duas etapas.
- [ ] Publique só o link de **responder** (`/viewform`), nunca o de editar.
- [ ] Planilha de respostas: acesso restrito a quem precisa; sem "qualquer pessoa com o link".
- [ ] Contatos opcionais ficam em planilha separada das respostas.
- [ ] Boletins e cartilhas no Drive: "qualquer pessoa com o link" só como **leitor**.
- [ ] Painel (Looker Studio / Power BI): compartilhe apenas dados agregados, sem colunas de contato nem respostas individuais.
- [ ] Faça cópia de segurança das respostas (exportar para planilha) antes do fim de cada etapa.

**Domínio próprio (se houver)**
- [ ] Ative o DNSSEC no Registro.br e a renovação automática.
- [ ] Use apenas o e-mail institucional do projeto como contato do domínio.

**Antes de publicar qualquer material**
- [ ] Resultados só agregados, com o tamanho da amostra à vista.
- [ ] Logos de parceiros só com autorização por escrito.
- [ ] Imagens e textos de terceiros só com licença ou autorização (e crédito).
- [ ] Revisar os marcadores `[...]` em `privacidade.html` e preencher.

## Resposta a incidentes (resumo)

1. Se houver exposição de dados: desligue o compartilhamento do arquivo e troque as senhas das contas envolvidas.
2. Registre o que aconteceu, quando e quais dados foram afetados.
3. Avise o orientador e, conforme a gravidade, o encarregado de dados/ouvidoria da UFRA.
4. Se houver risco relevante aos titulares, comunique-os e a ANPD, conforme o art. 48 da LGPD.
