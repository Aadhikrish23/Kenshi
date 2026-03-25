FROM heroiclabs/nakama:3.17.0

# Copy config
COPY nakama.yml /nakama/data/nakama.yml

# Copy your match logic
COPY modules /nakama/data/modules

# Start Nakama (Railway-compatible)
CMD ["/bin/sh", "-c", "\
sleep 5 && \
/nakama/nakama migrate up --database.address \"$DATABASE_URL\" && \
/nakama/nakama \
--name nakama1 \
--database.address \"$DATABASE_URL\" \
--socket.port $PORT \
--socket.address 0.0.0.0 \
--session.encryption_key your_prod_secret \
--runtime.path /nakama/data/modules \
--runtime.js_entrypoint match.js \
--socket.server_key kenshi_key \
--logger.level DEBUG \
--healthcheck true \
"]