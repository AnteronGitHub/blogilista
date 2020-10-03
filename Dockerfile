FROM node

# Install packages
RUN apt update -y

# Application setup
WORKDIR /app
COPY . .
RUN yarn install

# User management
ARG UID=1001
ARG GID=1001

RUN groupadd developer -g $GID
RUN useradd developer -g $GID -u $UID -m -s /bin/bash

USER developer

# Environment setup
ENV LANG C.UTF-8

EXPOSE 3003
CMD ["yarn", "dev"]
