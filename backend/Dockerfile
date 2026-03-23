FROM heroiclabs/nakama:3.22.0

COPY backend/local.yml /nakama/data/local.yml
COPY nakama/modules /nakama/data/modules

ENTRYPOINT ["/nakama/nakama"]

CMD ["--config", "/nakama/data/local.yml", "--logger.level", "DEBUG"]