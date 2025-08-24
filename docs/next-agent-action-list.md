# Next Agent Action List - Cache Behavior Analysis

## Status & Context

**✅ COMPLETED**: Network Latency Analysis (Phase 1)  
**🎯 CURRENT FOCUS**: Cache Behavior Analysis (Phase 2)  
**📅 Date**: August 24, 2025  

### Key Finding from Phase 1
**Network latency is NOT the bottleneck** - 203-492ms response times are excellent. Investigation must focus on **cache behavior** as the most likely source of sync delays.

---

## Immediate Priority Actions

### 1. Cache Header Analysis Implementation (HIGH PRIORITY)
**Estimated Time**: 2-3 hours  
**Expected Impact**: HIGH - Most likely source of delays

#### A. Modify Notion Client for Header Capture
**File**: `convex/lib/notionClient.ts`  
**Action**: Replace Notion SDK calls with direct fetch() to capture cache headers

```typescript
// IMPLEMENT: Replace this section around line 48-62
async fetchDatabaseChanges(databaseId: string, lastSync?: number) {
  // Use fetch instead of Notion client for header access
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.apiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filter: lastSync ? {
        timestamp: "last_edited_time",
        last_edited_time: { after: new Date(lastSync).toISOString() }
      } : undefined,
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }]
    })
  });
  
  // Log cache-related headers
  console.log(`🗂️ CACHE HEADERS:`);
  console.log(`   Cache-Control: ${response.headers.get('cache-control') || 'none'}`);
  console.log(`   ETag: ${response.headers.get('etag') || 'none'}`);
  console.log(`   Last-Modified: ${response.headers.get('last-modified') || 'none'}`);
  console.log(`   Age: ${response.headers.get('age') || 'none'}`);
  console.log(`   X-Cache: ${response.headers.get('x-cache') || 'none'}`);
  
  const data = await response.json();
  return this.processResponse(data);
}
```

#### B. Create Cache Invalidation Testing
**File**: `convex/testing/cacheInvalidation.ts` (NEW FILE)

```typescript
import { action } from "../_generated/server";
import { v } from "convex/values";
import { NotionSyncClient } from "../lib/notionClient";

export const testCacheInvalidation = action({
  args: { testRecordId: v.string() },
  handler: async (ctx, { testRecordId }) => {
    // Test immediate fetch vs cache-busted fetch
    // Implementation details in original plan
  }
});
```

### 2. Cache Performance Profiling (HIGH PRIORITY)
**Estimated Time**: 1-2 hours

#### A. Multiple Request Pattern Analysis
**Goal**: Detect cache hit/miss patterns

```typescript
// Add to networkLatency.ts or create new cachePatterns.ts
export const testCachePatterns = action({
  // Test rapid consecutive requests
  // Test requests with different intervals
  // Measure response time variations indicating cache hits/misses
});
```

#### B. Geographic Cache Testing
- Test from different regions if possible
- Compare cache behavior patterns
- Document regional variations

---

## Secondary Priority Actions

### 3. Application Cache Review (MEDIUM PRIORITY)
**Estimated Time**: 2-3 hours  
**Expected Impact**: MEDIUM

#### A. Convex Database Cache Logic Review
**Files to analyze**:
- `convex/notion/sync.ts:97-127` - `batchUpsertRecords` function
- `convex/notion/sync.ts:130-158` - `updateSyncMeta` function
- `convex/notion/sync.ts:12-70` - `syncNotionDatabase` function

#### B. Specific Areas to Investigate:
```typescript
// Check timestamp precision in batchUpsertRecords
if (record.lastModified > existing.lastModified) {
  await ctx.db.patch(existing._id, recordData);
}
// Question: Could timestamp precision cause stale data issues?

// Check sync metadata timing
lastSyncTime: args.lastSyncTime,
// Question: Are we using the correct timestamp reference?

// Check incremental sync logic
const changes = await client.fetchDatabaseChanges(databaseId, undefined);
// Question: Should we re-enable incremental sync with lastSync parameter?
```

### 4. Rate Limiting Detection (LOW PRIORITY)
**Estimated Time**: 1-2 hours  
**Expected Impact**: LOW (no evidence found in Phase 1)

#### A. Create Rate Limiting Test
**File**: `convex/testing/rateLimiting.ts` (NEW FILE)
- Test rapid request sequences
- Monitor for 429 responses
- Document rate limit thresholds

---

## Testing Infrastructure Available

### Existing Testing Functions
✅ **Network Latency**: `convex/testing/networkLatency.ts`  
✅ **Time Gate Analysis**: `convex/testing/notionTimeGate.ts`  
✅ **Production Sync**: `convex/timeline.ts:triggerNotionSync`

### Test Database Information
- **Database ID**: `2584f2e11dba819eb0f5fc54bff7b13f`
- **Test Record**: "Setup: Project Foundation & Legal Research"
- **Test Field**: Assignee (`t[K\`)
- **Record Count**: 16 records (~15.47KB response)

### Quick Test Commands
```bash
# Test network latency (established baseline)
npx convex run testing/networkLatency:testNetworkLatency '{"iterations": 5}'

# Test cache invalidation (TO IMPLEMENT)
npx convex run testing/cacheInvalidation:testCacheInvalidation '{"testRecordId": "..."}'

# Production sync with cache header logging  
npx convex run timeline:triggerNotionSync
```

---

## Expected Outcomes & Success Metrics

### Cache Behavior Analysis Success
- **✅ Cache header documentation** (Cache-Control, ETag, Age values)
- **✅ Cache invalidation timing** (how long until changes appear)
- **✅ Cache hit/miss patterns** identified  
- **✅ Geographic cache behavior** documented

### Key Questions to Answer
1. **What cache headers does Notion API return?**
2. **How long are responses cached?**  
3. **What triggers cache invalidation?**
4. **Are there cache-busting strategies that work?**

### Application Cache Success  
- **✅ Timestamp handling validated** (no precision issues)
- **✅ Sync metadata accuracy confirmed**
- **✅ Local cache logic verified** (no stale data retention)

### Failure Indicators
- **❌ Cannot capture cache headers** (API restrictions)
- **❌ Cache behavior is inconsistent** (non-deterministic)
- **❌ No cache-related delays detected** (need to investigate further)

---

## Development Environment Setup

### Quick Start Commands
```bash
# Start development environment
npm run dev          # Frontend (localhost:5174)  
npx convex dev       # Backend functions

# Run comprehensive validation
npm run lint         # Type checking + build validation
```

### Environment Variables Required
```bash
# Should already be configured
NOTION_API_KEY=secret_...
CONVEX_DEPLOYMENT=...
```

---

## Files to Create/Modify

### New Files to Create
- `convex/testing/cacheInvalidation.ts` - Cache invalidation testing
- `convex/testing/cachePatterns.ts` - Cache pattern analysis  
- `convex/testing/rateLimiting.ts` - Rate limiting detection
- `docs/cache-behavior-analysis.md` - Documentation for Phase 2

### Files to Modify  
- `convex/lib/notionClient.ts` - Add cache header capture
- `convex/notion/sync.ts` - Review and validate cache logic (no changes expected)

### Files to Review (No Changes)
- `convex/timeline.ts` - Production sync functions
- `convex/schema.ts` - Database schema
- Application sync metadata logic

---

## Context for Next Agent

### What Has Been Accomplished
- ✅ Network latency analysis complete (203-492ms excellent performance)
- ✅ Network timing instrumentation in production
- ✅ Comprehensive testing infrastructure established  
- ✅ Time-gate hypothesis previously disproved
- ✅ Full documentation of Phase 1 results

### What Remains Unknown  
- ❓ Notion API cache behavior and headers
- ❓ Cache invalidation timing patterns
- ❓ Geographic/CDN cache variations
- ❓ Application-level cache issues (unlikely but unvalidated)

### Investigation Confidence Levels
- **Network Latency**: ✅ HIGH CONFIDENCE - Not the bottleneck
- **Time-Gate Mechanism**: ✅ HIGH CONFIDENCE - Disproved  
- **Cache Behavior**: ❓ UNKNOWN - Most likely source of delays
- **Application Logic**: 🟡 LOW RISK - Needs validation but likely fine

### Recommended Timeline
- **Week 1 Days 1-2**: Cache header analysis implementation
- **Week 1 Days 3-4**: Cache invalidation testing and patterns
- **Week 1 Day 5**: Application cache review + rate limiting tests
- **Week 2**: Solution implementation based on findings

---

## Emergency Contacts & Resources

### Documentation References
- **Network Analysis**: `docs/network-latency-analysis.md`
- **Original Investigation Plan**: `TASK-NOTION-TIMEGATE-TESTING.md`  
- **Codebase Overview**: `CLAUDE.md`

### Test Database Access
- **URL**: Check Notion workspace for "Access Alberta Legal - 4 Month Development Timeline"
- **Make test changes**: Modify Assignee field on test record
- **Timing**: Changes should appear within 30 seconds if no cache delays

### Troubleshooting
- **Convex functions not updating**: Run `npx convex dev --once`
- **Type errors**: Run `npm run lint` for full validation
- **Network timing not appearing**: Check Convex dashboard logs
- **Cache headers empty**: Verify fetch() implementation replaces Notion SDK calls

---

## Success Criteria for Phase 2

**Phase 2 Complete When**:
1. Cache headers fully documented and analyzed  
2. Cache invalidation timing patterns established
3. Application cache logic validated (no issues found)
4. Rate limiting behavior documented
5. Next phase determined (likely solution implementation)

**Expected Outcome**: Identification of cache-related delays as primary sync bottleneck, leading to cache-busting or timing adjustment solutions.

---

**The next agent should begin immediately with cache header analysis implementation as the highest priority task.**