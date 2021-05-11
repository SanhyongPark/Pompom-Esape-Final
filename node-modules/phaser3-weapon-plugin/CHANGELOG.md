# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2021-01-24

### Changed in 2.1.0

- Improved instructions in README.
- Added a `module` entrypoint in package.json, pointing to what was formerly
the `main` entrypoint.
- The `main` entrypoint no longer points to a module, but the normal bundle.
- Updated dependencies, which made the bundle a bit smaller.

### Fixed in 2.1.0

- The main entrypoint no longer uses ESNext syntax.

## [2.0.1] - 2020-04-16

### Changed in 2.0.1

- The package.json now specifies that the package type is "module",
for theoretically better future support.
- validateConfig now imports Weapon as a type import, since it only
ever uses it as a type
- Moved core-js to devDependencies, as it's only used at build time.
Having it as a dependency causes it to be installed by npm when consuming
the package, and if you pipe the plugin's source files through babel with
`useBuiltins` enabled, it would resolve `core-js` separately from your own
code, causing it to be bundled twice.

### Fixed in 2.0.1

- Firing bullets when tracking a sprite with rotation set to 0.
Due to an oversight the plugin checked for falsy values to
check for the existence of `rotation`, rather than checking if it was a number.

## [2.0.0] - 2020-04-15

### Added in 2.0.0

- Config checks for `trackRotation` and `bulletInheritSpriteSpeed`
when following a Sprite without a body or a custom object.
- Added other build targets, including a legacy build transpiled
to ES5 and a modern build supporting the last 2 versions of the major browsers.
The default build targets browsers supporting ES modules,
and can be used together with the legacy build if you want to utilize the
[module/nomodule pattern](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/).
- JavaScript source files (compiled from TypeScript) are available in `out/`
after build. Use these if you prefer to consume the plugin's source files
directly (through a bundler), but prefer to not set up TypeScript compilation yourself.
- Proper docs generated by TypeDoc.

### Changed in 2.0.0

- Ported plugin to TypeScript
- Changed exports, the plugin object is now accessible as a named export,
or as `WeaponPlugin.WeaponPlugin` as a browser global.
- The built files now include the necessary polyfills (based on target browsers).
- Constants previously available at `consts` have been split ut into
`consts.KillType`, `consts.Angle` and `consts.FrameType`.
They're also available as named exports from `consts.js`.
- `weapon.fire()` and similar functions return undefined when no bullet is fired.
- Weapon now extends EventEmitter directly. Event listeners are now added
by using `weapon.on` instead of `weapon.eventEmitter.on`.
- Events are available as constants from the `events` export,
similar to how Phaser has done it for a while. You can optionally use these
when adding event listener, so `weapon.on('fire', eventHandler)` becomes
`weapon.on(events.WEAPON_FIRE, eventHandler)`.

### Fixed in 2.0.0

- Fixed several bugs and edge cases, helped by TypeScript
- `weapon.forEach` now properly only passes the bullet and any custom args
to the callback function.
- Fixed many minor errors in the documentation comments.

### Removed in 2.0.0

- Prebuilt files from git. Get them from npm or the releases page,
or build them yourself.

## [1.0.2] - 2019-10-05

### Fixed in 1.0.2

- Fixed possible outdated builds

## [1.0.1] - 2019-10-05

### Added in 1.0.1

- Added a changelog

### Fixed in 1.0.1

- Fix incorrect usage of eventEmitter (#16, thanks @milk-shake)

## [1.0.0] - 2019-04-15

### Added in 1.0.0

- Added weapon config check that can warns you of potentially
invalid configuration.
- Added example tho show the trackPointer functionality.

### Changed in 1.0.0

- Added more comments to make the code easier to understand.
- Register the Weapon with the game object factory/creator.
Now you can use `this.add.weapon`.

### Fixed in 1.0.0

- Fixed several bugs, like incorrect usage of Rectangle.CenterOn.

[Unreleased]: https://github.com/16patsle/phaser3-weapon-plugin/compare/v2.1.0...HEAD
[2.0.1]: https://github.com/16patsle/phaser3-weapon-plugin/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/16patsle/phaser3-weapon-plugin/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/16patsle/phaser3-weapon-plugin/compare/v1.0.2...v2.0.0
[1.0.2]: https://github.com/16patsle/phaser3-weapon-plugin/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/16patsle/phaser3-weapon-plugin/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/16patsle/phaser3-weapon-plugin/compare/v1.0.0-beta.1...v1.0.0