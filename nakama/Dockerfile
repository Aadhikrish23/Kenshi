FROM heroiclabs/nakama:3.22.0

COPY nakama.yml /nakama/data/nakama.yml
COPY modules /nakama/data/modules

CMD ["/nakama/nakama", "--config", "/nakama/data/nakama.yml", "--database.address", "$DATABASE_URL"]