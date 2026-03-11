import {
    IAppAccessors,
    IConfigurationExtend,
    ILogger,
    IRead,
    IHttp,
    IModify,
    IPersistence
} from '@rocket.chat/apps-engine/definition/accessors';

import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

import {
    IMessage,
    IPostMessageSent
} from '@rocket.chat/apps-engine/definition/messages';

import { ToggleCommand } from './src/commands/ToggleCommand';
import { ExternalLoggerSetting } from './src/settings/ExternalLogger';

export class MentionToolApp extends App implements IPostMessageSent {

    public enabled: boolean = false;

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    protected async extendConfiguration(configuration: IConfigurationExtend) {

        configuration.slashCommands.provideSlashCommand(
            new ToggleCommand(this)
        );

        configuration.settings.provideSetting(
            ExternalLoggerSetting
        );
    }

    public async executePostMessageSent(
        message: IMessage,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<void> {

        if (!this.enabled) return;

        const appUser = await read.getUserReader().getAppUser();
        if (!appUser) return;

        const text = message.text || '';
        if (!text.includes(`@kaustubh.sardesai`)) return;

        const sender = message.sender;

        const setting = await read.getEnvironmentReader()
            .getSettings()
            .getValueById('external_logger');

        this.getLogger().debug(`Setting value: "${setting}"`);

        let reply = `Yo! Wassup ${sender.username} B)`;

        if (setting && typeof setting === 'string' && setting.startsWith('http')) {
            try {
                const response = await http.post(setting, {
                    headers: { 'Content-Type': 'application/json' },
                    data: {
                        userid: sender.id,
                        message: message.text
                    }
                });

                this.getLogger().debug(`HTTP status: ${response.statusCode}`);
                this.getLogger().debug(`HTTP content: ${response.content}`);

                const body = response.data || JSON.parse(response.content || '{}');
                if (body?.result) {
                    reply = `${body.result} (${body.id})`;
                }

            } catch (err) {
                this.getLogger().error(`POST failed: ${err}`);
            }
        } else {
            this.getLogger().warn(`external_logger setting is empty or invalid: "${setting}"`);
        }

        const builder = modify.getCreator()
            .startMessage()
            .setSender(appUser)
            .setRoom(message.room)
            .setText(reply);

        await modify.getNotifier().notifyUser(sender, builder.getMessage());
    }
}