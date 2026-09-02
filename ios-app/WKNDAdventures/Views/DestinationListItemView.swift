//
// Copyright 2022 Adobe
// All Rights Reserved.
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.
//
//  DestinationListItemView.swift
//  WKNDAdventures
//

import SwiftUI
import SDWebImageSwiftUI

/// A single destination rendered as a Riyadh Air card.
struct DestinationListItemView: View {
    @EnvironmentObject private var aem: Aem
    let destination: Destination

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Group {
                if let path = destination.imagePath() {
                    WebImage(url: aem.imageUrl(path: path))
                        .resizable()
                        .indicator(.activity)
                        .transition(.fade(duration: 0.4))
                        .scaledToFill()
                } else {
                    // Brand banner fallback for destinations without an image.
                    Theme.headerGradient
                }
            }
            .frame(height: 190)
            .frame(maxWidth: .infinity)
            .clipped()

            VStack(alignment: .leading, spacing: 4) {
                Text(destination.destinationCity)
                    .font(Theme.heading(22))
                    .foregroundColor(Theme.textPrimary)
                if let country = destination.destinationCountry {
                    Text(country)
                        .font(Theme.body(14))
                        .foregroundColor(Theme.textSecondary)
                }
            }
            .padding(16)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .background(Theme.surface)
        .cornerRadius(16)
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Theme.border, lineWidth: 1))
        .shadow(color: Color.black.opacity(0.08), radius: 12, x: 0, y: 6)
    }
}

struct DestinationListItemView_Previews: PreviewProvider {
    static var previews: some View {
        DestinationListItemView(destination: Destination(
            path: "/content/dam/riyadh/content-fragments/destinations/preview-destination",
            slug: "saudi-arabia-riyadh",
            destinationCity: "Riyadh",
            destinationCountry: "Saudi Arabia",
            backgroundImage: nil,
            destinationDetails: nil
        ))
        .environmentObject(Aem(scheme: "https", host: "localhost"))
        .previewLayout(.fixed(width: 360, height: 320))
        .padding()
    }
}

