import SwiftUI

@main
struct ReClaimApp: App {
    @State private var store = MissionStore()
    var body: some Scene {
        WindowGroup { NeighborhoodView(store: store).tint(.mint) }
    }
}
