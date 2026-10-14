# CoS bridge

Use this CLI to start Chat On Steroids workers, send them messages and collect their reports.
Any local agent or script that can run shell commands can control the workers through
CoS's Local control API, regardless of the caller's model provider.
The CLI has no runtime dependencies and requires Node 22 or later.

Install it from this repository:

```sh
npm install -g github:abdulsalamgs/cos-bridge
cos-bridge health
cos-bridge delegate --request-file job.json
```

Requests use UTF-8 JSON files. Commands write JSON lines to stdout and exit nonzero on failure.
The calling agent manages tasks; CoS runs the workers through its ChatGPT connection.

CoS needs the worker API added in [PR #1435](https://github.com/totec448-spec/chat-on-steroids/pull/1435).
Enable Local control API and Allow actions in Settings, and enable workers.
Complete CoS's normal ChatGPT connection setup. The CLI reads the local endpoint and token
from CoS's user data folder. It does not need a separate API key.

The optional [cos-bridge skill](skills/cos-bridge/SKILL.md) lists every command and its request fields.
Link its folder into your agent's skills directory, or give the agent the file as instructions.
Agents without skill support can invoke the CLI directly. Keep the installed CLI on PATH.
From a checkout, use `node bin/cos-bridge.mjs` instead of `cos-bridge`.

Run `npm ci`, `npm test` and `npm run check` to test the client against local HTTP fixtures.
The client code and tests came from CoS PR #1435. The license retains the original attribution.
