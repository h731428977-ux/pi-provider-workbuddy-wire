# Changelog

All notable changes to this project are documented in this file.

## [0.3.0] - 2026-10-31

### Added

- WorkBuddy desktop-client request headers and SDK identity.
- Stable account-scoped conversation and user-turn IDs across tool loops.
- Fresh message and request IDs for each HTTP request.
- Gzip transport for Chat Completions.
- Native Anthropic Messages routing for China-region Claude models.
- Provider registration and full Pi adapter integration tests.
- Release verification and npm packaging checks.
- A committed runtime bundle so private Git installs work without a build step.

### Validated

- Type checking, tests, and production bundle generation pass.
- A real WorkBuddy account request was accepted by the backend.
- WorkBuddy usage attribution and request counting matched the expected behavior.

## [0.2.0] - 2026-10-30

This release originated from `lorlike/pi-provider-workbuddy` and included
dual-region providers, OAuth login, model catalogs, credits, daily check-in,
and DSML tool-call recovery.
