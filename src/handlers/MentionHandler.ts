import {
    IPostMessageSent,
    IMessage
} from '@rocket.chat/apps-engine/definition/messages';

import {
    IRead,
    IHttp,
    IModify,
    IPersistence
} from '@rocket.chat/apps-engine/definition/accessors';

import { MentionToolApp } from '../../MentionToolApp';

export class MentionHandler implements IPostMessageSent {

    constructor(private readonly app: MentionToolApp) {}

    public async executePostMessageSent(
        message: IMessage,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<void> {

        if (!this.app.enabled) {
            return;
        }

        const sender = message.sender;
        const appUser = await read.getUserReader().getAppUser();

        if (!appUser) {
            return;
        }

        const text = message.text || '';

        // Detect if the bot was mentioned
        if (!text.includes(`@${appUser.username}`)) {
            return;
        }

        const setting = await read.getEnvironmentReader()
            .getSettings()
            .getValueById('external_logger');

        let reply = `Yo ! Wassup ${sender.username} B)`;

        if (setting) {
            const response = await http.post(setting, {
                headers: { 'Content-Type': 'application/json' },
                data: {
                    userid: sender.id,
                    message: message.text
                }
            });

            if (response?.data) {
                reply = `${response.data.result} (${response.data.id})`;
            }
        }

        const builder = modify.getCreator()
            .startMessage()
            .setSender(appUser)
            .setRoom(message.room)
            .setText(reply);

        await modify.getNotifier().notifyUser(sender, builder.getMessage());
    }
}