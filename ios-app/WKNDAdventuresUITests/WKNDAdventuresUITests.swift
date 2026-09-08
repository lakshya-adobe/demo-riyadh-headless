//
// Copyright 2021 Adobe
// All Rights Reserved.
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.
//
//  WKNDAdventuresUITests.swift
//  WKNDAdventuresUITests
//

import XCTest

class WKNDAdventuresUITests: XCTestCase {

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.

        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testLanguageSelectorFiltersDestinations() throws {
        let app = XCUIApplication()
        app.launch()

        XCTAssertTrue(app.staticTexts["Explore Destinations"].waitForExistence(timeout: 15))
        XCTAssertTrue(app.staticTexts["Bangkok"].exists)
        XCTAssertFalse(app.staticTexts["بانكوك"].exists)

        let languageSelector = app.buttons["Language"]
        XCTAssertTrue(languageSelector.waitForExistence(timeout: 2))
        XCTAssertTrue(languageSelector.isHittable)
        languageSelector.tap()

        let arabicOption = app.buttons["العربية"]
        XCTAssertTrue(arabicOption.waitForExistence(timeout: 2))
        arabicOption.tap()

        XCTAssertTrue(app.staticTexts["استكشف الوجهات"].waitForExistence(timeout: 2))
        XCTAssertTrue(app.staticTexts["بانكوك"].exists)
        XCTAssertFalse(app.staticTexts["Bangkok"].exists)
    }

    func testCountryTagFiltersDestinations() throws {
        let app = XCUIApplication()
        app.launch()

        XCTAssertTrue(app.staticTexts["Explore Destinations"].waitForExistence(timeout: 15))

        let pakistanTag = app.buttons["Pakistan"]
        XCTAssertTrue(pakistanTag.waitForExistence(timeout: 2))
        XCTAssertTrue(pakistanTag.isHittable)
        pakistanTag.tap()

        let selected = NSPredicate(format: "value == %@", "Selected")
        expectation(for: selected, evaluatedWith: pakistanTag)
        waitForExpectations(timeout: 2)

        XCTAssertTrue(app.staticTexts["Islamabad"].waitForExistence(timeout: 2))
        XCTAssertTrue(app.staticTexts["Bangkok"].waitForNonExistence(timeout: 2))
        XCTAssertFalse(app.staticTexts["Manila"].exists)
        XCTAssertFalse(app.staticTexts["Mumbai"].exists)
    }

    func testLaunchPerformance() throws {
        if #available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 7.0, *) {
            // This measures how long it takes to launch your application.
            measure(metrics: [XCTApplicationLaunchMetric()]) {
                XCUIApplication().launch()
            }
        }
    }
}
