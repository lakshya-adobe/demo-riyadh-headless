//
// Copyright 2021 Adobe
// All Rights Reserved.
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.
//
//  TestData.swift
//  WKNDAdventures
//

import Foundation

struct TestDestinationsAll {
    static func get() -> [Destination] {
        let json = """
            {
              "data": {
                "destinationsList": {
                  "items": [
                    {
                      "_path": "/content/dam/riyadh/language-masters/en/content-fragments/destinations/bangkok",
                      "slug": "thailand-bangkok",
                      "destinationCity": "Bangkok",
                      "destinationCountry": "Thailand",
                      "backgroundImage": {
                        "_path": "/content/dam/riyadh/assets/card_1_image.jpg",
                        "_dynamicUrl": "/content/dam/riyadh/assets/card_1_image.jpg"
                      }
                    },
                    {
                      "_path": "/content/dam/riyadh/language-masters/en/content-fragments/destinations/manila",
                      "slug": "philippines-manila",
                      "destinationCity": "Manila",
                      "destinationCountry": "Philippines",
                      "backgroundImage": null
                    }
                  ]
                }
              }
            }
            """.data(using: .utf8)!

        let response = try! JSONDecoder().decode(DestinationsAllResponse.self, from: json)
        return response.data.destinationsList.items
    }
}

struct TestDestinationByPath {
    static func get() -> Destination {
        let json = """
            {
              "data": {
                "destinationsByPath": {
                  "item": {
                    "_path": "/content/dam/riyadh/language-masters/en/content-fragments/destinations/bangkok",
                    "slug": "thailand-bangkok",
                    "destinationCity": "Bangkok",
                    "destinationCountry": "Thailand",
                    "destinationDetails": {
                      "html": "<p>Discover Thailand's capital with Riyadh Air.</p>"
                    }
                  }
                }
              }
            }
            """.data(using: .utf8)!

        let response = try! JSONDecoder().decode(DestinationByPathResponse.self, from: json)
        return response.data.destinationsByPath.item!
    }
}
