FROM heroiclabs/nakama:3.22.0

COPY backend/local.yml /nakama/data/local.yml
COPY nakama /nakama/data/modules

ENTRYPOINT ["/nakama/nakama"]

CMD ["migrate", "up", "--config", "/nakama/data/local.yml"]