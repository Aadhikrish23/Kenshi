FROM heroiclabs/nakama:3.17.0

# Copy config
COPY nakama.yml /nakama/data/nakama.yml

# Copy your match logic
COPY modules /nakama/data/modules

# Start Nakama
CMD ["/nakama/nakama", "--config", "/nakama/data/nakama.yml"]