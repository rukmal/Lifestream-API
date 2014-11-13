package auth

import (
	"fmt"
	uuid "code.google.com/p/go-uuid/uuid"
)

type ApiToken struct {
	owner string
	requests int
	token string
	level string
}

/**
 * Function to add a new token
 * It is automatically inserted into the database
 */
func (ap ApiToken) NewToken(owner string, level string) {
	ap.owner = owner
	app.level = level
	app.token = uuid.New()
	app.requests = 0
	// insert it into database here
}

/**
 * Function to check if the token is valid
 * This function also checks usage limits of the token (if any)
 */
func (ap ApiToken) CheckToken(token string) bool {
	// check if it exists in database here
	// check usage limits here
	// if exists {
	// 		return true
	// } else {
	// 		return false
	// }
	return true
}

/**
 * Function to delete a token from the databse
 * Returns true if successful, false if not
 */
func (ap ApiToken) DeleteToken(token string) bool {
	// find token in db, delete it
	// if successful {
	// 		return true
	// } else {
	// 		return false
	// }
	return true
}