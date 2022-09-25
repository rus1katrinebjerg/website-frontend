package main

import (
	"fmt"
	"net/http"
	"os"
)

// Starts a simple HTTP server that serves HTML files generated by Astro
func main() {
	if err := http.ListenAndServe(":3000", http.FileServer(http.Dir("./dist"))); err != nil {
		fmt.Printf("fatal err: %v", err)
		os.Exit(1)
	}
}
