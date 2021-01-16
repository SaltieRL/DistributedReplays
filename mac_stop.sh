redis-cli shutdown &
pg_ctl -D /usr/local/var/postgres stop &
pkill flower
