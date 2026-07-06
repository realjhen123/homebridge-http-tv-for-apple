import type { PlatformAccessory, CharacteristicValue } from 'homebridge';
import * as api from './api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function configureTvAccessory(
  accessory: PlatformAccessory,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hap: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: any,
): void {
  const { Service, Characteristic } = hap;

  // ── Television Service ────────────────────────────────────────
  const tvService = accessory.getService(Service.Television)
    || accessory.addService(Service.Television, 'Local TV', 'tv');

  tvService.setCharacteristic(Characteristic.ConfiguredName, 'Local TV');
  tvService.setCharacteristic(
    Characteristic.SleepDiscoveryMode,
    Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE,
  );

  // Remote key handler: map Remote App keys to TV API calls
  tvService.getCharacteristic(Characteristic.RemoteKey)
    .onSet(async (value: CharacteristicValue) => {
      switch (value as number) {
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
    .onSet(async (value: CharacteristicValue) => {
      if (value === Characteristic.Active.ACTIVE) {
        await api.powerOn();
      } else {
        await api.powerOff();
      }
    });

  // ── Input Source (required for TV to appear in HomeKit) ───────
  const inputSource = accessory.getService('Live TV')
    || accessory.addService(Service.InputSource, 'Live TV', 'input-1');

  inputSource.setCharacteristic(Characteristic.ConfiguredName, 'Live TV');
  inputSource.setCharacteristic(
    Characteristic.IsConfigured,
    Characteristic.IsConfigured.CONFIGURED,
  );
  inputSource.setCharacteristic(
    Characteristic.InputSourceType,
    Characteristic.InputSourceType.TUNER,
  );
  inputSource.setCharacteristic(
    Characteristic.CurrentVisibilityState,
    Characteristic.CurrentVisibilityState.SHOWN,
  );
  inputSource.setCharacteristic(
    Characteristic.TargetVisibilityState,
    Characteristic.TargetVisibilityState.SHOWN,
  );

  tvService.addLinkedService(inputSource);

  // ── Television Speaker (volume control) ───────────────────────
  const speakerService = accessory.getService(Service.TelevisionSpeaker)
    || accessory.addService(Service.TelevisionSpeaker, 'TV Speaker', 'speaker');

  speakerService.setCharacteristic(
    Characteristic.VolumeControlType,
    Characteristic.VolumeControlType.RELATIVE,
  );

  speakerService.getCharacteristic(Characteristic.VolumeSelector)
    .onSet(async (value: CharacteristicValue) => {
      if (value === Characteristic.VolumeSelector.INCREMENT) {
        await api.volumeUp();
      } else if (value === Characteristic.VolumeSelector.DECREMENT) {
        await api.volumeDown();
      }
    });

  log.info('TV accessory configured successfully');
}
