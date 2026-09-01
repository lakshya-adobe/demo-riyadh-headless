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
class Aem: ObservableObject {
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
    func getDestinations(completion: @escaping ([Destination]) ->  ()) {

        let request = makeRequest(persistedQueryName: "riyadh/destinations-all")

        URLSession.shared.dataTask(with: request) { (data, response, error) in
            guard let data = data, error == nil, !data.isEmpty else {
                print("Unable to connect to AEM GraphQL endpoint")
                DispatchQueue.main.async { completion([]) }
                return
            }
            do {
                let response = try JSONDecoder().decode(DestinationsAllResponse.self, from: data)
                DispatchQueue.main.async {
                    completion(response.data.destinationsList.items)
                }
            } catch {
                print("Unable to decode destinations: \(error)")
                DispatchQueue.main.async { completion([]) }
            }
        }.resume();
    }


    /// # getDestinationByPath()
    /// Returns a single destination using the `riyadh/destination-by-path` persisted query.
    /// For this func call to work, the `riyadh/destination-by-path` query must be deployed to the AEM environment/service specified by the host.
    ///
    /// Only `destinationPath` is sent: supplying the image-transform params makes the
    /// endpoint return `backgroundImage` and omit `destinationDetails`, which is the
    /// content this screen renders.
    func getDestinationByPath(path: String, completion: @escaping (Destination) ->  ()) {

        let orderedParams: [(String, String)] = [
            ("destinationPath", path),
        ]

        let request = makeRequest(persistedQueryName: "riyadh/destination-by-path", params: orderedParams)

        URLSession.shared.dataTask(with: request) { (data, response, error) in
            guard let data = data, error == nil, !data.isEmpty else {
                print("Unable to connect to AEM GraphQL endpoint")
                return
            }
            do {
                let response = try JSONDecoder().decode(DestinationByPathResponse.self, from: data)
                if let item = response.data.destinationsByPath.item {
                    DispatchQueue.main.async {
                        completion(item)
                    }
                }
            } catch {
                print("Unable to decode destination: \(error)")
            }
        }.resume();
    }
    
    /// # imageUrl(..)
    /// Prefixes AEM image paths wit the AEM scheme/host
    func imageUrl(path: String) -> URL {
        return URL(string: "\(self.scheme)://\(self.host)\(path)")!
    }
        
    /// #makeRequest(..)
    /// Generic method for constructing and executing AEM GraphQL persisted queries.
    /// Params are an ordered list because AEM caches responses by the exact URL.
    private func makeRequest(persistedQueryName: String, params: [(String, String)] = []) -> URLRequest {
        // Encode optional parameters as required by AEM
        let persistedQueryParams = params.map { (key, value) -> String in
            encode(string: ";\(key)=\(value)")
        }.joined(separator: "")
        
        // Construct the AEM GraphQL persisted query URL, including optional query params
        let url: String = "\(self.scheme)://\(self.host)/graphql/execute.json/" + persistedQueryName + persistedQueryParams;

        var request = URLRequest(url: URL(string: url)!);

        // Add authentication to the AEM GraphQL persisted query requests as defined by the iOS application's configuration
        request = addAuthHeaders(request: request)
        
        return request
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
        
        if self.token != nil {
            requestWithAuth.addValue("Bearer \(String(describing: self.token))", forHTTPHeaderField: "Authorization")
        } else if self.username != nil && self.password != nil {
            let basicAuth = encodeBasicAuth(username: self.username!, password: self.password!)
            requestWithAuth.addValue("Basic \(basicAuth)", forHTTPHeaderField: "Authorization")
        }
        
        return requestWithAuth;
    }
            
    /// #encodeBasicAuth(..)
    /// Base64 encodes basic auth username and password.
    private func encodeBasicAuth(username: String, password: String) -> String {
        return (username + ":" + password).data(using: .utf8)!.base64EncodedString()
    }
}
