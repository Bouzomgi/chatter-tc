FROM node:20-bullseye

RUN echo "Acquire::http::Pipeline-Depth 0;" > /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::http::No-Cache true;" >> /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::BrokenProxy    true;" >> /etc/apt/apt.conf.d/99custom

RUN apt-get clean && \
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y ansible python3

WORKDIR /app/server
COPY . .
RUN npm install

COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

ENV PORT=8001

EXPOSE 8001

HEALTHCHECK --interval=5s --timeout=5s --retries=3 \
  CMD curl --fail http://localhost:8001/deployment/health || exit 1

CMD ["/usr/local/bin/start.sh"]
