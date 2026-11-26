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

Azul-marinho `#111827`, vermelho `#D3102E`, dourado `#FFD14B` e verde `#20DF68`. Sora e Inter são servidas pelo próprio site. As capas combinam tipografia serifada, linhas de contorno e símbolos desenhados, com matrizes em PNG e mockups em WebP. O ícone da marca e a imagem de compartilhamento também são autorais.

O PDF tem índice clicável e sete páginas de artigos, com fonte legal, exemplos fictícios, alertas e exercícios. A edição indica a data da consulta jurídica. Os trechos foram conferidos em 25/11/2026 no Decreto-Lei nº 2.848/1940, versão compilada do Planalto. A cópia está identificada como demonstrativa e requer revisão especializada antes de uso comercial. [Código Penal compilado](https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm)

Para regenerar os arquivos, instale `editorial/requirements.txt` em um ambiente virtual. Execute `python editorial/generate.py` na raiz. O gerador usa DejaVu Sans e DejaVu Serif. Em outros sistemas, a variável `CP360_FONT_DIR` aponta para os três arquivos TTF correspondentes.

## Cloudflare Pages

1. Em **Workers & Pages**, crie um projeto **Pages** com **Import an existing Git repository** e selecione este repositório. Escolha como branch de produção a que contém a configuração do Cloudflare.
2. Use o preset **Vite**, a raiz do repositório, o comando de build `npm run build` e o diretório de saída `dist`. Defina `NODE_VERSION=22` e `VITE_COMMERCIAL_APPROVED=false` nos ambientes de produção e preview.
3. Use `.env.example` como referência para as demais variáveis. Os valores `VITE_*` entram no código público. O build gera `dist/_headers` com os cabeçalhos de segurança, o cache de assets e, em demonstração, `X-Robots-Tag: noindex, nofollow`.
4. Confira no endereço HTTPS `pages.dev` a página inicial, o download das amostras, os cabeçalhos e o modo de oferta. Em produção comercial, confira também o endereço canônico e `/sitemap.xml`.
5. Para rollback, selecione um deploy de produção anterior na lista de deploys do Pages e use **Rollback to this deployment**.

## Checkout e entrega Wiapy

- Crie dois produtos ou checkouts com pagamento único, **Básico R$ 10,00** e **Premium R$ 27,00**. Vincule os endereços verificados em `VITE_CHECKOUT_BASIC_URL` e `VITE_CHECKOUT_PREMIUM_URL`. [Como criar e copiar o link de checkout](https://help.wiapy.com/pt-br/article/como-criar-um-checkout-e-pegar-o-link-de-venda-1omdaab/)
- Na Área de Membros, cadastre o livro do Básico e o livro com os sete materiais do Premium. Em cada checkout, habilite a entrega e associe apenas as permissões correspondentes. O acesso após aprovação fica a cargo do Wiapy. O Cloudflare Pages hospeda somente o PDF gratuito de amostras. [Liberação de acesso pelo checkout](https://help.wiapy.com/pt-br/article/liberar-acesso-da-compra-pela-area-de-membros-jb3yxe/)
- Com autorização do responsável, valide os dois fluxos em ambiente de teste, se disponível. Confira o valor mostrado no checkout, aprovação, e-mail, login, navegação por celular e acesso a cada arquivo. Confira também que um comprador Básico não acessa os bônus. Vincule `VITE_ACCESS_URL` a uma página de orientação oficial.
- Os UTMs e identificadores de campanha são encaminhados apenas quando a integração aceitar a atribuição, `VITE_FORWARD_ATTRIBUTION=true` e a pessoa autorizar a medição. O checkout mantém os parâmetros com que foi configurado. Dados como e-mail e telefone ficam fora da lista de encaminhamento.

## Meta Pixel

1. Configure `VITE_META_PIXEL_ID` com o identificador público. Na landing page, o script é solicitado após consentimento. Em uma navegação, o site envia `PageView` e `ViewContent` uma vez. O rodapé permite mudar a preferência.
2. Use Meta Pixel Helper e **Eventos de Teste** para revisar recusa, aceite e revogação em uma sessão limpa. Confira o ID e a ausência de duplicação após navegar entre seções, abrir amostras e trocar preferências.
3. Configure `InitiateCheckout` no início efetivo do checkout, na plataforma responsável. Vincule `Purchase` à confirmação do pagamento com valor, moeda BRL e identificador da transação. Se Pixel e CAPI emitirem o mesmo evento, valide o mesmo `event_name` e `event_id` nos dois canais.
4. Valide os eventos em transação autorizada e verifique o consentimento em ambos os domínios. Clique em CTA e carregamento de página de orientação não representam pagamento.

## Pendências comerciais

- Produzir o livro completo e os sete materiais Premium. Obter revisão jurídica especializada, documentar o conteúdo e publicar somente os volumes efetivamente revisados. As quantidades do briefing são metas de produção e estão fora das ofertas atuais.
- Confirmar as duas URLs do Wiapy, permissões e entrega após aprovação, incluindo a página de orientação oficial.
- Preencher razão social ou nome do fornecedor, identificação, endereço e suporte oficial. Disponibilizar os documentos finais de privacidade, termos e reembolso.
- Definir domínio HTTPS e data da edição comercial (`VITE_EDITION_UPDATED` em AAAA-MM-DD), verificar a integração do Pixel no ambiente real quando utilizada e confirmar os critérios de impressão, acesso e atualização editorial descritos na página.
- Só então definir `VITE_COMMERCIAL_APPROVED=true` e reconstruir. Mesmo com a chave ativa, o build mantém a demonstração se o domínio, os checkouts distintos, dados do fornecedor ou URLs legais estiverem incompletos ou a data válida da edição estiver ausente.

As avaliações têm um componente preparado em `src/sections/Commerce.tsx`. Cadastre somente avaliações verificadas com autorização para publicação.

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
