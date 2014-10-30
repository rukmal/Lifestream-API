package database

import(
	redis "github.com/fzzy/radix/redis"
)

type Redis struct {
	hostname string
	port int
	username string
	password string
}

func (r Redis) Connect() bool {
	c := redis.Client.Dial("localhost", "6379")
	c.
	return true
}
