# Relatório de qualidade — Código Penal 360

Verificação realizada em **25/11/2026**. O pacote Netlify está em **modo de demonstração**. A ativação comercial está condicionada aos itens descritos no README.

## Validação executada

| Verificação | Resultado |
| --- | --- |
| Instalação e validação TypeScript | npm, lockfile e `tsc --noEmit` aprovados |
| Lint | ESLint aprovado |
| Build de produção | Vite aprovado, com HTML inicial pré-renderizado |
| Playwright em Chromium 156 | 14 testes aprovados |
| Responsividade | 320, 375, 390, 430, 768, 1024 e 1440 px, sem rolagem horizontal indevida |
| Recursos visuais e console | Imagens decodificadas e nenhum erro de console nas sete larguras verificadas |
| Navegação e CTAs | Âncoras, ofertas em demonstração, FAQ, download e orientação de acesso aprovados |
| Carrossel e leitor | Toque, teclado, botões, ampliação, versão em texto, Escape e retorno de foco aprovados |
| Acessibilidade automatizada | Zero violações no conjunto axe WCAG 2 A/AA e 2.1 A/AA, na landing page desktop e mobile, no leitor e nos diálogos de oferta |
| Checkout e rastreamento | Dois destinos, atribuição, recusa, aceite, revogação e eventos de navegação aprovados com serviços simulados |
| Material editorial | PDF A4 de oito páginas, texto selecionável, oito marcadores, índice interno, retorno ao índice e links para a fonte |

As capturas mostram desktop de 1440 px e mobile de 390 px, incluindo as páginas completas e os diálogos. A primeira revisão identificou rolagem horizontal na faixa superior em 320 px, corrigida antes da rodada final. A segunda revisão confirmou a composição do hero, o contraste, o destaque do Premium e a separação das áreas editoriais. A imagem de capa recebe variantes responsivas AVIF com fallback WebP.

## Lighthouse mobile

Lighthouse 13.6, Chromium Headless 156, build de produção servido em loopback com compressão gzip. Perfis padrão de dispositivo mobile (412 × 823 CSS px, DPR 1,75), rede simulada de 150 ms RTT e 1.638 kbit/s e fator de CPU 4×. A pontuação pode variar com a máquina e com a hospedagem.

| Métrica | Valor |
| --- | ---: |
| Desempenho | **91 / 100** |
| Acessibilidade | **100 / 100** |
| Boas práticas | **100 / 100** |
| SEO | **66 / 100**, com indexação deliberadamente desabilitada para demonstração |
| LCP | **3,03 s**, acima da meta de 2,5 s |
| CLS | **0,000** |
| FCP | 0,85 s |
| TBT | 204 ms |

INP de campo depende de sessões reais. O relatório Lighthouse em JSON acompanha as capturas.

## Limites e pendências

- A prévia compartilhada do ambiente apresentou falha de relay. O build foi validado pelo Chromium local via Playwright. Não houve deploy no Netlify.
- A cobertura de navegador automatizada foi em Chromium. A validação em Safari/iOS, Firefox e dispositivos físicos permanece pendente.
- Checkout, Pixel e propagação de atribuição foram simulados. Pagamento real, entrega por e-mail, permissões Wiapy e eventos de checkout e compra ainda exigem validação com os produtos e IDs reais.
- As amostras tiveram conferência dos trechos legais no Planalto. A revisão jurídica especializada e a produção dos arquivos integrais continuam pendentes.
- O modo comercial exige os dados do fornecedor, suporte, páginas legais, data da edição e os dois links de checkout. Consulte o README para configuração, publicação e rollback.
