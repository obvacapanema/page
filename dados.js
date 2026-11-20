/* ============================================================
   DADOS DO PAINEL | OBVA-Capanema
   É o único arquivo que muda quando chegam novas respostas.
   Tudo aqui são CONTAGENS (número de pessoas ou de lojas), não porcentagens:
   o painel calcula as porcentagens e a visão GERAL soma os segmentos sozinho.

   Para cada segmento (1 a 4) e cada público (consumidor / lojista):
     n        número de respondentes
     perfil   frase curta sobre o perfil (opcional)
     k        indicadores dos cartões: { nome: [quantos, base] }
     g        gráficos (veja os nomes abaixo)
     notas    frases "o que isso quer dizer" (opcional; se faltar, o painel escreve a partir dos dados)

   Gráficos do consumidor:  pagto, canais, gasto  -> [['Rótulo', contagem], ...]
                            aval -> [['Dimensão', [muito insatisf., insatisf., neutro, satisf., muito satisf.]], ...]
   Gráficos do lojista:     dores, vcanais, vpagto -> [['Rótulo', contagem], ...]
                            meses -> [['Mês', citado como forte, citado como fraco], ...]
   Indicadores (k) do consumidor: fisicas, preco, credito, reforma, subiram
   Indicadores (k) do lojista:    custo, chuva, junho, melhores
   Se uma pergunta não existiu no questionário do segmento, simplesmente omita.
   ============================================================ */
var DADOS = {
  atualizado: '19/11/2026',
  segmentos: [
    { id: 1, nome: 'Supermercados, feiras e alimentos', curto: 'Alimentos' },
    { id: 2, nome: 'Vestuário, calçados e confecções', curto: 'Vestuário' },
    { id: 3, nome: 'Farmácias, saúde e cosméticos', curto: 'Farmácias' },
    { id: 4, nome: 'Material de construção, armarinho e utensílios', curto: 'Construção' }
  ],
  dados: {
    4: {
      consumidor: {
        n: 23,
        perfil: '91% têm de 18 a 24 anos',
        k: { fisicas: [19, 23], preco: [20, 23], credito: [13, 23], reforma: [12, 23], subiram: [15, 23] },
        g: {
          pagto: [['Pix', 14], ['Cartão de crédito', 12], ['Dinheiro', 11], ['Cartão de débito', 3], ['Crediário/caderneta', 3]],
          canais: [['Instagram / Facebook', 16], ['WhatsApp', 11], ['Boca a boca', 10], ['Ponto físico', 8], ['Sites', 3], ['Rádio local', 2], ['Panfletos/faixas', 2], ['TikTok', 1]],
          gasto: [['Não comprou', 13], ['R$ 101 a R$ 500', 7], ['R$ 501 a R$ 1.000', 2], ['Acima de R$ 2.000', 1]],
          aval: [['Atendimento', [3, 1, 10, 8, 1]], ['Condições de pagamento', [3, 0, 14, 5, 1]], ['Variedade de produtos', [3, 4, 11, 5, 0]], ['Prazo e custo de entrega', [4, 4, 8, 6, 1]], ['Preços', [2, 2, 17, 2, 0]]]
        },
        notas: [
          'Compare o preço total com e sem parcelamento: 57% já adiaram compras por falta de crédito.',
          'O Pix é a forma mais usada (61%); pergunte se há desconto à vista.',
          'Instagram e WhatsApp concentram as ofertas: vale seguir as lojas que você já conhece.',
          'Em reformas pequenas, pesquise em mais de uma loja antes de fechar.'
        ]
      },
      lojista: {
        n: 6,
        perfil: 'construção e acabamento, armarinho e utilidades',
        k: { custo: [5, 6], chuva: [5, 6], junho: [4, 6], melhores: [5, 6] },
        g: {
          dores: [['Custo das mercadorias', 5], ['Concorrência (Belém, grandes redes, internet)', 4], ['Impostos e burocracia', 3], ['Inadimplência', 1]],
          vcanais: [['Redes sociais', 5], ['WhatsApp / WhatsApp Business', 4], ['Indicação / boca a boca', 3], ['Venda presencial / prospecção', 3], ['Loja virtual própria', 3], ['Marketplaces', 2], ['Tráfego pago', 1]],
          vpagto: [['Cartão de débito', 6], ['Pix', 5], ['Dinheiro', 5], ['Crédito à vista', 5], ['Crédito parcelado', 5], ['Crediário próprio', 1], ['Boleto', 1]],
          meses: [['Janeiro', 3, 0], ['Março', 0, 3], ['Junho', 4, 0], ['Agosto', 2, 3], ['Setembro', 2, 0], ['Dezembro', 2, 4]]
        },
        notas: [
          'Junho é forte para 4 de 6 lojas: planeje estoque e crédito antes.',
          'Dezembro e março aparecem como meses fracos: vale pensar em promoções e em compras de menor valor.',
          'Para 57% dos consumidores, o parcelamento é o que decide: deixe as condições visíveis nas redes e no balcão.',
          'Os consumidores descobrem ofertas no Instagram e no WhatsApp, os mesmos canais que 5 e 4 das 6 lojas já usam.',
          'Na época das chuvas as vendas caem para 5 de 6 lojas: ofereça itens de reparo e cobertura antes da estação.'
        ]
      }
    }
    /* 1: { consumidor: {...}, lojista: {...} },   <- exemplo: adicione aqui os outros segmentos */
  }
};
