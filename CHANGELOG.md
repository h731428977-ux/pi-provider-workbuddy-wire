# Changelog

All notable changes to this project are documented in this file.

## [0.3.1] - 2026-11-03

### Fixed

- Map Pi's `off` thinking level to WorkBuddy's measured `"none"` value for
  `deepseek-v4.1-flash` and `deepseek-v4.1-flash-sg`.
- Declare the measured image-input capability of the international
  `kimi-k3` model.

### References

- Follows the model-behavior measurements in `magpie-community/plugins`
  WorkBuddy 0.2.7 and 0.2.9, through package version 0.2.20.

## [0.3.0] - 2026-10-31

### Added

- WorkBuddy desktop-client request headers and SDK identity.
- Stable account-scoped conversation and user-turn IDs across tool loops.
- Fresh message and request IDs for each HTTP request.
- Gzip transport for Chat Completions.
- Native Anthropic Messages routing for China-region Claude models.
- Provider registration and full Pi adapter integration tests.
- Release verification and npm packaging checks.
- A committed runtime bundle so public Git installs work without a build step.

### Validated

- Type checking, tests, and production bundle generation pass.
- A real WorkBuddy account request was accepted by the backend.
- WorkBuddy usage attribution and request counting matched the expected behavior.

## [0.2.0] - 2026-10-30

This release originated from `lorlike/pi-provider-workbuddy` and included
dual-region providers, OAuth login, model catalogs, credits, daily check-in,
and DSML tool-call recovery.
