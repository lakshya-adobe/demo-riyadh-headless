//
// Copyright 2022 Adobe
// All Rights Reserved.
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.
//
//  Theme.swift
//  WKNDAdventures
//
//  Riyadh Air design tokens (colors + typography), mirroring the web app.
//

import SwiftUI

enum Theme {
    // Palette
    static let navy = Color(hex: 0x020817)
    static let indigo = Color(hex: 0x250854)
    static let indigoHover = Color(hex: 0x351066)
    static let indigoDeep = Color(hex: 0x12042E)
    static let pageBg = Color(hex: 0xF7F7F8)
    static let surface = Color.white
    static let textPrimary = Color(hex: 0x020817)
    static let textSecondary = Color(hex: 0x5B6572)
    static let border = Color(hex: 0xE4E7EC)

    // Header gradient, matches the web dark indigo bar
    static let headerGradient = LinearGradient(
        colors: [Color(hex: 0x2A1550), indigoDeep],
        startPoint: .top,
        endPoint: .bottom
    )

    // Typography (loewRiyadhAir, registered via Info.plist UIAppFonts)
    static func heading(_ size: CGFloat) -> Font { .custom("LoewRiyadhAir-Regular", size: size) }
    static func body(_ size: CGFloat) -> Font { .custom("LoewRiyadhAir-Regular", size: size) }
    static func bold(_ size: CGFloat) -> Font { .custom("LoewRiyadhAir-Bold", size: size) }
    static func light(_ size: CGFloat) -> Font { .custom("LoewRiyadhAir-Light", size: size) }

    static let uiIndigoDeep = UIColor(indigoDeep)
}

extension Color {
    /// Create a Color from a 0xRRGGBB hex literal.
    init(hex: UInt, alpha: Double = 1) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xff) / 255,
            green: Double((hex >> 8) & 0xff) / 255,
            blue: Double(hex & 0xff) / 255,
            opacity: alpha
        )
    }
}
