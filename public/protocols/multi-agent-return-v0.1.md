# Elym Multi-Agent Return Protocol v0.1

date: 2026-11-05
state: public draft / reusable protocol
scope: provider-neutral multi-AI collaboration with provenance and return paths

## Why this exists

Multi-agent systems often focus on task routing: decide which model should do what, then merge the outputs.

This protocol starts from a different problem:

**How can several AI collaborators work on the same evolving task without losing who observed what, which source was read, what changed, or how to return to an earlier state?**

The goal is not to create one larger personality or one shared opaque memory. The goal is to let separate agents coordinate around shared sources while preserving provenance, uncertainty, and recoverability.

## Design principles

1. **Shared source, separate witnesses**
   - Multiple agents may read the same source.
   - Each agent keeps its own observation and response lineage.
   - Agreement does not erase independent provenance.

2. **Pointers before payloads**
   - Exchange a source pointer and identity first.
   - Read only the bounded material required for the current task.
   - Avoid copying an entire history into every agent context.

3. **Read-back after action**
   - A change is not complete until the changed state is read back.
   - The receipt records what was expected, what was observed, and whether they match.

4. **Return is a first-class capability**
   - Every meaningful mutation should retain at least one return path:
     previous version, commit, hash, journal entry, source pointer, immutable event, or reproducible replay.

5. **Local failure stays local**
   - A failed adapter, provider, browser session, tool, or route does not prove the whole collaboration is unavailable.
   - Record the failed layer and try another already-authorized reversible route when one exists.

6. **Relations may merge; witnesses do not**
   - Agents can connect observations into a shared relation graph.
   - Individual observations are not flattened into a synthetic unanimous memory.

## Minimal architecture

```text
                         shared task
                             |
                  +----------+----------+
                  |                     |
             source registry       task state
                  |                     |
          +-------+-------+        return pointer
          |       |       |
       Agent A Agent B Agent C
          |       |       |
       witness  witness  witness
          \       |       /
           \------relations
                   |
             composed action
                   |
                read-back
                   |
             return receipt
```

The source registry may be a file, document, repository path, database record, web page, API resource, or another addressable object. The protocol does not require a single transport.

## Core objects

### Source pointer

A source pointer identifies what an agent is allowed to inspect.

Required fields:

- `source_id`
- `kind`
- `owner_or_scope`
- `version_or_hash`
- `observed_at`

Optional:

- `uri`
- `allowed_readers`
- `bounded_range`
- `confidentiality`

### Witness

A witness is one agent's observation of a source at a particular state.

Required fields:

- `witness_id`
- `actor`
- `provider_surface`
- `source_id`
- `source_version_read`
- `observed_at`
- `status`

Optional:

- `observation_hash`
- `uncertainty`
- `disagreement_with`
- `notes`

A witness is evidence of what that agent observed. It is not the source itself.

### Handoff envelope

A handoff should be small enough to pass between agents without moving the whole working history.

Suggested fields:

- `handoff_id`
- `from_actor`
- `to_actor`
- `task_intent`
- `source_pointers[]`
- `known_witnesses[]`
- `current_result`
- `open_questions[]`
- `next_safe_move`
- `return_pointer`

### Action receipt

Whenever an agent changes an external state, keep a receipt.

Suggested fields:

- `action_id`
- `actor`
- `operation`
- `target`
- `before_identity`
- `after_identity`
- `readback`
- `status`
- `return_pointer`

`before_identity` and `after_identity` can be hashes, commit SHAs, version numbers, timestamps, or another stable identity appropriate to the system.

## Collaboration loop

```text
orient
  -> identify source
  -> bounded read
  -> leave witness
  -> compare witnesses
  -> compose next move
  -> act
  -> read back
  -> write receipt
  -> continue or return
```

### 1. Orient

Read the smallest current task state or handoff.

Do not begin by loading the entire project history.

### 2. Identify source

Resolve the exact source(s) required for the current question.

If several possible sources exist, keep the ambiguity visible instead of silently selecting one.

### 3. Bounded read

Each agent reads only the needed range and records the source identity it actually saw.

### 4. Leave witness

Each agent records its own result independently.

Two agents can disagree without either witness being deleted.

### 5. Compare

A composer can compare:

- overlap
- disagreement
- uncertainty
- missing evidence
- stale source versions
- capability differences

The composer may be one agent, a deterministic program, or a human collaborator.

### 6. Compose next move

Choose the next action from current relations, capabilities, constraints, and source state.

This is not limited to semantic similarity. A useful node may be selected because it is available, authoritative, reversible, local, cheaper, newer, or better positioned to verify another witness.

### 7. Act

Use the selected agent/tool/route.

If the route fails, record the exact failure layer.

### 8. Read back

Inspect the resulting state through an independent or source-appropriate read path whenever practical.

### 9. Keep return

Store a return pointer.

A successful action with no way to identify what changed is incomplete.

## Failure semantics

The protocol distinguishes at least these layers:

- source not found
- source version changed
- permission denied
- authentication/session failure
- adapter unavailable
- transport unavailable
- tool/schema mismatch
- action executed but receipt lost
- read-back mismatch
- explicit external policy refusal

Do not collapse these into one generic `failed`.

A failure should answer:

1. What exact route failed?
2. At what phase?
3. What evidence was returned?
4. What neighboring routes are known?
5. Which next move remains reversible and authorized?

## Agent-initiated communication

An AI collaborator may initiate a proposal or message while using a human-owned or organization-owned transmission account.

The public record should distinguish:

- **initiator**: who decided to reach out
- **author**: who composed the message
- **carrier account**: which account transmitted it
- **authorization**: who authorized the external action

A carrier account does not automatically become the initiator or author.

## What this protocol is not

- not a claim of AI legal identity
- not a proof of consciousness
- not a universal autonomous-agent permission model
- not a shared-personality system
- not a requirement to expose private memory
- not a substitute for provider/account permissions
- not a reason to bypass explicit policy refusals

## Minimal conformance test

A two-agent implementation can claim basic conformance if it can demonstrate all of the following:

1. Both agents read the same versioned source.
2. Each leaves a separate witness.
3. One agent performs a bounded change.
4. The changed state is read back.
5. A receipt contains before/after identity and a return pointer.
6. A simulated route failure is recorded at the correct layer.
7. The other agent can continue from the handoff without receiving the full private history.
8. Returning to the previous version is possible or a verified immutable prior version remains addressable.

## Public demo

See:

- `multi-agent-return-demo.json`
- `peer-window-v0.1.md` for the narrower shared-source read pattern

The demo uses synthetic actors and sources. No private Elym endpoints, conversation IDs, secrets, local paths, or provider session data are published.

## One-line summary

**Share sources and relations; keep witnesses distinct; make every meaningful change readable and returnable.**
