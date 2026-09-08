//
// Copyright 2022 Adobe
// All Rights Reserved.
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.
//
//  Aem.swift
//  WKNDAdventures
//

import SwiftUI
import SDWebImage

/// #Aem object
///
/// Acts as a service object for managing concerns with connecting to AEM Headless.
///
/// + Making calls to AEM's GraphQL endpoints using persisted queries
/// + Adding specified authentication to GraphQL requests
/// + Adding specified authentication to the Image requests
/// + Adjusting relative images paths to source from AEM
///
final class Aem: ObservableObject {
    enum Error: Swift.Error {
        case invalidURL
        case invalidResponse
        case httpError(statusCode: Int)
    }

    let scheme: String
    let host: String
    var username: String?
    var password: String?
    var token: String?
    
    /// # No-authorization init
    /// Used when accessing AEM Publish when no authorization is required
    init(scheme: String, host: String) {
        self.scheme = scheme
        self.host = host
    }
    
    /// # Basic authentication init
    /// Used when authenticating to AEM using local accounts (basic auth)
    convenience init(scheme: String, host: String, username: String, password: String) {
        self.init(scheme: scheme, host: host)
        
        self.username = username
        self.password = password
        
        // Add basic auth headers to all Image requests, as they are (likely) protected as well
        SDWebImageDownloader.shared.setValue("Basic \(encodeBasicAuth(username: username, password: password))", forHTTPHeaderField: "Authorization")
    }
    
    /// # Token authentication init
    ///  Used when authenticating to AEM using token authentication (Dev Token or access token generated from Service Credentials)
    convenience init(scheme: String, host: String, token: String) {
        self.init(scheme: scheme, host: host)
        
        self.token = token
        
        // Add token auth headers to all Image requests, as they are (likely) protected as well
        SDWebImageDownloader.shared.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }
    
    /// # getDestinations()
    /// Returns all Riyadh Air destinations using the `riyadh/destinations-all` persisted query.
    /// For this func call to work, the `riyadh/destinations-all` query must be deployed to the AEM environment/service specified by the host
    func getDestinations() async throws -> [Destination] {
        let request = try makeRequest(persistedQueryName: "riyadh/destinations-all")
        let response = try await execute(DestinationsAllResponse.self, request: request)
        return response.data.destinationsList.items
    }


    /// # getDestinationByPath()
    /// Returns a single destination using the `riyadh/destination-by-path` persisted query.
    /// For this func call to work, the `riyadh/destination-by-path` query must be deployed to the AEM environment/service specified by the host.
    ///
    /// Only `destinationPath` is sent: supplying the image-transform params makes the
    /// endpoint return `backgroundImage` and omit `destinationDetails`, which is the
    /// content this screen renders.
    func getDestinationByPath(path: String) async throws -> Destination? {
        let orderedParams: [(String, String)] = [
            ("destinationPath", path),
        ]

        let request = try makeRequest(persistedQueryName: "riyadh/destination-by-path", params: orderedParams)
        let response = try await execute(DestinationByPathResponse.self, request: request)
        return response.data.destinationsByPath.item
    }
    
    /// # imageUrl(..)
    /// Prefixes AEM image paths with the AEM scheme/host.
    func imageUrl(path: String) -> URL? {
        URL(string: "\(scheme)://\(host)\(path)")
    }

    /// Whether to append a cache-busting timestamp to persisted-query requests.
    /// Sourced from the DISABLE_CACHE build setting (demo use only).
    private var disableCache: Bool {
        (try? Configuration.value(for: "DISABLE_CACHE")) ?? false
    }
        
    /// #makeRequest(..)
    /// Generic method for constructing and executing AEM GraphQL persisted queries.
    /// Params are an ordered list because AEM caches responses by the exact URL.
    func makeRequest(persistedQueryName: String, params: [(String, String)] = []) throws -> URLRequest {
        // Encode optional parameters as required by AEM
        var persistedQueryParams = params.map { (key, value) -> String in
            encode(string: ";\(key)=\(value)")
        }.joined(separator: "")

        // Cache-busting for demos ONLY: a unique timestamp forces a CDN cache miss so
        // content-fragment updates appear immediately. Toggle with DISABLE_CACHE.
        if disableCache {
            let timestamp = Int(Date().timeIntervalSince1970 * 1000)
            persistedQueryParams += encode(string: ";timestamp=\(timestamp)")
        }

        // Construct the AEM GraphQL persisted query URL, including optional query params
        let urlString = "\(scheme)://\(host)/graphql/execute.json/" + persistedQueryName + persistedQueryParams
        guard let url = URL(string: urlString) else {
            throw Error.invalidURL
        }

        var request = URLRequest(url: url)

        // Add authentication to the AEM GraphQL persisted query requests as defined by the iOS application's configuration
        request = addAuthHeaders(request: request)
        
        return request
    }

    private func execute<Response: Decodable & Sendable>(
        _ responseType: Response.Type,
        request: URLRequest
    ) async throws -> Response {
        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw Error.invalidResponse
        }
        guard (200..<300).contains(httpResponse.statusCode) else {
            throw Error.httpError(statusCode: httpResponse.statusCode)
        }

        return try JSONDecoder().decode(responseType, from: data)
    }
    
    /// #encode(..)
    /// Encodes string for use in query. This is used to encode persisted query parameters.
    private func encode(string: String) -> String {
        return string.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? string
    }

    /// #addAuthHeaders(..)
    /// Adds auth headers to request as specified by the init(..) func called
    private func addAuthHeaders(request: URLRequest) -> URLRequest {
        var requestWithAuth = request;
        
        if let token {
            requestWithAuth.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        } else if let username, let password {
            let basicAuth = encodeBasicAuth(username: username, password: password)
            requestWithAuth.addValue("Basic \(basicAuth)", forHTTPHeaderField: "Authorization")
        }
        
        return requestWithAuth;
    }
            
    /// #encodeBasicAuth(..)
    /// Base64 encodes basic auth username and password.
    private func encodeBasicAuth(username: String, password: String) -> String {
        Data("\(username):\(password)".utf8).base64EncodedString()
    }
}
