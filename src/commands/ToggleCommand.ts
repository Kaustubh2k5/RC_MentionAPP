import {
    ISlashCommand,
    SlashCommandContext
} from '@rocket.chat/apps-engine/definition/slashcommands';

import {
    IRead,
    IModify,
    IHttp,
    IPersistence
} from '@rocket.chat/apps-engine/definition/accessors';

import { MentionToolApp } from '../../MentionToolApp';

export class ToggleCommand implements ISlashCommand {

    public command = 'kaustubh2k5';
    public i18nDescription = 'Toggle mention capture';
    public i18nParamsExample = 'on | off';
    public providesPreview = false;

    constructor(private readonly app: MentionToolApp) {}

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence
    ): Promise<void> {

        const args = context.getArguments();

        if (args[0] === 'on') {
            this.app.enabled = true;
        }

        if (args[0] === 'off') {
            this.app.enabled = false;
        }

        const builder = modify.getCreator()
            .startMessage()
            .setSender(context.getSender())
            .setRoom(context.getRoom())
            .setText(`Mention capture ${this.app.enabled ? 'enabled' : 'disabled'}`);

        await modify.getCreator().finish(builder);
    }
}