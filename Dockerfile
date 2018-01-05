# What image do you want to start building on?
FROM node:8.9.4-alphine

# Make a folder in your image where your app's source code can live
RUN mkdir -p /src/app

# Tell your container where your app's source code will live
WORKDIR /src/app

# What source code do you what to copy, and where to put it?
RUN npm install

# What port will the container talk to the outside world with once created?
EXPOSE 3000

ENV NODE_ENV production

ENTRYPOINT node start
