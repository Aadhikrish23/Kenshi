FROM heroiclabs/nakama:3.17.0

# Copy config
COPY nakama.yml /nakama/data/nakama.yml

# Copy your match logic
COPY modules /nakama/data/modules

# Start Nakama (Railway-compatible)
CMD ["/bin/sh", "-c", "\
apk add --no-cache busybox-extras && \
echo 'Starting health server...' && \
(while true; do echo -e 'HTTP/1.1 200 OK\n\nOK' | nc -l -p $PORT; done) & \
sleep 5 && \
echo 'Starting Nakama...' && \
/nakama/nakama migrate up --database.address \"$DATABASE_URL\" && \
/nakama/nakama --config /nakama/data/nakama.yml \
"]