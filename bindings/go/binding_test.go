package tree_sitter_modula3_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_modula3 "github.com/deadmarshal/tree-sitter-modula3/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_modula3.Language())
	if language == nil {
		t.Errorf("Error loading Modula-3 grammar")
	}
}
