---
name: cos-bridge
description: Orchestrate Chat On Steroids broker workers directly from T3 Code or another local agent; delegate, message, collect reports and check progress.
---

Run the installed CLI with Node 22 or later:

`cos-bridge <command> [--request-file request.json] [--data-dir <CoS userData>]`

From this package's checkout, use `node bin/cos-bridge.mjs` instead of `cos-bridge`.

Use UTF-8 JSON requests. CoS needs Local control API, Allow actions, workers and its normal
ChatGPT connection enabled. Direct control requires the advertised v1 worker routes; an
older build returns `worker_broker_unavailable`. Output is JSON lines; failures exit nonzero.

| Command | Request fields. `?` means optional. |
| --- | --- |
| `health`, `status` | None; capabilities or runtime state. |
| `delegate` | `ownerId, workers:[{label?,task}], context?, projectId?, runId?`. |
| `message` | `ownerId, messages:[{to,text,label?}], runId?`; reuse sleeping workers. |
| `agents`, `reports` | `ownerId, runId?`; compact worker state or unread reports. |
| `ack` | `ownerId, messageIds:[...], runId?`; acknowledge consumed report ids. |
| `sessions` | `limit?`, from 1 to 50, default 20. `cursor?`. |
| `session` | `sessionId`; live state. |
| `updates` | `sessionId`, `from?`, default 0. `durationMs?`, from 1 to 45000, default 30000. `limit?`, from 1 to 100, default 100. |
| `send` | `id, text, sessionId?, projectId?, interrupt?`; ordinary ChatGPT chats. |
| `inputs` | `id?`; prefer an exact ordinary message's delivery receipt. |

Persist one lowercase UUID `ownerId` per T3 task and retain returned run/worker ids; worker
names are scoped to their run. T3 is the orchestrator; workers report through CoS. Use saved
worker model and effort defaults. Tasks, context and messages allow up to 4,000 characters.
Spawn 1 to 8 workers at once, or send 1 to 16 messages per batch. Give workers the repo,
scope and validation in context. Select a
known `projectId` for CoS workspace/worktree policy. Check actual reports before completion.

Read `reports`, save results, then `ack` their exact ids. Reports repeat until acknowledged.
After an uncertain worker mutation, inspect `agents` and `reports` before retrying. Save
`updates.nextFrom` and use a small limit for new progress; upsert revisions by message id.
An end frame closes the read. Check reports for task completion. For ordinary `send`, persist a new UUID first;
inspect `inputs` after failures and never resend unconfirmed delivery. `interrupt:true`
requires consent to stop the current answer.
