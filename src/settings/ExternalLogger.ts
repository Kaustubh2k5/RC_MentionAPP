import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export const ExternalLoggerSetting: ISetting = {
    id: 'external_logger',
    type: SettingType.STRING,
    packageValue: '',
    required: false,
    public: true,
    i18nLabel: 'External Logger',
    i18nDescription: 'External REST API logger URL'
};