FROM node:alpine
MAINTAINER Dariusz Niemczyk <palid@o2.pl>
LABEL description="nBot"


WORKDIR /nbot
ADD . /nbot

EXPOSE 6667

RUN npm install

CMD ["node", "bot.js"]
