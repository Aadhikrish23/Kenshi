FROM heroiclabs/nakama:3.17.0

# Copy config
COPY nakama.yml /nakama/data/nakama.yml

# Copy your match logic
COPY modules /nakama/data/modules

# Start Nakama (Railway-compatible)
FROM heroiclabs/nakama:3.17.0

COPY nakama.yml /nakama/data/nakama.yml
COPY modules /nakama/data/modules

CMD ["/bin/sh", "-c", "\
    sleep 5 && \
    /nakama/nakama migrate up --database.address \"$DATABASE_URL\" && \
    /nakama/nakama \
    --config /nakama/data/nakama.yml \
    --socket.port $PORT \
    --socket.address 0.0.0.0 \
    --logger.level DEBUG \
    "]