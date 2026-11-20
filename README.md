# OBVA-Capanema | Página do projeto

Página estática (HTML, CSS e JavaScript simples, sem instalação) do Observatório do Comércio Varejista de Capanema, projeto de pesquisa e extensão da UFRA, campus Capanema.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | Página principal |
| `privacidade.html` | Política de privacidade (LGPD), termos de uso e direitos autorais |
| `config.js` | **Único arquivo que você edita**: links dos formulários, boletim, painel, e-mail |
| `style.css`, `app.js` | Visual e comportamento (não precisa mexer) |
| `painel.html`, `painel.js` | Painel de dados: visão Geral (soma dos segmentos) e um painel por segmento, cada um com consumidores e lojistas |
| `dados.js` | **Os números do painel.** É o único arquivo que muda quando chegam novas respostas (contagens por segmento; a visão Geral soma sozinha). O topo do arquivo explica o formato |
| `theme.js` | Botão de tema claro/escuro (lembra a escolha do visitante) |
| `particles.js` | Efeito de partículas no fundo (para desligar, apague a linha `<script src="particles.js">` no `index.html`) |
| `fonts/` | Fontes Inter e Space Grotesk hospedadas aqui, com suas licenças |
| `LICENSE` | Licença do código (MIT) |
| `SECURITY.md` | Política de segurança e checklist de quem administra |

## 1. Preencha os links

Abra o `config.js` e preencha os campos. Há um par de formulários (lojista e consumidor) para cada um dos 4 segmentos; quando uma equipe tiver os links, cole nos campos `form1…`, `form2…` e `form3…` (o segmento 4 já está preenchido). O selo do segmento muda sozinho de "Em breve" para "Respostas abertas". Campo vazio = o botão aparece como "Em breve". Os links precisam começar com `https://`. Use o link de **responder** dos formulários (termina em `/viewform`).

## 2. Preencha os marcadores em `privacidade.html`

Procure por `[` no arquivo e substitua:
- `[E-MAIL DE CONTATO DO PROJETO]` (aparece 1 vez na seção 1; repita o e-mail também em `SECURITY.md`);
- `[PRAZO, ex.: 5 anos após o encerramento]` (seção 5).

Sem isso, a página publica texto com marcadores.

## 3. Publicar no GitHub Pages (gratuito)

1. Crie uma conta do projeto em github.com, **com verificação em duas etapas**.
2. Crie um repositório público (por exemplo, `obva-capanema`) e envie **todos os arquivos desta pasta**, incluindo `fonts/`.
3. Em **Settings > Pages**, escolha a branch `main` e a pasta raiz, e salve.
4. Marque **Enforce HTTPS** na mesma tela.
5. O endereço fica no ar em poucos minutos: `https://SEU-USUARIO.github.io/obva-capanema/`.

Para atualizar, edite o arquivo pelo próprio GitHub (lápis) e salve.

## Direitos autorais: o que está resolvido e o que depende de vocês

**Já resolvido na página**
- Aviso de copyright e licença no rodapé: © 2026 OBVA-Capanema, todos os direitos reservados, com pedido de citação da fonte.
- Seção "Direitos autorais e uso do conteúdo" em `privacidade.html`: como citar, o que é permitido, marcas de UFRA e de parceiros, dados públicos.
- Fontes (Inter e Space Grotesk, licença SIL OFL 1.1) hospedadas no próprio site, com as licenças em `fonts/`. A OFL permite uso gratuito e exige manter a licença junto.
- Código sob licença MIT, em `LICENSE`.
- Nenhuma imagem, logo ou texto de terceiros na página. A logo do projeto é da equipe.

**Depende de vocês (confirme antes de publicar)**
- [ ] **Titularidade e licença:** converse com o orientador e com a UFRA sobre a norma de propriedade intelectual e de projetos de extensão. Sem licença aberta, o conteúdo fica com todos os direitos reservados; se a universidade preferir licenciar, atualize o rodapé e a seção 10 de `privacidade.html`.
- [ ] **Nome e marca da UFRA:** a página cita a UFRA só em texto. Não use o brasão nem a logo sem autorização da universidade (comunicação institucional).
- [ ] **Logos de parceiros** (Sebrae, CDL, Secretaria, etc.): só com autorização por escrito de cada um.
- [ ] **Imagens, fotos e textos de terceiros** em boletins e cartilhas: só com licença ou autorização, sempre com crédito.
- [ ] **Dados públicos** (CAGED, IBGE, Receita): cite a fonte e a data de consulta em cada material.
- [ ] **Fotos de pessoas** (workshop, coleta): só com termo de uso de imagem assinado.

## Segurança: o que está resolvido e o que depende de vocês

**Já resolvido na página**
- Política de Segurança de Conteúdo (CSP): só roda código, fontes e estilos do próprio site; bloqueia scripts e conexões de terceiros; aceita painéis incorporados apenas do Looker Studio e do Power BI.
- Sem cookies, sem anúncios, sem rastreadores e sem recursos externos (as fontes ficam no site, então o endereço IP dos visitantes não vai ao Google Fonts).
- Links externos com `noopener noreferrer`; `config.js` aceita só `https://`; painel incorporado com `sandbox` e sem envio de referrer.
- Política de privacidade com base na LGPD (controlador, dados, finalidade, base legal, compartilhamento, retenção, direitos do titular, incidentes, menores).
- Testado em computador e celular, nos temas claro e escuro, sem nenhuma violação da CSP.

**Limites do GitHub Pages:** não permite configurar cabeçalhos HTTP (por exemplo, `X-Frame-Options` ou `frame-ancestors`). A CSP por `<meta>` cobre quase tudo, menos isso. Veja `SECURITY.md`.

**Depende de vocês** (lista completa em `SECURITY.md`)
- [ ] Verificação em duas etapas nas contas do GitHub e do Google.
- [ ] Publicar só o link de **responder** dos formulários, nunca o de editar.
- [ ] Planilha de respostas com acesso restrito; contatos opcionais em planilha separada.
- [ ] Painéis só com dados agregados.
- [ ] Nunca subir ao GitHub planilhas de respostas, contatos, senhas ou links de edição.

## Ajustes nos formulários (recomendado)

Os formulários têm um campo opcional de contato (WhatsApp ou e-mail), mas o aviso diz que a pesquisa é totalmente anônima. Inclua no texto do formulário uma frase como:

> "Se você informar um contato para receber os boletins, ele será usado apenas para isso, ficará separado das suas respostas e poderá ser excluído a seu pedido."

Isso alinha o formulário à política de privacidade e ao consentimento (LGPD, art. 7º, I).

## Aviso

Os textos jurídicos (privacidade, termos e licenças) são um modelo de boa-fé, não substituem a revisão de um profissional. Peça ao orientador que os encaminhe ao setor jurídico ou ao encarregado de dados (DPO) da UFRA antes da publicação.
