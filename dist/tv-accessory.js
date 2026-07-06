"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureTvAccessory = configureTvAccessory;
const api = __importStar(require("./api"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function configureTvAccessory(accessory, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
hap, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
log) {
    const { Service, Characteristic } = hap;
    // ── Television Service ────────────────────────────────────────
    const tvService = accessory.getService(Service.Television)
        || accessory.addService(Service.Television, 'Local TV', 'tv');
    tvService.setCharacteristic(Characteristic.ConfiguredName, 'Local TV');
    tvService.setCharacteristic(Characteristic.SleepDiscoveryMode, Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE);
    // Remote key handler: map Remote App keys to TV API calls
    tvService.getCharacteristic(Characteristic.RemoteKey)
        .onSet(async (value) => {
        switch (value) {
            case Characteristic.RemoteKey.ARROW_UP:
                await api.arrowUp();
                break;
            case Characteristic.RemoteKey.ARROW_DOWN:
                await api.arrowDown();
                break;
            case Characteristic.RemoteKey.ARROW_LEFT:
                await api.arrowLeft();
                break;
            case Characteristic.RemoteKey.ARROW_RIGHT:
                await api.arrowRight();
                break;
            case Characteristic.RemoteKey.SELECT:
                await api.confirm();
                break;
            case Characteristic.RemoteKey.BACK:
                await api.goBack();
                break;
            case Characteristic.RemoteKey.INFORMATION:
                await api.information();
                break;
            case Characteristic.RemoteKey.PLAY_PAUSE:
                await api.nextTrack(); // /switch
                break;
            default:
                log.debug(`Unhandled RemoteKey: ${value}`);
        }
    });
    // Power on/off via Active characteristic
    tvService.getCharacteristic(Characteristic.Active)
        .onSet(async (value) => {
        if (value === Characteristic.Active.ACTIVE) {
            await api.powerOn();
        }
        else {
            await api.powerOff();
        }
    });
    // ── Input Source (required for TV to appear in HomeKit) ───────
    const inputSource = accessory.getService('Live TV')
        || accessory.addService(Service.InputSource, 'Live TV', 'input-1');
    inputSource.setCharacteristic(Characteristic.ConfiguredName, 'Live TV');
    inputSource.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
    inputSource.setCharacteristic(Characteristic.InputSourceType, Characteristic.InputSourceType.TUNER);
    inputSource.setCharacteristic(Characteristic.CurrentVisibilityState, Characteristic.CurrentVisibilityState.SHOWN);
    inputSource.setCharacteristic(Characteristic.TargetVisibilityState, Characteristic.TargetVisibilityState.SHOWN);
    tvService.addLinkedService(inputSource);
    // ── Television Speaker (volume control) ───────────────────────
    const speakerService = accessory.getService(Service.TelevisionSpeaker)
        || accessory.addService(Service.TelevisionSpeaker, 'TV Speaker', 'speaker');
    speakerService.setCharacteristic(Characteristic.VolumeControlType, Characteristic.VolumeControlType.RELATIVE);
    speakerService.getCharacteristic(Characteristic.VolumeSelector)
        .onSet(async (value) => {
        if (value === Characteristic.VolumeSelector.INCREMENT) {
            await api.volumeUp();
        }
        else if (value === Characteristic.VolumeSelector.DECREMENT) {
            await api.volumeDown();
        }
    });
    log.info('TV accessory configured successfully');
}
