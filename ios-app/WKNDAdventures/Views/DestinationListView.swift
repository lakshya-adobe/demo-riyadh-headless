//
// Copyright 2022 Adobe
// All Rights Reserved.
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.
//
//  DestinationListView.swift
//  WKNDAdventures
//

import SwiftUI
import SDWebImage

struct DestinationListView: View {
    @EnvironmentObject private var aem: Aem
    @State private var destinations: [Destination] = []
    @State private var selectedCountry: String? = nil

    init() {
        // Brand the navigation bar to the Riyadh Air dark indigo header.
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = Theme.uiIndigoDeep
        appearance.shadowColor = .clear
        appearance.titleTextAttributes = [.foregroundColor: UIColor.white]
        UINavigationBar.appearance().standardAppearance = appearance
        UINavigationBar.appearance().scrollEdgeAppearance = appearance
        UINavigationBar.appearance().compactAppearance = appearance
    }

    private var countries: [String] {
        Array(Set(destinations.compactMap { $0.destinationCountry })).sorted()
    }

    private var visibleDestinations: [Destination] {
        guard let selectedCountry = selectedCountry else { return destinations }
        return destinations.filter { $0.destinationCountry == selectedCountry }
    }

    private func loadDestinations() {
        aem.getDestinations { destinations in
            self.destinations = destinations
        }
    }

    var body: some View {
        NavigationView {
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 20) {
                    Text("Explore Destinations")
                        .font(Theme.heading(30))
                        .foregroundColor(Theme.textPrimary)
                        .padding(.horizontal)
                        .padding(.top, 8)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            CountryPill(label: "All", selected: selectedCountry == nil) {
                                selectedCountry = nil
                            }
                            ForEach(countries, id: \.self) { country in
                                CountryPill(label: country, selected: selectedCountry == country) {
                                    selectedCountry = country
                                }
                            }
                        }
                        .padding(.horizontal)
                    }

                    ForEach(visibleDestinations) { destination in
                        NavigationLink(destination: DestinationDetailView(destinationName: destination.name, initial: destination)) {
                            DestinationListItemView(destination: destination)
                        }
                        .buttonStyle(.plain)
                        .padding(.horizontal)
                    }
                }
                .padding(.bottom, 24)
            }
            .background(Theme.pageBg.ignoresSafeArea())
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Image("RiyadhAirLogo")
                        .renderingMode(.original)
                        .resizable()
                        .scaledToFit()
                        .frame(height: 26)
                }
            }
            .onAppear {
                loadDestinations()
            }
            .refreshable {
                SDImageCache.shared.clearMemory()
                SDImageCache.shared.clearDisk()
                loadDestinations()
            }
        }
        .navigationViewStyle(.stack)
    }
}

/// Pill-shaped country filter, mirroring the web app's filter chips.
struct CountryPill: View {
    let label: String
    let selected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(Theme.bold(15))
                .padding(.vertical, 8)
                .padding(.horizontal, 18)
                .foregroundColor(selected ? .white : Theme.indigo)
                .background(selected ? Theme.indigo : Color.white)
                .clipShape(Capsule())
                .overlay(Capsule().stroke(Theme.indigo, lineWidth: 1.5))
        }
        .buttonStyle(.plain)
    }
}

struct DestinationListView_Previews: PreviewProvider {
    static var previews: some View {
        DestinationListView()
            .environmentObject(Aem(scheme: "https", host: "localhost"))
    }
}
