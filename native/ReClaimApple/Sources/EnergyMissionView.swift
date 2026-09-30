import SwiftUI

struct EnergyMissionView: View {
    let store: MissionStore
    @Environment(\.dismiss) private var dismiss
    @State private var feedback = ""
    private var step: MissionProgress.Step { store.progress.step }
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text("FIELD LAB 01 · ENERGY").font(.caption.bold()).foregroundStyle(.secondary)
                    Text(title).font(.largeTitle.bold())
                    ProgressView(value: Double(step.rawValue), total: 4)
                        .accessibilityLabel("Mission step \(step.rawValue + 1) of 5")
                    Image(systemName: symbol).font(.system(size: 76))
                        .foregroundStyle(step == .reward ? .yellow : .mint)
                        .frame(maxWidth: .infinity).padding(30)
                        .background(.mint.opacity(0.08), in: RoundedRectangle(cornerRadius: 24))
                    Text(explanation).font(.title3).fixedSize(horizontal: false, vertical: true)
                    if step == .sort {
                        action("Food scraps only · keep plastic out") { store.sort(keepPlasticOut: true); feedback = "" }
                        Button("Put in scraps and the plastic cup") { feedback = "Keep plastic out. It contaminates the organics stream. Separate the food scraps and check local guidance for the cup." }
                            .buttonStyle(.bordered).frame(minHeight: 44)
                        if !feedback.isEmpty { Text(feedback).foregroundStyle(.orange).accessibilityAddTraits(.updatesFrequently) }
                    } else if step == .drop {
                        action("Simulate my drop") { store.drop() }
                    } else if step == .digestion {
                        action("Follow the biogas") { store.next() }
                    } else if step == .generation {
                        action("Light up the neighborhood") { store.next() }
                    } else {
                        Label("Reward saved on this device", systemImage: "checkmark.seal.fill").foregroundStyle(.mint)
                        action("Return to my neighborhood") { dismiss() }
                    }
                    Text("Simulation only. Time is simplified. No measured energy, verified disposal or compost delivery is recorded.")
                        .font(.footnote).foregroundStyle(.secondary)
                    Link("Explore the science · US EPA", destination: URL(string: "https://www.epa.gov/anaerobic-digestion/basic-information-about-anaerobic-digestion")!)
                }.padding(24).frame(maxWidth: 640).frame(maxWidth: .infinity)
            }.navigationTitle("Energy mission").navigationBarTitleDisplayMode(.inline)
                .toolbar { ToolbarItem(placement: .topBarTrailing) { Button("Done") { dismiss() } } }
        }.preferredColorScheme(.dark)
    }
    private func action(_ title: String, perform: @escaping () -> Void) -> some View {
        Button(action: perform) { Text(title).font(.headline).frame(maxWidth: .infinity).padding(12) }
            .buttonStyle(.borderedProminent).foregroundStyle(.black)
    }
    private var title: String {
        switch step {
        case .sort: "Start with clean scraps"
        case .drop: "A small action starts a journey"
        case .digestion: "Tiny microbes. Big possibility."
        case .generation: "Turn biogas into useful energy"
        case .reward: "A brighter place to gather"
        }
    }
    private var symbol: String {
        switch step {
        case .sort: "leaf.circle"
        case .drop: "tray.and.arrow.down.fill"
        case .digestion: "bubbles.and.sparkles.fill"
        case .generation: "bolt.circle.fill"
        case .reward: "lightbulb.fill"
        }
    }
    private var explanation: String {
        switch step {
        case .sort: "Your food scraps are in a plastic cup. What belongs in the organics stream?"
        case .drop: "Record one practice drop. This connects the sorting lesson to a simulated contribution, not a real station visit."
        case .digestion: "Inside a sealed digester, microbes break down organics without oxygen. The process produces biogas and remaining digested material. It takes time under suitable conditions."
        case .generation: "After appropriate treatment, biogas can fuel an engine and generator to produce electricity. Heat can also be recovered where there is a useful demand. Digestate needs appropriate treatment and use."
        case .reward: "Your virtual neighborhood light is unlocked. It represents what recovering resources could make possible—not electricity you have actually generated."
        }
    }
}
