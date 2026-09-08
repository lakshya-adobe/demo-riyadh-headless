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
    @State private var selectedLanguage: ContentLanguage = .english
    @State private var selectedCountry: String?

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
        Array(Set(localizedDestinations.compactMap { $0.destinationCountry }))
            .sorted {
                $0.compare($1, options: [], range: nil, locale: selectedLanguage.locale) == .orderedAscending
            }
    }

    private var localizedDestinations: [Destination] {
        destinations.filter { selectedLanguage.contains(destinationPath: $0.path) }
    }

    private var activeCountry: String? {
        guard let selectedCountry, countries.contains(selectedCountry) else {
            return nil
        }
        return selectedCountry
    }

    private var visibleDestinations: [Destination] {
        guard let activeCountry else { return localizedDestinations }
        return localizedDestinations.filter { $0.destinationCountry == activeCountry }
    }

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Header (heading + country filter) is intentionally NOT lazy:
                    // a horizontal ScrollView mis-measures its height inside a
                    // LazyVStack, letting the first card overlap the filter row and
                    // steal its taps. Only the destination cards need to be lazy.
                    Text(selectedLanguage.destinationsHeading)
                        .font(Theme.heading(30))
                        .foregroundColor(Theme.textPrimary)
                        .padding(.horizontal)
                        .padding(.top, 8)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            CountryPill(label: selectedLanguage.allDestinationsLabel, selected: activeCountry == nil) {
                                selectedCountry = nil
                            }
                            ForEach(countries, id: \.self) { country in
                                CountryPill(label: country, selected: activeCountry == country) {
                                    selectedCountry = country
                                }
                            }
                        }
                        .padding(.horizontal)
                    }

                    LazyVStack(alignment: .leading, spacing: 20) {
                        ForEach(visibleDestinations) { destination in
                            NavigationLink(destination: DestinationDetailView(
                                destinationPath: destination.path,
                                language: $selectedLanguage
                            )) {
                                DestinationListItemView(destination: destination)
                            }
                            .buttonStyle(.plain)
                            .contentShape(Rectangle())
                            .padding(.horizontal)
                        }
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
                ToolbarItem(placement: .navigationBarTrailing) {
                    LanguageSelector(selection: $selectedLanguage)
                }
            }
            .task {
                await loadDestinations()
            }
            .refreshable {
                SDImageCache.shared.clearMemory()
                await SDImageCache.shared.clearDiskOnCompletion()
                await loadDestinations()
            }
        }
        .navigationViewStyle(.stack)
        .environment(\.layoutDirection, selectedLanguage == .arabic ? .rightToLeft : .leftToRight)
    }

    private func loadDestinations() async {
        do {
            destinations = try await aem.getDestinations()
        } catch where Task.isCancelled {
            return
        } catch {
            print("Unable to load destinations: \(error)")
            destinations = []
        }
    }
}

/// Compact language menu that remains legible in the branded navigation bar.
struct LanguageSelector: View {
    @Binding var selection: ContentLanguage

    var body: some View {
        Menu {
            ForEach(ContentLanguage.allCases) { language in
                Button {
                    selection = language
                } label: {
                    if language == selection {
                        Label(language.displayName, systemImage: "checkmark")
                    } else {
                        Text(language.displayName)
                    }
                }
            }
        } label: {
            HStack(spacing: 4) {
                Image(systemName: "globe")
                Text(selection.rawValue.uppercased())
                    .font(Theme.bold(14))
            }
            .foregroundColor(.white)
        }
        .accessibilityLabel(selection.selectorAccessibilityLabel)
        .accessibilityValue(selection.displayName)
        .accessibilityIdentifier("language-selector")
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
                .overlay {
                    Capsule()
                        .stroke(Theme.indigo, lineWidth: 1.5)
                        .allowsHitTesting(false)
                }
                .contentShape(Capsule())
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(selected ? .isSelected : [])
        .accessibilityValue(selected ? "Selected" : "Not selected")
    }
}

struct DestinationListView_Previews: PreviewProvider {
    static var previews: some View {
        DestinationListView()
            .environmentObject(Aem(scheme: "https", host: "localhost"))
    }
}
