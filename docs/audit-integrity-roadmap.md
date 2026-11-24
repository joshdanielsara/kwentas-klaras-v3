# Audit integrity roadmap (Kwenta Klaras)

Future work to strengthen OpenTimestamps integrity for this **LGU project PMIS**. Aligned with CADENA *intent* (public, versioned, tamper-evident spending records) — **not** a national CADENA / multi-agency DLT build.

**Current baseline:** see [`audit-integrity-opentimestamps.md`](./audit-integrity-opentimestamps.md) (activity + project master-data seals, auto-check, what-changed diffs, public accordion).

**Constraint:** this LGU stack has **no cloud object storage** (no S3/GCS/etc.). Evidence mirrors must use **local disk, a second database/host the LGU already runs, or offline export packs** — never a cloud storage product.

---

## Honest limits (keep forever)

This system can prove **published records were not silently altered** after sealing.

It **cannot** by itself prove that original figures were truthful, legally approved, or that money was physically spent as reported. Those need documentary evidence, approval controls, and independent audit (e.g. COA).

---

## Out of scope (CADENA / national)

Do **not** build these in Kwenta Klaras:

- National portal (CADENA.ph-scale)
- Multi-agency distributed ledger / NBTAC
- Philippines-wide UACS for every national agency
- Full GAA / NEP / SARO national document set
- Switching to another paid blockchain “for credibility”

Those belong to the CADENA Act and national implementers. Prefer finishing money seals + evidence retention over new chains.

---

## What is already strong

| Layer | Status |
| --- | --- |
| Project master-data integrity (hash + snapshot + what-changed) | Done |
| Activity digests + batch membership + Merkle root | Done |
| External OTS / Bitcoin anchoring of commitments only (not municipal data on-chain) | Done |
| Citizen-facing verify (public `/` + admin Integrity tab) | Done |

Do **not** redesign this split. Strengthen gaps below.

---

## Priority order (revised after external review)

**Start next:** polish (§7). §§1–6 shipped (financial seals, archive, historical verify, actor/approvals, seal history + leaf packs, follow-the-money).

| # | Item | Priority |
| --- | --- | --- |
| 1 | Seal financial records (budget / obligation / disbursement) | **Done** |
| 2 | Independent evidence archive (Mongo / Vercel Blob / Local / R2/S3/GCS) + COA zip | **Shipped** (bucket retention policies optional) |
| 3 | Verify **all** historical batches (not only latest) | **Done** |
| 4 | Stronger actor / approval binding (+ optional signatures later) | **Done** (signatures optional later) |
| 5 | Public seal history registry + per-record inclusion proofs | **Done** |
| 6 | Follow-the-money public trail | **Done** |
| 7 | Polish (OTS upgrade, ground-truth hooks; COA pack already shipped) | Later |

---

## 1. Seal financial records — **done**

Shipped: additional budgets, obligations, and disbursements each get a SHA-256 + snapshot in `audit_integrity_batches.financial_data_hashes`, appended as Merkle leaves after project data. Silent amount/payee/status edits fail verify with **Financial records altered** + **What changed**.

Still optional later: procurement awards (if modeled), published document file hashes.

**Why it mattered:** Peso fraud often hits obligations/disbursements, not the project title.

---

## 2. Independent evidence archive — **in progress / Superadmin-configurable**

**Gap:** If activities, hashes, batches, and `.ots` proofs all live only in the same Mongo the admin controls, evidence can be deleted even though Bitcoin still has a root commitment.

**Goal:** A second copy of seal evidence that the **primary Mongo admin cannot silently erase**.

### Shipped

- Object store port (`IObjectStore`) — **Mongo second cluster** (recommended on Vercel), **Vercel Blob**, **Local disk** (on-prem only), **Cloudflare R2**, **Amazon S3**, **GCS**
- Configure in **Superadmin → Integrity archive** via **provider cards** (saved in `app_settings`; secrets masked on GET)
- Env fallbacks: `INTEGRITY_ARCHIVE_MONGODB_URI`, `BLOB_READ_WRITE_TOKEN`, `INTEGRITY_ARCHIVE_*`
- On each successful seal, write `integrity-evidence/{batchId}/manifest.json` + `proof.ots`
- **COA pack:** Admin Integrity tab download zip (README + digests CSV + manifests + `.ots`)
- Archive failures are logged; they do **not** roll back the main DB seal

### Still optional later

- Object-lock / retention policies on the bucket (configure in R2/S3/GCS console)
- Scheduled / all-projects COA export

**Why:** Bitcoin proves a root existed; archive proves *what* that root committed to.

---

## 3. Verify all historical batches — **done**

Live check now loads **every** seal batch for the project, re-checks activity digests + Merkle + OTS on each, and aggregates the result.

| Behavior | Detail |
| --- | --- |
| Latest batch | Also compares live project + financial snapshots (catches silent DB edits) |
| Older batches | Activity + Merkle + OTS only (so later legitimate edits/re-seals do not false-fail) |
| UI | Badge **All sealed history verified**; technical panel shows `N of M batches still match` |
| API | `historyScope`, `historyBatchCount`, `historyVerifiedCount`, `historyFailedCount`, `batchResults` |

Still optional later: explicit “incomplete” when leaf id lists are stored on the batch; dedicated unavailable status when OTS calendars are down across all batches.

---

## 4. Stronger actor / approval binding — **done**

| Shipped | Detail |
| --- | --- |
| Activity actor fields | `actorType`, `actorId`, `actorRoleSnapshot`, `source`, `canonVersion` (v2) on `project_activities` |
| Hash binding | New activities canonicalize with actor fields (`ACTIVITY_CANON_VERSION.V2`); legacy rows still verify as v1 |
| Timeline | Integrity timeline shows latest actor summary |
| Money approvals | `integrity_approvals` + `approvalId` on budget / obligation / disbursement; seal includes `approvalId` / `approvalStatus` / `requestId` when linked |

Still optional later: cryptographic `signature` + `signingKeyId` from the authorized approver.

**Why:** CADENA-style accountability without a national ledger — blockchain ≠ identity proof.

---

## 5. Public seal history + independent citizen verification — **done**

### Seal history registry

Integrity panel lists **every** past seal: date, Merkle fingerprint, OTS presence, verify result, latest badge (`sealHistory` on public integrity API).

### Per-record independent verify pack

`GET /api/public/projects/:id/integrity/leaves/:kind/:leafId/pack` downloads JSON:

1. Sealed snapshot  
2. Leaf SHA-256  
3. Merkle **inclusion proof**  
4. Batch Merkle root  
5. OpenTimestamps `.ots` (when present)  

UI: download from Follow-the-money steps and Seal history (project leaf).

Still optional later: atomic claim/lock hardening for dual seal workers; richer OTS status labels beyond submitted / confirmed.

---

## 6. Follow-the-money on the public page — **done**

Integrity panel trail: appropriation → additional budgets → obligations → disbursements (amounts + sealed badges). Download inclusion pack per sealed money row.

---

## 7. Polish (later)

| Item | Notes |
| --- | --- |
| Auto-upgrade OTS | Complete Bitcoin attestation; store upgraded `.ots` in DB **and** archive |
| COA / auditor offline pack | **Shipped** (Integrity tab zip) — retention policies still optional |
| Ground-truth hooks | Photos, inspection notes — optional evidence, **not** blockchain |

---

## Suggested implementation sequence

```text
1 Financial record canonicalize / hash / seal / verify + what-changed  ✅
2 Superadmin evidence archive on seal (+ COA zip)  ✅
3 Verify all historical batches  ✅
4 Actor + approval fields on sensitive money actions  ✅
5 Seal history UI + per-leaf inclusion proof download  ✅
6 Public follow-the-money trail  ✅
7 OTS upgrade + optional ground truth
```

Same-change rules when shipping each item: `__tests__` + update this doc and [`audit-integrity-opentimestamps.md`](./audit-integrity-opentimestamps.md).

---

## Capability scoreboard

| Capability | Assessment |
| --- | --- |
| Project data tampering detection | Implemented |
| Activity tampering detection | Implemented |
| External timestamping (commitments only) | Implemented |
| Financial record integrity | Implemented (budget / obligation / disbursement) |
| Historical deletion / older-batch detection | Implemented (§3 all-batch verify) |
| Independent evidence retention | Superadmin archive + COA zip (§2) |
| Verified human approvals | Actor + IntegrityApproval binding (§4); signatures later |
| Citizen independent verify pack | Leaf inclusion packs (§5) |
| Follow-the-money trail | Public Integrity panel (§6) |

---

## Relation to CADENA Act

| CADENA idea | Kwenta Klaras path |
| --- | --- |
| Tamper-resistant public records | OTS seals + public check (done) + history + archive |
| Versioned updates | App edits reseal; keep all batches |
| Trace spending | Money leaves (§1) + public trail (§6) |
| Attribution | Actor / approvals / optional signatures (§4) |
| National DLT / portal | Out of scope |

This roadmap keeps Kwenta Klaras a **municipal integrity layer**; CADENA remains the national statutory platform.
