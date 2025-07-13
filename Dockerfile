FROM node:18-alpine

WORKDIR /usr/src/app

# Instalar dependências necessárias
RUN apk add --no-cache openssl openssl-dev

# Instalar dependências primeiro
COPY package*.json ./
RUN npm install

# Copiar arquivos do Prisma e gerar cliente
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar resto do código
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"] 