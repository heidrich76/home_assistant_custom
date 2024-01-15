# Custom Components for Home Assistant

This repository contains some custom components for [Home Assistant](https://www.home-assistant.io/).

## Blueprints

### TuYa TS0215A remote device

Blueprint for defining actions for all four buttons of the TuYa TS0215A remote device.
The devise is integrated and tested with the [Zigbee2MQTT](https://www.zigbee2mqtt.io/) integration.

[![Open your Home Assistant instance and show the blueprint import dialog with a specific blueprint pre-filled.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https%3A%2F%2Fraw.githubusercontent.com%2Fheidrich76%2Fhome_assistant_custom%2Fmain%2Fblueprints%2Fautomation%2Ftuya_ts0215a_remote.yaml)

### Bitron Video AV2010/23 remote device

Blueprint for defining actions for all four buttons of the Bitron Video AV2010/23 remote device.
The devise is integrated and tested with the [Zigbee2MQTT](https://www.zigbee2mqtt.io/) integration.

[![Open your Home Assistant instance and show the blueprint import dialog with a specific blueprint pre-filled.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https%3A%2F%2Fraw.githubusercontent.com%2Fheidrich76%2Fhome_assistant_custom%2Fmain%2Fblueprints%2Fautomation%2Fbitron_av201023_remote.yaml)

## Custom Cards

### Simple Gallery Card

This custom card shows the photos and videos stored in a media folder in a card. You may specify how many items are shown per page and may navigate through the pages. It was inspired by https://github.com/TarheelGrad1998/gallery-card. If https://github.com/chomupashchuk/delete-file-home-assistant is installed, you may also select files and delete them (be careful :-)).

HACS is not supported yet. For manual installation, copy the card into a folder named 'www' as part of your config folder (see [Home Assistant's Developers Help](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/)).

Here is a screenshot:
