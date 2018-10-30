FROM node:10
MAINTAINER Dariusz Niemczyk <palid@o2.pl>
LABEL description="nBot"


WORKDIR /nbot
ADD . /nbot

EXPOSE 6667


RUN apt-get install bash
RUN npm install

CMD ["sleep 5s", "node", "bot.js"]
