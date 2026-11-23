# Audit integrity roadmap (Kwenta Klaras)

Future work to strengthen OpenTimestamps integrity for this **LGU project PMIS**. Aligned with CADENA *intent* (public, versioned, tamper-evident spending records) — **not** a national CADENA / multi-agency DLT build.

**Current baseline:** see [`audit-integrity-opentimestamps.md`](./audit-integrity-opentimestamps.md) (activity + project master-data seals, auto-check, what-changed diffs, public accordion).

---

## Out of scope (CADENA / national)

Do **not** build these in Kwenta Klaras:

- National portal (CADENA.ph-scale)
- Multi-agency distributed ledger / NBTAC
- Philippines-wide UACS for every national agency
- Full GAA / NEP / SARO national document set

Those belong to the CADENA Act and national implementers.

---

## Priority order

**Start next:** (1) seal history + (2) money-doc seals — biggest integrity win for this app.

| # | Item | Why |
| --- | --- | --- |
| 1 | Seal history citizens can trust | Stops “tamper DB + reseal clean” from looking honest |
| 2 | Seal money docs, not just project header | Matches how pesos are altered, not just the project name |
| 3 | Who did the official change | CADENA-style accountability without a national ledger |
| 4 | Follow-the-money on the public page | Closest useful “trace the peso” for one LGU project |
| 5 | Harder to rewrite the seal store | Integrity only works if old proofs survive outside one Mongo DB |
| 6 | Polish (later) | Attestation upgrade, auditor pack, ground-truth hooks |

---

## 1. Seal history citizens can trust

**Goal:** Public list of **every past seal** per project — never “replace and forget.”

| Surface | Content |
| --- | --- |
| Live check | Still uses **latest** seal (current fingerprint vs current data) |
| History (auditors / public) | Date, fingerprint (Merkle root), `.ots` download, status (pending / confirmed / superseded) |

**Notes:**

- Keep all `audit_integrity_batches` rows linked to the project; do not delete on reseal
- UI: expandable “Seal history” under Integrity (admin + optional public)
- API: e.g. `GET /api/public/projects/:id/integrity/history`

**Why:** An adversary who edits Mongo and reseals can look clean if only the latest seal is visible. History makes that rewrite detectable against older proofs.

---

## 2. Seal money docs, not just project header

**Goal:** Separate digests for **budget / obligation / disbursement** (and documents if easy).

| Leaf type | Canonicalize | When |
| --- | --- | --- |
| Project master (done) | name, appropriation, codes, dates, … | On activity seal batches |
| Additional budget rows | amount, reason, dates, projectId, … | Create / update paths that log activity |
| Obligations | amount, payee, dates, … | Same |
| Disbursements | amount, reference, dates, … | Same |
| Documents (optional) | file hash / metadata | On upload |

**Notes:**

- Extend batch leaf set (or per-type maps like `projectDataHashes`) with snapshots for “What changed”
- Verify current money rows against sealed digests for that project’s latest (and history) batches

**Why:** Fraud often hits peso lines, not only the project title.

---

## 3. Who did the official change

**Goal:** Bind each sealed activity to **user + role** (later optional digital signature).

| Phase | Work |
| --- | --- |
| Now-ish | Ensure activity canonical hash includes stable `userId` / role snapshot at write time; show actor on Integrity timeline |
| Later | Optional official digital signature over the activity digest or seal root |

**Why:** CADENA-style attribution without a national ledger — “who recorded this” is visible and sealed.

---

## 4. Follow-the-money on the public page

**Goal:** Simple trail under Integrity / project view:

`appropriation → obligations → disbursements` (amounts + dates).

**Notes:**

- Read-only summary for constituents (no PII beyond what is already public)
- Link each step to sealed status when (2) exists
- Keep language short (same audience as easy Integrity copy)

**Why:** Closest useful CADENA “trace the peso” story for a single LGU project.

---

## 5. Harder to rewrite the seal store

**Goal:** Old proofs survive **outside** one Mongo DB.

| Option | Idea |
| --- | --- |
| A | Read-only public JSON export of seals per project / batch |
| B | Periodic push / mirror to a second host (object storage, static site, partner LGU mirror) |
| C | Documented manual auditor export (COA pack — see polish) |

**Why:** Tamper-evidence needs a reference the DB admin cannot silently rewrite.

---

## 6. Polish (later)

| Item | Notes |
| --- | --- |
| Auto-upgrade OTS | Complete Bitcoin attestation when calendars confirm; store upgraded `.ots` |
| COA / auditor pack | Zip: seals, snapshots, activity digests, verify instructions |
| Ground-truth hooks | Photos, inspection notes — optional evidence, **not** blockchain |

---

## Suggested implementation sequence

```text
1 Seal history API + UI
2 Money-doc canonicalize / hash / seal / verify + what-changed
3 Actor (user + role) on sealed activities
4 Public follow-the-money trail
5 Seal mirror / export
6 OTS upgrade + auditor pack (+ optional ground truth)
```

Same-change rules when shipping each item: `__tests__` + update this doc and [`audit-integrity-opentimestamps.md`](./audit-integrity-opentimestamps.md).

---

## Relation to CADENA Act

| CADENA idea | Kwenta Klaras path |
| --- | --- |
| Tamper-resistant public records | OTS seals + public check (done) + history (1) + mirror (5) |
| Versioned updates | App edits reseal; keep history (1) |
| Trace spending | Money leaves (2) + public trail (4) |
| Attribution | User + role on seals (3) |
| National DLT / portal | Out of scope |

This roadmap keeps Kwenta Klaras a **municipal integrity layer**; CADENA remains the national statutory platform.
