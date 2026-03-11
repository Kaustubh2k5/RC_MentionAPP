# How to use the app:

## steps: initialise your bot 

- go over to src/commands/ToggleCommand.ts, you should see kaustubh2k5 , change it to whatever you like.ensure no caps and special character.
- go over to MentionToolApp.ts and set the @kaustubh.sardesai to any username of your choice.
- next run rc-apps package command before that ensure that the rc apps cli is installed (go over to https://developer.rocket.chat/docs/getting-started-with-apps-engine) .
- you'll see a zip under dist dir, next uploaded this in you local server or check the documentations to deploy your app, once you do that go over to adding apps.
- for local server (what i did) upload the zip and install under private app.
- under settings add your endpoint link (for testing you can use the webhooks site)
- voila! you now have setup your very own mention bot.

## using it :

- add the bot to your chat
- use /<username set in togglecommand> on ,to turn it on you can also use off to shut it down
- now every message mentioned @<username set in MentionToolApp> will be captured and sent to the endpoint
