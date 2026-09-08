//
// Copyright 2021 Adobe
// All Rights Reserved.
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.
//
//  WKNDAdventuresTests.swift
//  WKNDAdventuresTests
//

import XCTest
@testable import WKNDAdventures

class WKNDAdventuresTests: XCTestCase {

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testEnglishLanguageMatchesOnlyEnglishLanguageMasterFragments() {
        XCTAssertTrue(ContentLanguage.english.contains(
            destinationPath: "/content/dam/riyadh/language-masters/en/content-fragments/destinations/bangkok"
        ))
        XCTAssertFalse(ContentLanguage.english.contains(
            destinationPath: "/content/dam/riyadh/language-masters/ar/content-fragments/destinations/bangkok"
        ))
        XCTAssertFalse(ContentLanguage.english.contains(
            destinationPath: "/content/dam/riyadh/content-fragments/destinations/bangkok"
        ))
    }

    func testArabicLanguageMatchesLanguageMasterAndLiveCopyFragments() {
        XCTAssertTrue(ContentLanguage.arabic.contains(
            destinationPath: "/content/dam/riyadh/language-masters/ar/content-fragments/destinations/bangkok"
        ))
        XCTAssertTrue(ContentLanguage.arabic.contains(
            destinationPath: "/content/dam/riyadh/ar/content-fragments/destinations/jeddah"
        ))
        XCTAssertFalse(ContentLanguage.arabic.contains(
            destinationPath: "/content/dam/riyadh/language-masters/en/content-fragments/destinations/bangkok"
        ))
    }

    func testLanguagePathMatchingRequiresAPathBoundary() {
        XCTAssertFalse(ContentLanguage.english.contains(
            destinationPath: "/content/dam/riyadh/language-masters/en/content-fragments/destinations-old/bangkok"
        ))
    }

    func testLanguageBuildsDestinationPathUnderItsPrimaryRoot() {
        XCTAssertEqual(
            ContentLanguage.arabic.destinationPath(for: "bangkok"),
            "/content/dam/riyadh/language-masters/ar/content-fragments/destinations/bangkok"
        )
    }

    func testDetailRequestURLIncludesTheSelectedFragmentLanguage() throws {
        let path = "/content/dam/riyadh/language-masters/ar/content-fragments/destinations/bangkok"
        let request = try Aem(scheme: "https", host: "example.com").makeRequest(
            persistedQueryName: "riyadh/destination-by-path",
            params: [("destinationPath", path)]
        )

        let decodedURL = try XCTUnwrap(request.url?.absoluteString.removingPercentEncoding)
        XCTAssertTrue(decodedURL.contains("destinationPath=\(path)"))
    }

}
