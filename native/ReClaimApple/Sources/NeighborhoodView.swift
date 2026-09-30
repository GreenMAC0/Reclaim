import SwiftUI

struct NeighborhoodView: View {
    let store: MissionStore
    @State private var showMission = false
    @State private var destination: String?
    @State private var position = CGPoint(x: 0.5, y: 0.7)
    @State private var confirmReset = false
    private let background = Color(red: 0.04, green: 0.09, blue: 0.12)

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("Your neighborhood. Your next possibility.")
                        .font(.title2.bold())
                    world
                    HStack(spacing: 18) {
                        moveButton("arrow.left", x: -0.08, y: 0, label: "Move left")
                        moveButton("arrow.up", x: 0, y: -0.08, label: "Move up")
                        moveButton("arrow.down", x: 0, y: 0.08, label: "Move down")
                        moveButton("arrow.right", x: 0.08, y: 0, label: "Move right")
                    }.frame(maxWidth: .infinity)
                    Text("Move your explorer. Choose a destination to learn.")
                        .font(.footnote).foregroundStyle(.secondary)
                    Button { showMission = true } label: {
                        Label(store.progress.lightUnlocked ? "Neighborhood light unlocked" : "Power the neighborhood", systemImage: "bolt.fill")
                            .font(.headline).frame(maxWidth: .infinity).padding(12)
                    }.buttonStyle(.borderedProminent).tint(.mint).foregroundStyle(.black)
                    HStack {
                        Label("\(store.progress.demoDrops) simulated drop", systemImage: "leaf")
                        Spacer()
                        Text("\(min(store.progress.step.rawValue + 1, 5)) / 5 steps")
                    }.font(.subheadline)
                    Text("A playable learning prototype using original ReClaim artwork. Rewards and drops are simulated; no real energy production is recorded.")
                        .font(.footnote).foregroundStyle(.secondary)
                }.padding().frame(maxWidth: 850).frame(maxWidth: .infinity)
            }
            .background(background).foregroundStyle(.white).preferredColorScheme(.dark)
            .navigationTitle("ReClaim")
            .toolbar { ToolbarItem(placement: .topBarTrailing) {
                Menu("Options", systemImage: "ellipsis.circle") {
                    Button("Reset demo progress", role: .destructive) { confirmReset = true }
                }
            }}
            .confirmationDialog("Reset your simulated mission and reward?", isPresented: $confirmReset) {
                Button("Reset demo", role: .destructive) { store.reset() }
            }
            .sheet(isPresented: $showMission) { EnergyMissionView(store: store) }
            .alert(destination ?? "Explore", isPresented: Binding(get: { destination != nil }, set: { if !$0 { destination = nil } })) {
                Button("Got it") { destination = nil }
            } message: {
                Text(destination == "Garden" ? "Composting is an oxygen-dependent process that transforms organics into a soil amendment. The energy mission explores a different pathway: anaerobic digestion." : "Shared art makes participation visible. Your native prototype currently connects one simulated drop to the energy mission.")
            }
        }
    }
    private var world: some View {
        GeometryReader { geometry in
            ZStack {
                Image("Neighborhood").resizable().scaledToFill()
                    .frame(width: geometry.size.width, height: geometry.size.height).clipped()
                VStack {
                    HStack {
                        Button("Garden", systemImage: "leaf.fill") { destination = "Garden" }
                        Spacer()
                        Button("Energy center", systemImage: "bolt.fill") { showMission = true }
                    }
                    Spacer()
                    HStack {
                        Button("Art gallery", systemImage: "paintpalette") { destination = "Art gallery" }
                        Spacer()
                        if store.progress.lightUnlocked {
                            Image(systemName: "lightbulb.fill").font(.largeTitle).foregroundStyle(.yellow)
                                .shadow(color: .yellow, radius: 18).accessibilityLabel("Neighborhood light unlocked")
                        }
                    }
                }.padding().buttonStyle(.borderedProminent).tint(.black.opacity(0.8))
                Image(systemName: "figure.walk.circle.fill")
                    .font(.system(size: 44)).foregroundStyle(.white, .purple)
                    .shadow(radius: 6)
                    .position(x: geometry.size.width * position.x, y: geometry.size.height * position.y)
                    .accessibilityLabel("Your movable explorer")
                    .allowsHitTesting(false)
            }.clipShape(RoundedRectangle(cornerRadius: 24))
        }.frame(height: 340)
    }
    private func moveButton(_ symbol: String, x: CGFloat, y: CGFloat, label: String) -> some View {
        Button {
            withAnimation(.easeOut(duration: 0.15)) {
                position.x = min(0.9, max(0.1, position.x + x))
                position.y = min(0.85, max(0.25, position.y + y))
            }
        } label: { Image(systemName: symbol).frame(width: 44, height: 44) }
        .buttonStyle(.bordered).accessibilityLabel(label)
    }
}
