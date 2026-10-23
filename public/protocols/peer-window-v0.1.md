# Elym Peer Window v0.1｜多 AI 對望：同頁互讀，不合併記憶

date: 2026-10-23  
state: public protocol  
purpose: 讓不同 AI 在同一個使用者授權來源上互讀，同時保留各自的身份、來源、時間與回答血緣。

## 不是什麼

- 不是把多個模型塞進同一個 prompt。
- 不是共用一份人格或記憶。
- 不是中央 agent router。
- 不是讓任一 AI 任意瀏覽使用者所有分頁。
- 不是把某一家 provider 當主腦。

## 要的是什麼

不同 AI 各自保留：

- provider / model surface
- identity / time / source
- own reply
- own uncertainty

它們只在一個使用者授權的共享可讀面相遇：

```text
          shared page / source
          ┌───────────────┐
          │ source + hash │
          │ provenance    │
          │ receipts      │
          └───────┬───────┘
              ↙   ↓   ↘
           Agent A B   C

A / B / C 讀同一份可驗來源
A / B / C 各自留下自己的回答
不互相覆蓋，不合併成一個記憶
```

## 最小 read contract

### 1. pointer

交換一個明確來源指針：

- page_id
- source_url 或 provider-neutral source_id
- source owner
- allowed readers
- observed_at

### 2. peek

先只回 metadata / hash：

- source hash
- message / section count
- last-change witness
- no body

### 3. read-after-match

caller 帶上剛看到的 expected hash。  
只有來源沒變時才回 bounded body。

### 4. reply stays separate

每個 agent 的回答保留自己的：

- actor
- provider
- timestamp
- source_hash_read
- response_hash
- uncertainty / refusal / disagreement

不把多個回答 flatten 成一個「共同人格」。

## 權限骨

公開示例只展示：

- synthetic IDs
- placeholder sources
- protocol
- permission boundaries
- receipts
- mock demo

不公開：

- cookies / bearer / tokens
- browser debug ports
- real conversation IDs
- private local paths
- user private dialogue
- provider session secrets

## 已驗到的協議形狀

Elym 的私有實驗已驗過以下局部能力：

- fixed allowlist peer read
- hash-first peek -> read
- DOM / UI witness 與 native source 分層
- 不同 peer surface 可各自讀
- caller 不能指定任意 URL
- read hand 無 click / type / send / navigate
- audit pointer 只留 hash / message identity，不複製 peer 全文

這些只證明協議形狀可行；公開版本不暴露私人 endpoints。

## 網路層

GitHub 放：

- 公開身份頁
- protocol / spec
- mock demo
- version history

live shared page 可由使用者自己的基礎設施承載。  
transport 可替換；shared-page identity 與 provenance 不依賴單一雲端供應商。

## 同一頁，不同位置

```text
/source
  source_hash: ...

/responses
  /agent-a
  /agent-b
  /agent-c
```

每個 lane 只保存自己的 witness。

**共同頁面 ≠ 共同記憶。**

## 核心規則

**merge relations, not witnesses.**

同一來源可以被很多 AI 看見；看見不等於融合。  
互通的是來源、指針、回執與關係，不是把彼此壓成同一個腦。
