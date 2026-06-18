# Ask First

⚠️ Stop and confirm with the user before taking any of these actions.
Do not proceed on your own judgement — risk of silent, hard-to-reverse mistakes
is too high.

## Dependencies

- ⚠️ Add any new dependency (package, library, or plugin)
- ⚠️ Upgrade an existing dependency version

## Architecture & structure

- ⚠️ Introduce a new architectural layer or abstraction not currently in the project
- ⚠️ Rename a public API method, class, or module (breaking change)
- ⚠️ Move a file or module to a different directory or package

## CI / deployment

- ⚠️ Modify Vercel configuration (`vercel.json`)
- ⚠️ Modify any production or staging environment configuration

## Vue 3

- ⚠️ Change a component's props interface (may break parent consumers)
- ⚠️ Modify `vite.config.js` or build configuration
- ⚠️ Change the Vue Router route structure or guard logic
- ⚠️ Add or change a global plugin or directive registration
