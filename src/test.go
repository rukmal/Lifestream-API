package main

import(
	database "private/database"
)

func main() {
	var keydb database.AuthKeyDB = new(database.Redis)
	keydb.Print()
}