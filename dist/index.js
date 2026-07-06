"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tv_accessory_1 = require("./tv-accessory");
const PLUGIN_NAME = 'homebridge-localtv';
const PLATFORM_NAME = 'localtv';
// ── Platform ────────────────────────────────────────────────────
class LocaltvPlatform {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.accessories = [];
        this.log.info('Localtv Platform initializing...');
        // Wait for Homebridge to finish restoring cached accessories
        // before creating new ones to avoid duplicates
        api.on('didFinishLaunching', () => {
            this.log.info('Homebridge launched, setting up TV accessory...');
            const existing = this.accessories.find((a) => a.context?.deviceType === 'localtv');
            if (existing) {
                this.log.info('Restoring cached TV accessory');
                (0, tv_accessory_1.configureTvAccessory)(existing, this.api.hap, this.log);
                return;
            }
            // Create a new TV accessory
            const uuid = this.api.hap.uuid.generate('localtv-tv');
            const accessory = new this.api.platformAccessory('Local TV', uuid);
            accessory.context.deviceType = 'localtv';
            (0, tv_accessory_1.configureTvAccessory)(accessory, this.api.hap, this.log);
            this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
            this.accessories.push(accessory);
            this.log.info('TV accessory registered successfully');
        });
    }
    configureAccessory(accessory) {
        this.log.info(`Loading cached accessory: ${accessory.displayName}`);
        this.accessories.push(accessory);
    }
}
// ── Plugin Entry ────────────────────────────────────────────────
exports.default = (api) => {
    api.registerPlatform(PLATFORM_NAME, LocaltvPlatform);
};
