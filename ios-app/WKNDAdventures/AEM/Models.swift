//
// Copyright 2022 Adobe
// All Rights Reserved.
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.
//
//  Models.swift
//  WKNDAdventures
//

import Foundation

/// # Models
/// Swift structs that map to the AEM Headless destinations responses.
///
/// destinations-all:
/// ```
/// { "data": { "destinationsList": { "items": [ Destination ] } } }
/// ```
///
/// destination-by-path:
/// ```
/// { "data": { "destinationsByPath": { "item": Destination } } }
/// ```

// MARK: - Response envelopes

struct DestinationsAllResponse: Decodable {
    let data: DestinationsAllData
}

struct DestinationsAllData: Decodable {
    let destinationsList: DestinationsList
}

struct DestinationsList: Decodable {
    let items: [Destination]
}

struct DestinationByPathResponse: Decodable {
    let data: DestinationByPathData
}

struct DestinationByPathData: Decodable {
    let destinationsByPath: DestinationByPathWrapper
}

struct DestinationByPathWrapper: Decodable {
    let item: Destination?
}

// MARK: - Destination

/// Models a Riyadh Air destination. Shared by both the destinations-all and
/// destination-by-path queries, so query-specific fields are optional.
struct Destination: Identifiable, Decodable {

    enum CodingKeys: String, CodingKey {
        case path = "_path"
        case slug
        case destinationCity
        case destinationCountry
        case backgroundImage
        case destinationDetails
    }

    let path: String
    let slug: String?
    let destinationCity: String
    let destinationCountry: String?
    let backgroundImage: AemImage?
    let destinationDetails: RichText?

    // Stable identity from the unique content path.
    var id: String { path }

    /// Last path segment, used as the detail route id (e.g. "bangkok").
    var name: String {
        String(path.split(separator: "/").last ?? "")
    }

    /// Best available image path, preferring the dynamic (transformed) URL.
    func imagePath() -> String? {
        if let dynamicUrl = backgroundImage?._dynamicUrl, !dynamicUrl.isEmpty {
            return dynamicUrl
        }
        if let path = backgroundImage?._path, !path.isEmpty {
            return path
        }
        return nil
    }

    var detailsHtml: String {
        destinationDetails?.html ?? ""
    }

    func isEmpty() -> Bool {
        destinationCity.isEmpty
    }

    static func empty() -> Destination {
        Destination(path: "", slug: nil, destinationCity: "", destinationCountry: nil, backgroundImage: nil, destinationDetails: nil)
    }
}

struct AemImage: Decodable {
    let _path: String?
    let _dynamicUrl: String?
}

struct RichText: Decodable {
    let html: String?
    let plaintext: String?
}
