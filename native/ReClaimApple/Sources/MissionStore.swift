import Foundation
import Observation

// One owner for progress. Views read it and request actions; they don't edit steps directly.
@MainActor @Observable
final class MissionStore {
    private(set) var progress: MissionProgress
    private let defaults: UserDefaults
    private let key = "reclaim.native.energy.v1"

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        progress = MissionProgress.restore(defaults.data(forKey: key))
    }
    func sort(keepPlasticOut: Bool) { progress.answerSorting(keepPlasticOut: keepPlasticOut); save() }
    func drop() { progress.recordDemoDrop(); save() }
    func next() { progress.advanceLesson(); save() }
    func reset() { progress = MissionProgress(); save() }
    private func save() {
        if let data = try? JSONEncoder().encode(progress) { defaults.set(data, forKey: key) }
    }
}
