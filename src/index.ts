import type { API, PlatformConfig, Logging, PlatformAccessory } from 'homebridge';
import { configureTvAccessory } from './tv-accessory';

const PLUGIN_NAME = 'homebridge-http-tv-for-apple';
const PLATFORM_NAME = 'http-tv-for-apple';

// ── Platform ────────────────────────────────────────────────────
class HttpTvPlatform {
  private readonly accessories: PlatformAccessory[] = [];

  constructor(
    private readonly log: Logging,
    private readonly config: PlatformConfig,
    private readonly api: API,
  ) {
    this.log.info('HttpTv Platform initializing...');

    // Wait for Homebridge to finish restoring cached accessories
    // before creating new ones to avoid duplicates
    api.on('didFinishLaunching', () => {
      this.log.info('Homebridge launched, setting up TV accessory...');

      const existing = this.accessories.find(
        (a) => a.context?.deviceType === 'http-tv-for-apple',
      );

      if (existing) {
        this.log.info('Restoring cached TV accessory');
        configureTvAccessory(existing, this.api.hap, this.log);
        return;
      }

      // Create a new TV accessory
      const uuid = this.api.hap.uuid.generate('http-tv-for-apple');
      const accessory = new this.api.platformAccessory('HTTP TV', uuid);
      accessory.context.deviceType = 'http-tv-for-apple';

      configureTvAccessory(accessory, this.api.hap, this.log);

      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      this.accessories.push(accessory);

      this.log.info('TV accessory registered successfully');
    });
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info(`Loading cached accessory: ${accessory.displayName}`);
    this.accessories.push(accessory);
  }
}

// ── Plugin Entry ────────────────────────────────────────────────
export default (api: API) => {
  api.registerPlatform(PLATFORM_NAME, HttpTvPlatform);
};
