package tests

import (
	db "Lifestream-API/private/database"
)

func main() {
	var authKeyDB db.AuthKeyDB = new(db.MongoDB)
}