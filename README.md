# Código Penal 360

Landing page em português brasileiro, com React, TypeScript, Vite, CSS e Lucide. O build padrão está **pronto para demonstração no Cloudflare Pages**. O catálogo comercial depende da produção e revisão dos materiais, do cadastro do fornecedor e de validação ponta a ponta no Wiapy e na Meta.

## Executar e verificar

Use Node.js 22.12 ou mais recente.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm test
```

`npm run build` gera `dist/`. Para inspecioná-lo localmente, use `npm run preview`. Os testes Playwright carregam o build estático e interceptam os serviços externos com domínios reservados. `CP360_CHROMIUM` pode apontar para um Chromium instalado. `CP360_SCREENSHOTS` recebe um diretório para as quatro capturas.

## Estrutura

| Caminho | Função |
| --- | --- |
| `src/sections` | Seções editoriais, carrossel, ofertas, FAQ e rodapé |
| `src/components` | Identidade e diálogo acessível |
| `src/config` | Catálogo, preços, endereços e condição de ativação comercial |
| `src/content/samples.json` | Texto das sete amostras usado no site e no PDF |
| `src/utils` | URLs de checkout e carregamento do Meta Pixel |
| `src/styles/site.css` | Design responsivo, cores, fontes e componentes |
| `public/assets` | Mockups, capas, imagens das páginas e identidade |
| `public/previews` | PDF gratuito, com índice navegável e texto selecionável |
| `editorial` | Capas originais em PNG e gerador de PDF e WebP |
| `tests` | Responsividade, imagens, navegação, acessibilidade e integrações simuladas |

## Identidade e material

A paleta usa marfim, azul-marinho `#101D32`, vermelho `#C8102E`, bordô `#850D16` e dourado `#FFC928`. Sora e Inter são servidas localmente. Os WebP oficiais estão em `public/assets/oficiais/`. As dez amostras são imagens do ZIP. O PDF complementar, mantido na rota anterior, é uma edição separada com sete artigos e requer revisão especializada.

Para regenerar o PDF anterior, instale `editorial/requirements.txt` em um ambiente virtual e execute `python editorial/generate.py` na raiz. O gerador usa DejaVu Sans e DejaVu Serif.

## Cloudflare Pages

1. Em **Workers & Pages**, crie um projeto **Pages** com **Import an existing Git repository** e selecione este repositório. Escolha como branch de produção a que contém a configuração do Cloudflare.
2. Use o preset **Vite**, a raiz do repositório, o comando de build `npm run build` e o diretório de saída `dist`. Defina `NODE_VERSION=22` e `VITE_COMMERCIAL_APPROVED=false` nos ambientes de produção e preview.
3. Use `.env.example` como referência para as demais variáveis. Os valores `VITE_*` entram no código público. O build gera `dist/_headers` com os cabeçalhos de segurança, o cache de assets e, em demonstração, `X-Robots-Tag: noindex, nofollow`.
4. Confira no endereço HTTPS `pages.dev` a página inicial, o download das amostras, os cabeçalhos e o modo de oferta. Em produção comercial, confira também o endereço canônico e `/sitemap.xml`.
5. Para rollback, selecione um deploy de produção anterior na lista de deploys do Pages e use **Rollback to this deployment**.

## Checkout, preços e conteúdo

- Edite os preços de Básico, Premium e oferta alternativa em `src/config/catalog.ts`. O Básico recupera o valor anterior de R$ 10,00. Use `null` se o preço de um pacote estiver pendente.
- Preencha os links individuais `VITE_CHECKOUT_BASIC_URL`, `VITE_CHECKOUT_PREMIUM_URL` e `VITE_CHECKOUT_DOWNSELL_URL` conforme `.env.example`. Confirme no Wiapy qual produto, valor e permissão de acesso cada link concede.
- Liste em `VITE_CONFIRMED_BONUSES` apenas IDs com entrega e quantidades conferidas. Verifique os itens impressos nas capas, incluindo 100 mapas, 300 questões, 200 flashcards, 60 pegadinhas e três simulados de 120 questões no total. O hero e o card Premium exibem a imagem do guia até os sete bônus serem confirmados.
- A oferta alternativa de R$ 17,00 exige confirmação própria, link distinto e o kit completo. Abra pelo botão nas ofertas. O modal é exibido uma vez por sessão.
- Cadastre depoimentos reais em `src/config/catalog.ts` com a identificação autorizada e `authorized: true` somente quando houver autorização de publicação.
- Confirme pagamento único, entrega digital após confirmação do pagamento e garantia de sete dias antes de ativar suas respectivas chaves. As quatro artes para o checkout e suas dimensões estão em [assets-checkout](assets-checkout/README.md).

## Meta Pixel

1. Configure `VITE_META_PIXEL_ID` com o identificador público. Na landing page, o script é solicitado após consentimento. Em uma navegação, o site envia `PageView` e `ViewContent` uma vez. O rodapé permite mudar a preferência.
2. Use Meta Pixel Helper e **Eventos de Teste** para revisar recusa, aceite e revogação em uma sessão limpa. Confira o ID e a ausência de duplicação após navegar entre seções, abrir amostras e trocar preferências.
3. Configure `InitiateCheckout` no início efetivo do checkout, na plataforma responsável. Vincule `Purchase` à confirmação do pagamento com valor, moeda BRL e identificador da transação. Se Pixel e CAPI emitirem o mesmo evento, valide o mesmo `event_name` e `event_id` nos dois canais.
4. Valide os eventos em transação autorizada e verifique o consentimento em ambos os domínios. Clique em CTA e carregamento de página de orientação não representam pagamento.

## Pendências comerciais

- Concluir e revisar juridicamente o guia e os bônus, incluindo as quantidades dos materiais anunciados.
- Verificar URLs, valores, permissões, prazos, garantia, dimensão da arte e entrega no Wiapy.
- Preencher os dados do fornecedor, URLs legais, domínio e data da edição. Use a configuração `VITE_COMMERCIAL_APPROVED=false` até a aprovação comercial.
- Publicar a revisão em uma branch de preview do Cloudflare Pages, distinta da branch de produção `cloudflare-pages`.

## Referências comerciais consultadas

| Referência | Observação aplicada |
| --- | --- |
| [Direito Penal Ilustrado](https://direitopenalilustrado.netlify.app/) e PDF anexado da página | Hierarquia entre promessa, demonstração, ofertas, garantia e FAQ. |
| Captura do modal e PDF anexado do checkout | Comparação clara entre os dois preços e ações. A página usa diálogo de demonstração acionado pelo usuário. |
| [EBD365](https://ebd365.com.br/codigo-penal/) | Resposta HTTP 406 no acesso direto. O índice de busca apresentou a proposta de linguagem simples. |
| [Marcelo Mapas](https://marcelomapas.com/penal/) | Demonstração por dentro e comparação entre formatos. |
| [Aprova Visual](https://aprovavisual.com.br/produtos/mapas-direito-penal) | Exposição de páginas e amostras. |
| [Direito Desenhado](https://direitodesenhado.app/) | Organização dos recursos por atividade de estudo. |
| Biblioteca Meta, buscas por “361 artigos” e “Marcelo Mapas” | Resposta HTTP 403. A captura e os PDFs anexados serviram de referência alternativa. |

Consulte `RELATORIO-QA.md` para os resultados executados e os limites da validação.

## Coleção Destrave o Código Penal

A edição para revisão reúne nove unidades em três módulos, seis materiais de revisão em PDF e um simulado interativo no navegador. Os textos e o catálogo estão em `editorial/destrave/`, e os PDFs e o ZIP da prévia ficam em `editorial/destrave/exportados/`.

Para regenerar os arquivos, instale ReportLab e as fontes DejaVu Sans e execute `python editorial/destrave/gerar-colecao.py`. Use `CP360_FONT_DIR` para apontar para outro diretório de fontes. As capas, a edição e a fonte legal aparecem nos PDFs. O guia cobre os dispositivos selecionados nas unidades.

Use `VITE_COMMERCIAL_APPROVED=false VITE_EDITORIAL_REVIEW=true npm run build` para gerar a prévia editorial em `dist/`. Ela disponibiliza `#colecao`, os downloads em `/colecao/` e o simulado em `/simulado.html`. O build padrão não publica a coleção completa nem o simulado. O progresso do simulado fica no armazenamento local do navegador, sem servidor ou banco de dados.
