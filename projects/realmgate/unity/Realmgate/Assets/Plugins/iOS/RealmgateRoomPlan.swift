// RoomPlan bridge for Unity (iOS 17+, LiDAR devices).
//
// C# calls RG_RoomPlanStart(outDir, worldMapPath, callback). This presents
// Apple's RoomCaptureView full screen. When the player taps Done it:
//   1. saves the ARKit world map (so the room can be recognised later and the
//      next room lines up with this one), then
//   2. writes the processed room as JSON and calls back with that JSON.
// If worldMapPath names an existing map, the capture first relocalizes against
// it so every room in a world shares one coordinate frame.
//
// Unity's own AR session must be paused while this runs (one ARSession at a time).

import Foundation
import UIKit
import ARKit
import RoomPlan

public typealias RGCallback = @convention(c) (UnsafePointer<CChar>?) -> Void

@_cdecl("RG_RoomPlanSupported")
public func RG_RoomPlanSupported() -> Bool {
    if #available(iOS 17.0, *) { return RoomCaptureSession.isSupported }
    return false
}

@_cdecl("RG_RoomPlanStart")
public func RG_RoomPlanStart(_ outDir: UnsafePointer<CChar>, _ worldMapPath: UnsafePointer<CChar>, _ callback: RGCallback) {
    let dir = String(cString: outDir)
    let mapPath = String(cString: worldMapPath)
    DispatchQueue.main.async {
        guard #available(iOS 17.0, *), RoomCaptureSession.isSupported else {
            RGScanReporter.fail("Room scanning needs an iPhone or iPad with LiDAR on iOS 17 or later.", callback)
            return
        }
        guard let root = RGScanReporter.topController() else {
            RGScanReporter.fail("No view controller to present the scanner.", callback)
            return
        }
        let vc = RGRoomScanController(outDir: dir, worldMapPath: mapPath, callback: callback)
        vc.modalPresentationStyle = .fullScreen
        root.present(vc, animated: true)
    }
}

enum RGScanReporter {
    static func fail(_ message: String, _ callback: RGCallback) {
        let json = (try? JSONSerialization.data(withJSONObject: ["ok": false, "error": message])) ?? Data()
        send(String(data: json, encoding: .utf8) ?? "{\"ok\":false}", callback)
    }

    static func send(_ json: String, _ callback: RGCallback) {
        json.withCString { callback($0) }
    }

    static func topController() -> UIViewController? {
        let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
        var top = scenes.flatMap { $0.windows }.first { $0.isKeyWindow }?.rootViewController
        while let presented = top?.presentedViewController { top = presented }
        return top
    }
}

@available(iOS 17.0, *)
final class RGRoomScanController: UIViewController, RoomCaptureViewDelegate {
    private let outDir: String
    private let worldMapPath: String
    private let callback: RGCallback
    private let arSession = ARSession()
    private var captureView: RoomCaptureView!
    private let status = UILabel()
    private let doneButton = UIButton(type: .system)
    private let cancelButton = UIButton(type: .system)
    private var relocalizeTimer: Timer?
    private var finished = false

    init(outDir: String, worldMapPath: String, callback: @escaping RGCallback) {
        self.outDir = outDir
        self.worldMapPath = worldMapPath
        self.callback = callback
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) { fatalError("not used") }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        captureView = RoomCaptureView(frame: view.bounds, arSession: arSession)
        captureView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        captureView.delegate = self
        view.addSubview(captureView)

        status.textColor = .white
        status.font = .boldSystemFont(ofSize: 16)
        status.textAlignment = .center
        status.numberOfLines = 0
        status.backgroundColor = UIColor.black.withAlphaComponent(0.55)
        status.layer.cornerRadius = 10
        status.clipsToBounds = true
        status.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(status)

        for (button, title) in [(doneButton, "Done"), (cancelButton, "Cancel")] {
            button.setTitle(title, for: .normal)
            button.titleLabel?.font = .boldSystemFont(ofSize: 18)
            button.backgroundColor = UIColor.black.withAlphaComponent(0.55)
            button.setTitleColor(.white, for: .normal)
            button.layer.cornerRadius = 10
            button.translatesAutoresizingMaskIntoConstraints = false
            view.addSubview(button)
        }
        doneButton.addTarget(self, action: #selector(done), for: .touchUpInside)
        cancelButton.addTarget(self, action: #selector(cancel), for: .touchUpInside)

        let g = view.safeAreaLayoutGuide
        NSLayoutConstraint.activate([
            status.topAnchor.constraint(equalTo: g.topAnchor, constant: 12),
            status.leadingAnchor.constraint(equalTo: g.leadingAnchor, constant: 16),
            status.trailingAnchor.constraint(equalTo: g.trailingAnchor, constant: -16),
            cancelButton.bottomAnchor.constraint(equalTo: g.bottomAnchor, constant: -16),
            cancelButton.leadingAnchor.constraint(equalTo: g.leadingAnchor, constant: 16),
            cancelButton.widthAnchor.constraint(equalToConstant: 110),
            cancelButton.heightAnchor.constraint(equalToConstant: 48),
            doneButton.bottomAnchor.constraint(equalTo: g.bottomAnchor, constant: -16),
            doneButton.trailingAnchor.constraint(equalTo: g.trailingAnchor, constant: -16),
            doneButton.widthAnchor.constraint(equalToConstant: 110),
            doneButton.heightAnchor.constraint(equalToConstant: 48),
        ])
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if let map = loadWorldMap() {
            // Recognise the existing world first so the new room shares its frame.
            let config = ARWorldTrackingConfiguration()
            config.initialWorldMap = map
            arSession.run(config, options: [.resetTracking, .removeExistingAnchors])
            setStatus("Point the phone at a room you already scanned until it is recognised…")
            doneButton.isEnabled = false
            var normalFor = 0
            relocalizeTimer = Timer.scheduledTimer(withTimeInterval: 0.25, repeats: true) { [weak self] t in
                guard let self = self else { t.invalidate(); return }
                if case .normal = self.arSession.currentFrame?.camera.trackingState { normalFor += 1 } else { normalFor = 0 }
                if normalFor >= 4 {
                    t.invalidate()
                    self.startCapture()
                }
            }
        } else {
            startCapture()
        }
    }

    private func startCapture() {
        setStatus("Walk slowly and point at walls, doors and furniture. Tap Done when the room is outlined.")
        doneButton.isEnabled = true
        captureView.captureSession.run(configuration: RoomCaptureSession.Configuration())
        DispatchQueue.main.asyncAfter(deadline: .now() + 6) { [weak self] in self?.setStatus(nil) }
    }

    private func setStatus(_ text: String?) {
        status.text = text.map { "  \($0)  " }
        status.isHidden = text == nil
    }

    private func loadWorldMap() -> ARWorldMap? {
        guard !worldMapPath.isEmpty, let data = FileManager.default.contents(atPath: worldMapPath) else { return nil }
        return try? NSKeyedUnarchiver.unarchivedObject(ofClass: ARWorldMap.self, from: data)
    }

    @objc private func done() {
        doneButton.isEnabled = false
        cancelButton.isEnabled = false
        setStatus("Saving…")
        arSession.getCurrentWorldMap { [weak self] map, _ in
            guard let self = self else { return }
            if let map = map, let data = try? NSKeyedArchiver.archivedData(withRootObject: map, requiringSecureCoding: true) {
                try? FileManager.default.createDirectory(atPath: self.outDir, withIntermediateDirectories: true)
                let path = (self.outDir as NSString).appendingPathComponent("world.arworldmap")
                FileManager.default.createFile(atPath: path, contents: data)
            }
            DispatchQueue.main.async { self.captureView.captureSession.stop() }
        }
    }

    @objc private func cancel() {
        relocalizeTimer?.invalidate()
        captureView.captureSession.stop()
        arSession.pause()
        finish { RGScanReporter.fail("cancelled", self.callback) }
    }

    // RoomCaptureViewDelegate
    func captureView(shouldPresent roomDataForProcessing: CapturedRoomData, error: Error?) -> Bool { true }

    func captureView(didPresent processedResult: CapturedRoom, error: Error?) {
        if finished { return }
        if let error = error {
            arSession.pause()
            finish { RGScanReporter.fail(error.localizedDescription, self.callback) }
            return
        }
        let mapPath = (outDir as NSString).appendingPathComponent("world.arworldmap")
        let result: [String: Any] = [
            "ok": true,
            "worldMapPath": FileManager.default.fileExists(atPath: mapPath) ? mapPath : "",
            "rooms": [RGRoomJSON.room(processedResult)],
        ]
        let json = (try? JSONSerialization.data(withJSONObject: result)).flatMap { String(data: $0, encoding: .utf8) } ?? "{\"ok\":false}"
        // Let the player see the finished model for a moment, then hand back to Unity.
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            self.arSession.pause()
            self.finish { RGScanReporter.send(json, self.callback) }
        }
    }

    private func finish(_ report: @escaping () -> Void) {
        if finished { return }
        finished = true
        dismiss(animated: true, completion: report)
    }

    // NSCoding is required by RoomCaptureViewDelegate; this controller is never archived.
    override func encode(with coder: NSCoder) {}
}

@available(iOS 17.0, *)
enum RGRoomJSON {
    static func matrix(_ m: simd_float4x4) -> [Float] {
        [m.columns.0.x, m.columns.0.y, m.columns.0.z, m.columns.0.w,
         m.columns.1.x, m.columns.1.y, m.columns.1.z, m.columns.1.w,
         m.columns.2.x, m.columns.2.y, m.columns.2.z, m.columns.2.w,
         m.columns.3.x, m.columns.3.y, m.columns.3.z, m.columns.3.w]
    }

    static func surface(_ s: CapturedRoom.Surface) -> [String: Any] {
        var out: [String: Any] = [
            "t": matrix(s.transform),
            "dim": [s.dimensions.x, s.dimensions.y, s.dimensions.z],
        ]
        if !s.polygonCorners.isEmpty {
            // Corners are in the surface's local frame; store them in world space.
            out["corners"] = s.polygonCorners.map { c -> [Float] in
                let w = s.transform * simd_float4(c.x, c.y, c.z, 1)
                return [w.x, w.y, w.z]
            }
        }
        return out
    }

    static func room(_ r: CapturedRoom) -> [String: Any] {
        [
            "sections": r.sections.map { String(describing: $0.label) },
            "floors": r.floors.map(surface),
            "walls": r.walls.map(surface),
            "doors": r.doors.map(surface),
            "openings": r.openings.map(surface),
            "windows": r.windows.map(surface),
            "objects": r.objects.map { o -> [String: Any] in
                ["category": String(describing: o.category), "t": matrix(o.transform),
                 "dim": [o.dimensions.x, o.dimensions.y, o.dimensions.z]]
            },
        ]
    }
}
