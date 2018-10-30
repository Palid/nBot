FROM node:10
MAINTAINER Dariusz Niemczyk <palid@o2.pl>
LABEL description="nBot"


WORKDIR /nbot
ADD . /nbot

EXPOSE 6667

RUN npm install

CMD ["sleep 20s", "node", "bot.js"]
