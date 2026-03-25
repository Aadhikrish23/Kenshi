FROM heroiclabs/nakama:3.17.0

COPY nakama.yml /nakama/data/nakama.yml
COPY modules /nakama/data/modules

FROM heroiclabs/nakama:3.17.0

COPY nakama.yml /nakama/data/nakama.yml
COPY modules /nakama/data/modules

CMD ["/bin/sh", "-c", "\
apk add --no-cache busybox-extras && \
echo 'Starting fake HTTP server on $PORT...' && \
(while true; do echo -e 'HTTP/1.1 200 OK\n\nOK' | nc -l -p $PORT; done) & \
sleep 5 && \
echo 'Starting Nakama...' && \
/nakama/nakama migrate up --database.address \"$DATABASE_URL\" && \
/nakama/nakama --config /nakama/data/nakama.yml \
"]