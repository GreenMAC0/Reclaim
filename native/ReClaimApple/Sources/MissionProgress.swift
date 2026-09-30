import Foundation

// A value model: the rules do not depend on SwiftUI or a particular screen.
struct MissionProgress: Codable, Equatable {
    enum Step: Int, Codable, CaseIterable {
        case sort, drop, digestion, generation, reward
    }
    private(set) var step: Step = .sort
    private(set) var demoDrops = 0
    var lightUnlocked: Bool { step == .reward }

    mutating func answerSorting(keepPlasticOut: Bool) {
        guard step == .sort, keepPlasticOut else { return }
        step = .drop
    }
    mutating func recordDemoDrop() {
        guard step == .drop else { return }
        demoDrops += 1
        step = .digestion
    }
    mutating func advanceLesson() {
        if step == .digestion { step = .generation }
        else if step == .generation { step = .reward }
    }
    static func restore(_ data: Data?) -> Self {
        guard let data, let saved = try? JSONDecoder().decode(Self.self, from: data),
              saved.demoDrops == (saved.step.rawValue >= Step.digestion.rawValue ? 1 : 0)
        else { return Self() }
        return saved
    }
}
