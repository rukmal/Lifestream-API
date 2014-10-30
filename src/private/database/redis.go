package database

import(
	"fmt"
)

type Redis struct {
	hostname string
	port int
	username string
	password string
}

func (r Redis) Connect() bool {
	return true
}

func (r Redis) Print() {
	fmt.Println("Hello world")
}