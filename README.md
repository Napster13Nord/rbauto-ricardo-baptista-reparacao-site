# rbauto-ricardo-baptista-reparacao

Site gerado pelo motor de demos. **Não editar os ficheiros gerados.**

| Ficheiro | Editar? |
|---|---|
| `site.data.json` | **Sim** — é aqui que se personaliza este negócio |
| `app/`, `components/`, `lib/` | Não — reescritos a cada re-ejeção |

Tirar dois serviços do site é apagar duas entradas de `tema.services` no
`site.data.json`. Trocar uma cor, um título ou uma foto — o mesmo sítio.

```bash
npm install
npm run build      # escreve out/ com HTML já renderizado
```

## Deploy no Coolify

Aplicação nova → **Dockerfile** (está na raiz). Compila o site e serve `out/`
com nginx; não corre Node em produção e não guarda segredo nenhum.

1. Ligar este repositório. Build automático a cada push.
2. Domínio: `https://oficinarbauto.pt`, porta 80.
3. HTTPS: ver a nota da Cloudflare abaixo antes de emitir o certificado.

## Cloudflare

- DNS em **proxy** (nuvem laranja), SSL/TLS em **Full (strict)**.
- Com o proxy ligado o desafio HTTP-01 do Let's Encrypt falha. Ou se usa
  **DNS-01**, ou — mais simples — um **Origin Certificate** da Cloudflare
  instalado no Coolify.
- Os estáticos já vão com `Cache-Control: immutable`; não é preciso mais nada.

## Formulário

Bate em `https://sites-ia.vercel.app/api/contacto`, partilhado por todos os sites.
O destinatário é o `email_profissional` na tabela `clientes` do motor, e o
Reply-To é o email de quem preencheu. Este site não guarda chaves nenhumas.

**O domínio tem de estar em `clientes.dominio`**, senão o pedido é recusado
por origem não autorizada.

Domínio: https://oficinarbauto.pt
