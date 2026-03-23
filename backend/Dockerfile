FROM heroiclabs/nakama:3.22.0

# Copy config
COPY backend/local.yml /nakama/data/

# Copy game logic (CRITICAL)
COPY nakama /nakama/data/modules

CMD ["/nakama/nakama", "--config", "/nakama/data/local.yml", "--logger.level", "DEBUG"]