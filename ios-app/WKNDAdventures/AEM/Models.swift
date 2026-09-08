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

/// Languages supported by the Riyadh Air content-fragment tree.
enum ContentLanguage: String, CaseIterable, Identifiable {
    case english = "en"
    case arabic = "ar"

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .english:
            return "English"
        case .arabic:
            return "العربية"
        }
    }

    var destinationsHeading: String {
        switch self {
        case .english:
            return "Explore Destinations"
        case .arabic:
            return "استكشف الوجهات"
        }
    }

    var allDestinationsLabel: String {
        switch self {
        case .english:
            return "All"
        case .arabic:
            return "الكل"
        }
    }

    var selectorAccessibilityLabel: String {
        switch self {
        case .english:
            return "Language"
        case .arabic:
            return "اللغة"
        }
    }

    var locale: Locale {
        Locale(identifier: rawValue)
    }

    /// Exact AEM roots accepted for this language. Arabic supports both the
    /// language-master tree and the translated live-copy tree.
    private var destinationRoots: [String] {
        switch self {
        case .english:
            return [
                "/content/dam/riyadh/language-masters/en/content-fragments/destinations",
            ]
        case .arabic:
            return [
                "/content/dam/riyadh/language-masters/ar/content-fragments/destinations",
                "/content/dam/riyadh/ar/content-fragments/destinations",
            ]
        }
    }

    /// Returns true only for fragments at or below a configured root. The
    /// separator check prevents similarly prefixed folders from matching.
    func contains(destinationPath: String) -> Bool {
        destinationRoots.contains { root in
            destinationPath == root || destinationPath.hasPrefix("\(root)/")
        }
    }

    func destinationPath(for name: String) -> String {
        "\(destinationRoots[0])/\(name)"
    }
}

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

struct DestinationsAllResponse: Decodable, Sendable {
    let data: DestinationsAllData
}

struct DestinationsAllData: Decodable, Sendable {
    let destinationsList: DestinationsList
}

struct DestinationsList: Decodable, Sendable {
    let items: [Destination]
}

struct DestinationByPathResponse: Decodable, Sendable {
    let data: DestinationByPathData
}

struct DestinationByPathData: Decodable, Sendable {
    let destinationsByPath: DestinationByPathWrapper
}

struct DestinationByPathWrapper: Decodable, Sendable {
    let item: Destination?
}

// MARK: - Destination

/// Models a Riyadh Air destination. Shared by both the destinations-all and
/// destination-by-path queries, so query-specific fields are optional.
struct Destination: Identifiable, Decodable, Sendable {

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

struct AemImage: Decodable, Sendable {
    let _path: String?
    let _dynamicUrl: String?
}

struct RichText: Decodable, Sendable {
    let html: String?
    let plaintext: String?
}
