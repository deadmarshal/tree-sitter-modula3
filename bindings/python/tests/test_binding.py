from unittest import TestCase

import tree_sitter
import tree_sitter_modula3


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            tree_sitter.Language(tree_sitter_modula3.language())
        except Exception:
            self.fail("Error loading Modula-3 grammar")
