//
// Copyright 2022 Adobe
// All Rights Reserved.
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.
//
//  DestinationDetailView.swift
//  WKNDAdventures
//

import SwiftUI
import SDWebImageSwiftUI

/// Displays a destination, built from the destination-by-path persisted query.
/// The destinationDetails HTML carries the title, hero image and description.
struct DestinationDetailView: View {
    @EnvironmentObject private var aem: Aem

    let destinationName: String
    @State private var destination: Destination
    @State private var title: String = ""
    @State private var imageUrl: String?
    @State private var headingText: String = ""
    @State private var bodyText: String = ""

    // All destination content fragments live under this parent path.
    private static let destinationsRoot = "/content/dam/riyadh/content-fragments/destinations"

    init(destinationName: String, initial: Destination) {
        self.destinationName = destinationName
        _destination = State(initialValue: initial)
    }

    private func loadDestination() {
        let path = "\(Self.destinationsRoot)/\(destinationName)"
        aem.getDestinationByPath(path: path) { destination in
            self.destination = destination
            let parsed = parseDestinationDetails(destination.detailsHtml)
            self.title = parsed.title
            self.imageUrl = parsed.imageUrl
            self.headingText = parsed.heading
            self.bodyText = parsed.body
        }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                FlightSearchCard()

                if !title.isEmpty {
                    Text(title)
                        .font(Theme.heading(32))
                        .foregroundColor(Theme.textPrimary)
                }

                if let imageUrl = imageUrl, let url = URL(string: imageUrl) {
                    WebImage(url: url)
                        .resizable()
                        .indicator(.activity)
                        .transition(.fade(duration: 0.4))
                        .scaledToFill()
                        .frame(height: 220)
                        .frame(maxWidth: .infinity)
                        .clipped()
                        .cornerRadius(20)
                }

                if !headingText.isEmpty {
                    Text(headingText)
                        .font(Theme.heading(24))
                        .foregroundColor(Theme.textPrimary)
                }

                if !bodyText.isEmpty {
                    Text(bodyText)
                        .font(Theme.body(16))
                        .foregroundColor(Theme.textPrimary)
                        .lineSpacing(6)
                        .fixedSize(horizontal: false, vertical: true)
                }

                Spacer(minLength: 0)
            }
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .background(Theme.pageBg.ignoresSafeArea())
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            loadDestination()
        }
    }
}

/// Presentational flight-search widget mirroring riyadhair.com (no booking backend).
struct FlightSearchCard: View {
    var body: some View {
        VStack(spacing: 14) {
            HStack(alignment: .center) {
                field("From", "RUH - Riyadh")
                Spacer()
                Image(systemName: "arrow.left.arrow.right")
                    .foregroundColor(Theme.textSecondary)
                Spacer()
                field("To", "To", placeholder: true)
            }
            Divider()
            HStack {
                field("Departure", "Departure", placeholder: true)
                Spacer()
                field("Return", "Return", placeholder: true)
            }
            Divider()
            HStack(alignment: .center) {
                field("Guests", "1 Guest")
                Spacer()
                field("Cabin", "Economy")
                Spacer()
                Button(action: {}) {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.white)
                        .frame(width: 44, height: 44)
                        .background(Theme.indigo)
                        .clipShape(Circle())
                }
                .buttonStyle(.plain)
            }
        }
        .padding(18)
        .background(Color.white)
        .cornerRadius(20)
        .shadow(color: Color.black.opacity(0.08), radius: 12, x: 0, y: 6)
    }

    @ViewBuilder
    private func field(_ label: String, _ value: String, placeholder: Bool = false) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label)
                .font(Theme.body(12))
                .foregroundColor(Theme.textSecondary)
            Text(value)
                .font(Theme.bold(15))
                .foregroundColor(placeholder ? Theme.textSecondary : Theme.textPrimary)
        }
    }
}

// MARK: - destinationDetails HTML parsing

private struct ParsedDetails {
    let title: String
    let imageUrl: String?
    let heading: String
    let body: String
}

/// Parses the destinationDetails html into the pieces the design lays out.
private func parseDestinationDetails(_ rawHtml: String) -> ParsedDetails {
    guard !rawHtml.isEmpty else {
        return ParsedDetails(title: "", imageUrl: nil, heading: "", body: "")
    }

    // Decode twice to unwrap the double-escaped markup.
    let decoded = decodeEntities(decodeEntities(rawHtml))

    var imageUrl = firstCapture(#"<img[^>]+src="([^"]+)""#, in: decoded)
    if let url = imageUrl, !(url.hasPrefix("http://") || url.hasPrefix("https://")) {
        imageUrl = nil
    }

    let paragraphs = captures(#"<p[^>]*>(.*?)</p>"#, in: decoded)
        .map { stripTags($0).trimmingCharacters(in: .whitespacesAndNewlines) }
        .filter { !$0.isEmpty }

    let title = paragraphs.first ?? ""
    let description = paragraphs.dropFirst().joined(separator: "\n\n")

    // Heading and body are concatenated at a lowercase->uppercase seam (missing space).
    if let seam = seamSplit(description) {
        return ParsedDetails(title: title, imageUrl: imageUrl, heading: seam.0, body: seam.1)
    }
    return ParsedDetails(title: title, imageUrl: imageUrl, heading: "", body: description)
}

private func decodeEntities(_ input: String) -> String {
    var s = input
    let entities = [
        "&lt;": "<", "&gt;": ">", "&quot;": "\"", "&#34;": "\"",
        "&#39;": "'", "&apos;": "'", "&nbsp;": " ", "&amp;": "&",
    ]
    for (entity, char) in entities {
        s = s.replacingOccurrences(of: entity, with: char)
    }
    return s
}

private func stripTags(_ input: String) -> String {
    input.replacingOccurrences(of: "<[^>]+>", with: "", options: .regularExpression)
}

/// Splits at the first lowercase-immediately-followed-by-uppercase boundary.
private func seamSplit(_ s: String) -> (String, String)? {
    let chars = Array(s)
    guard chars.count > 1 else { return nil }
    for i in 0..<(chars.count - 1) where chars[i].isLowercase && chars[i + 1].isUppercase {
        return (String(chars[0...i]), String(chars[(i + 1)...]))
    }
    return nil
}

private func firstCapture(_ pattern: String, in text: String) -> String? {
    guard let re = try? NSRegularExpression(pattern: pattern, options: [.caseInsensitive, .dotMatchesLineSeparators]) else { return nil }
    let range = NSRange(text.startIndex..., in: text)
    guard let match = re.firstMatch(in: text, range: range),
          match.numberOfRanges > 1,
          let r = Range(match.range(at: 1), in: text) else { return nil }
    return String(text[r])
}

private func captures(_ pattern: String, in text: String) -> [String] {
    guard let re = try? NSRegularExpression(pattern: pattern, options: [.caseInsensitive, .dotMatchesLineSeparators]) else { return [] }
    let range = NSRange(text.startIndex..., in: text)
    return re.matches(in: text, range: range).compactMap { match in
        guard match.numberOfRanges > 1, let r = Range(match.range(at: 1), in: text) else { return nil }
        return String(text[r])
    }
}

struct DestinationDetailView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            DestinationDetailView(destinationName: "bangkok", initial: TestDestinationsAll.get()[0])
                .environmentObject(Aem(scheme: "https", host: "localhost"))
        }
    }
}
