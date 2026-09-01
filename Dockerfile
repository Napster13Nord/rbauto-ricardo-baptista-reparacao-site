# Compila o site e serve o HTML estático. Sem Node em produção.
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# O Coolify reinicia o contentor sozinho quando isto falha. Pede a página de
# entrada, que é o que o visitante pede — um nginx de pé a servir 404 em tudo
# passaria num teste de porta aberta e reprova aqui.
#
# Isto não substitui o UptimeRobot: se a VPS cair, o Docker cai com ela e não
# há quem reinicie nada. Um trata do contentor, o outro trata do resto.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
