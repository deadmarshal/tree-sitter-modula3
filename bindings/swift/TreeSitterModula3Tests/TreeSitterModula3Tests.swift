import XCTest
import SwiftTreeSitter
import TreeSitterModula3

final class TreeSitterModula3Tests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_modula3())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Modula-3 grammar")
    }
}
