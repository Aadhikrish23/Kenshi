FROM heroiclabs/nakama:3.22.0

# Copy config
COPY backend/local.yml /nakama/data/local.yml

# Copy modules
COPY nakama /nakama/data/modules

# FORCE config usage
ENTRYPOINT ["/nakama/nakama"]
CMD ["--config", "/nakama/data/local.yml", "--logger.level", "DEBUG"]