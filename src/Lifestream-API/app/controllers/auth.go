package controllers

import(
	"fmt"
	"github.com/revel/revel"
)

type Auth struct {
	*revel.Controller
}

func (c Auth) NewToken(test string) revel.Result {
	fmt.Println(test)
	return c.RenderText("It works!")
}