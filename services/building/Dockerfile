FROM node:lts-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

ARG BACKEND_URL
# expose the variable to the finished cotainer
ENV VITE_BACKEND_URL=$BACKEND_URL

# RUN npm install @vue/cli@5.0.8 -g
# RUN npm init vite@latest

COPY package.json .
# COPY package-lock.json .
RUN npm install
COPY . .

RUN vite build

# COPY public public
# COPY src src

# CMD ["npm", "run", "serve", "--", "--port", "5000"]


FROM nginx:1.16.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]