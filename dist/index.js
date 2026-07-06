"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tv_accessory_1 = require("./tv-accessory");
const PLUGIN_NAME = 'homebridge-http-tv-for-apple';
const PLATFORM_NAME = 'http-tv-for-apple';
// ── Platform ────────────────────────────────────────────────────
class HttpTvPlatform {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.accessories = [];
        this.log.info('HttpTv Platform initializing...');
        // Wait for Homebridge to finish restoring cached accessories
        // before creating new ones to avoid duplicates
        api.on('didFinishLaunching', () => {
            this.log.info('Homebridge launched, setting up TV accessory...');
            const existing = this.accessories.find((a) => a.context?.deviceType === 'http-tv-for-apple');
            if (existing) {
                this.log.info('Restoring cached TV accessory');
                (0, tv_accessory_1.configureTvAccessory)(existing, this.api.hap, this.log);
                return;
            }
            // Create a new TV accessory
            const uuid = this.api.hap.uuid.generate('http-tv-for-apple');
            const accessory = new this.api.platformAccessory('HTTP TV', uuid);
            accessory.context.deviceType = 'http-tv-for-apple';
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
    api.registerPlatform(PLATFORM_NAME, HttpTvPlatform);
};
