// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterModula3",
    products: [
        .library(name: "TreeSitterModula3", targets: ["TreeSitterModula3"]),
    ],
    dependencies: [
        .package(url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterModula3",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterModula3Tests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterModula3",
            ],
            path: "bindings/swift/TreeSitterModula3Tests"
        )
    ],
    cLanguageStandard: .c11
)
