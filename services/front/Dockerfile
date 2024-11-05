FROM node:lts-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

ARG BACKEND_URL
ENV VUE_APP_BACKEND_URL=$BACKEND_URL

# RUN npm install @vue/cli@5.0.8 -g

COPY package.json .
# COPY package-lock.json .
RUN npm install
COPY . .

RUN npm run build

# COPY public public
# COPY src src

# CMD ["npm", "run", "serve", "--", "--port", "5000"]


FROM nginx:1.16.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]