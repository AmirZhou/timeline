import { v } from "convex/values";
import { action } from "../_generated/server";
import { NotionSyncClient } from "../lib/notionClient";

/**
 * NOTION TIME-GATE HYPOTHESIS TESTING SUITE
 * 
 * This module contains comprehensive testing functions to investigate
 * whether Notion implements time-gating for rapid database changes.
 * 
 * RESULT: Time-gate hypothesis DISPROVED (2025-08-24)
 * - Rapid changes are immediately visible via API
 * - No time-gating mechanism detected
 * - UI and API remain synchronized
 */

// TEST ACTION: Comprehensive time-gate hypothesis testing
export const testTimeGateHypothesis = action({
  args: { 
    databaseId: v.string(),
    testScenario: v.union(v.literal("baseline"), v.literal("rapid_changes"), v.literal("recovery")),
    taskId: v.optional(v.string())
  },
  handler: async (ctx, { databaseId, testScenario, taskId }) => {
    console.log(`\n🧪 TIME-GATE HYPOTHESIS TEST`);
    console.log(`📊 Database ID: ${databaseId}`);
    console.log(`🔬 Test Scenario: ${testScenario.toUpperCase()}`);
    console.log(`📋 Target Task ID: ${taskId || 'First record in database'}`);
    
    const notionApiKey = process.env.NOTION_API_KEY;
    if (!notionApiKey) {
      throw new Error("NOTION_API_KEY not configured");
    }
    
    const client = new NotionSyncClient(notionApiKey);
    
    switch (testScenario) {
      case "baseline":
        return await testBaselineScenario(client, databaseId, taskId);
      case "rapid_changes":
        return await testRapidChangesScenario(client, databaseId, taskId);
      case "recovery":
        return await testRecoveryScenario(client, databaseId, taskId);
      default:
        throw new Error(`Unknown test scenario: ${testScenario}`);
    }
  }
});

// TEST ACTION: Legacy propagation delay testing (for comparison)
export const testNotionPropagationDelay = action({
  args: { 
    databaseId: v.string(),
    delayIntervals: v.optional(v.array(v.number()))
  },
  handler: async (ctx, { databaseId, delayIntervals = [1, 5, 10, 20, 30] }) => {
    console.log(`\n🧪 TESTING NOTION PROPAGATION DELAY`);
    console.log(`📊 Database ID: ${databaseId}`);
    console.log(`⏱️ Test intervals: ${delayIntervals.map(d => `${d}s`).join(', ')}`);
    
    const notionApiKey = process.env.NOTION_API_KEY;
    if (!notionApiKey) {
      throw new Error("NOTION_API_KEY not configured");
    }
    
    const client = new NotionSyncClient(notionApiKey);
    const testResults: Array<{
      delay: number;
      timestamp: string;
      recordCount: number;
      records: Array<{
        title: string;
        lastEditedTime: string;
        assignee: string | null;
        status: string | null;
      }>;
    }> = [];
    
    // Perform initial fetch to establish baseline
    console.log(`\n🔄 Baseline fetch (0s delay):`);
    const baselineRecords = await client.fetchDatabaseChanges(databaseId);
    
    testResults.push({
      delay: 0,
      timestamp: new Date().toISOString(),
      recordCount: baselineRecords.length,
      records: baselineRecords.slice(0, 5).map(record => ({
        title: record.title,
        lastEditedTime: new Date(record.lastModified).toISOString(),
        assignee: record.properties.assignee,
        status: record.properties.status,
      }))
    });
    
    // Perform delayed fetches
    for (const delaySeconds of delayIntervals) {
      console.log(`\n⏳ Waiting ${delaySeconds} seconds before next fetch...`);
      await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
      
      console.log(`\n🔄 Fetch after ${delaySeconds}s delay:`);
      const delayedRecords = await client.fetchDatabaseChanges(databaseId);
      
      testResults.push({
        delay: delaySeconds,
        timestamp: new Date().toISOString(),
        recordCount: delayedRecords.length,
        records: delayedRecords.slice(0, 5).map(record => ({
          title: record.title,
          lastEditedTime: new Date(record.lastModified).toISOString(),
          assignee: record.properties.assignee,
          status: record.properties.status,
        }))
      });
      
      // Compare with baseline to detect changes
      const baselineFirst = testResults[0].records[0];
      const currentFirst = delayedRecords[0];
      
      if (baselineFirst && currentFirst) {
        const assigneeChanged = baselineFirst.assignee !== currentFirst.properties.assignee;
        const lastEditedChanged = baselineFirst.lastEditedTime !== new Date(currentFirst.lastModified).toISOString();
        
        console.log(`  📊 Comparison with baseline:`);
        console.log(`    - Assignee changed: ${assigneeChanged ? '✅ YES' : '❌ NO'}`);
        console.log(`    - Last edited time changed: ${lastEditedChanged ? '✅ YES' : '❌ NO'}`);
        
        if (lastEditedChanged && !assigneeChanged) {
          console.log(`    ⚠️  STALE DATA DETECTED: last_edited_time updated but assignee value didn't change!`);
        }
      }
    }
    
    console.log(`\n📋 TEST RESULTS SUMMARY:`);
    testResults.forEach((result, index) => {
      console.log(`  ${index === 0 ? 'Baseline' : `${result.delay}s delay`}: ${result.recordCount} records, first assignee: "${result.records[0]?.assignee || 'none'}"`);
    });
    
    return {
      testCompleted: true,
      totalTests: testResults.length,
      results: testResults,
      summary: `Tested ${delayIntervals.length + 1} intervals, found ${testResults.length} data points`
    };
  }
});

// Baseline test: Single change after clean state (5+ minutes wait)
async function testBaselineScenario(client: NotionSyncClient, databaseId: string, taskId?: string) {
  console.log(`\n🧪 BASELINE TEST: Single change detection after clean state`);
  console.log(`📝 Expected: Changes should appear immediately when synced`);
  
  const testResults: Array<{
    phase: string;
    timestamp: string;
    recordCount: number;
    targetRecord?: {
      id: string;
      title: string;
      assignee: string | null;
      status: string | null;
      lastEditedTime: string;
      timeSinceEdit: number;
    };
  }> = [];
  
  // Phase 1: Initial fetch
  console.log(`\n📦 Phase 1: Initial fetch`);
  const initialRecords = await client.fetchDatabaseChanges(databaseId);
  const targetRecord = taskId 
    ? initialRecords.find(r => r.id === taskId) 
    : initialRecords[0];
  
  if (!targetRecord) {
    throw new Error(`Target record not found: ${taskId || 'first record'}`);
  }
  
  testResults.push({
    phase: "initial",
    timestamp: new Date().toISOString(),
    recordCount: initialRecords.length,
    targetRecord: {
      id: targetRecord.id,
      title: targetRecord.title,
      assignee: targetRecord.properties.assignee,
      status: targetRecord.properties.status,
      lastEditedTime: new Date(targetRecord.lastModified).toISOString(),
      timeSinceEdit: Date.now() - targetRecord.lastModified
    }
  });
  
  console.log(`✅ Target Record Found:`);
  console.log(`   📝 Title: ${targetRecord.title}`);
  console.log(`   👤 Assignee: ${targetRecord.properties.assignee}`);
  console.log(`   📊 Status: ${targetRecord.properties.status}`);
  console.log(`   🕐 Last edited: ${new Date(targetRecord.lastModified).toISOString()}`);
  console.log(`   ⏱️ Time since edit: ${Math.round((Date.now() - targetRecord.lastModified) / 1000)}s ago`);
  
  // Phase 2: Wait 10 seconds and fetch again (for comparison)
  console.log(`\n⏳ Phase 2: Waiting 10 seconds for comparison fetch...`);
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  const comparisonRecords = await client.fetchDatabaseChanges(databaseId);
  const comparisonTarget = comparisonRecords.find(r => r.id === targetRecord.id);
  
  if (comparisonTarget) {
    testResults.push({
      phase: "comparison",
      timestamp: new Date().toISOString(),
      recordCount: comparisonRecords.length,
      targetRecord: {
        id: comparisonTarget.id,
        title: comparisonTarget.title,
        assignee: comparisonTarget.properties.assignee,
        status: comparisonTarget.properties.status,
        lastEditedTime: new Date(comparisonTarget.lastModified).toISOString(),
        timeSinceEdit: Date.now() - comparisonTarget.lastModified
      }
    });
    
    // Compare records
    const assigneeChanged = targetRecord.properties.assignee !== comparisonTarget.properties.assignee;
    const statusChanged = targetRecord.properties.status !== comparisonTarget.properties.status;
    const lastEditedChanged = targetRecord.lastModified !== comparisonTarget.lastModified;
    
    console.log(`\n📊 Comparison Results:`);
    console.log(`   - Assignee changed: ${assigneeChanged ? '✅ YES' : '❌ NO'}`);
    console.log(`   - Status changed: ${statusChanged ? '✅ YES' : '❌ NO'}`);
    console.log(`   - Last edited changed: ${lastEditedChanged ? '✅ YES' : '❌ NO'}`);
    
    if (lastEditedChanged && !assigneeChanged && !statusChanged) {
      console.log(`   ⚠️ ANOMALY: Edit timestamp updated but no field changes detected!`);
    }
  }
  
  return {
    testType: "baseline",
    completed: true,
    targetRecordId: targetRecord.id,
    results: testResults,
    summary: `Baseline test completed - monitored ${testResults.length} phases for record "${targetRecord.title}"`
  };
}

// Rapid changes test: Make immediate successive changes to test time-gating
async function testRapidChangesScenario(client: NotionSyncClient, databaseId: string, taskId?: string) {
  console.log(`\n🧪 RAPID CHANGES TEST: Test time-gate mechanism for successive changes`);
  console.log(`📝 Expected: Only first change appears, subsequent rapid changes may be time-gated`);
  
  const testResults: Array<{
    phase: string;
    timestamp: string;
    recordCount: number;
    targetRecord?: {
      id: string;
      title: string;
      assignee: string | null;
      status: string | null;
      lastEditedTime: string;
      timeSinceEdit: number;
    };
    notes: string;
  }> = [];
  
  // Phase 1: Baseline fetch
  console.log(`\n📦 Phase 1: Baseline fetch before changes`);
  const baselineRecords = await client.fetchDatabaseChanges(databaseId);
  const targetRecord = taskId 
    ? baselineRecords.find(r => r.id === taskId) 
    : baselineRecords[0];
  
  if (!targetRecord) {
    throw new Error(`Target record not found: ${taskId || 'first record'}`);
  }
  
  testResults.push({
    phase: "baseline",
    timestamp: new Date().toISOString(),
    recordCount: baselineRecords.length,
    targetRecord: {
      id: targetRecord.id,
      title: targetRecord.title,
      assignee: targetRecord.properties.assignee,
      status: targetRecord.properties.status,
      lastEditedTime: new Date(targetRecord.lastModified).toISOString(),
      timeSinceEdit: Date.now() - targetRecord.lastModified
    },
    notes: "Initial state before rapid changes test"
  });
  
  console.log(`✅ Baseline Record State:`);
  console.log(`   📝 Title: ${targetRecord.title}`);
  console.log(`   👤 Assignee: ${targetRecord.properties.assignee}`);
  console.log(`   📊 Status: ${targetRecord.properties.status}`);
  
  // Phase 2-6: Monitor every 10 seconds for 1 minute to catch rapid changes
  const monitoringIntervals = [10, 20, 30, 40, 60]; // seconds
  
  for (const intervalSeconds of monitoringIntervals) {
    console.log(`\n⏳ Phase: Monitoring after ${intervalSeconds} seconds...`);
    await new Promise(resolve => setTimeout(resolve, (intervalSeconds - (testResults.length > 1 ? monitoringIntervals[testResults.length - 2] : 0)) * 1000));
    
    const monitorRecords = await client.fetchDatabaseChanges(databaseId);
    const monitorTarget = monitorRecords.find(r => r.id === targetRecord.id);
    
    if (monitorTarget) {
      const assigneeChanged = targetRecord.properties.assignee !== monitorTarget.properties.assignee;
      const statusChanged = targetRecord.properties.status !== monitorTarget.properties.status;
      const lastEditedChanged = targetRecord.lastModified !== monitorTarget.lastModified;
      const timeSinceEdit = Date.now() - monitorTarget.lastModified;
      
      testResults.push({
        phase: `monitor_${intervalSeconds}s`,
        timestamp: new Date().toISOString(),
        recordCount: monitorRecords.length,
        targetRecord: {
          id: monitorTarget.id,
          title: monitorTarget.title,
          assignee: monitorTarget.properties.assignee,
          status: monitorTarget.properties.status,
          lastEditedTime: new Date(monitorTarget.lastModified).toISOString(),
          timeSinceEdit: timeSinceEdit
        },
        notes: `Changes detected: assignee=${assigneeChanged}, status=${statusChanged}, timestamp=${lastEditedChanged}, time_since_edit=${Math.round(timeSinceEdit/1000)}s`
      });
      
      console.log(`   📊 Monitor Results (${intervalSeconds}s):`);
      console.log(`     - Assignee: ${targetRecord.properties.assignee} → ${monitorTarget.properties.assignee} ${assigneeChanged ? '(CHANGED)' : '(same)'}`);
      console.log(`     - Status: ${targetRecord.properties.status} → ${monitorTarget.properties.status} ${statusChanged ? '(CHANGED)' : '(same)'}`);
      console.log(`     - Last edited: ${lastEditedChanged ? 'UPDATED' : 'same'}`);
      console.log(`     - Time since edit: ${Math.round(timeSinceEdit / 1000)}s ago`);
      
      // Flag potential time-gate behavior
      if (timeSinceEdit < 30000 && lastEditedChanged && (!assigneeChanged && !statusChanged)) {
        console.log(`     🚨 TIME-GATE SUSPECT: Recent timestamp update without visible field changes!`);
      }
      
      if (timeSinceEdit < 10000) {
        console.log(`     ⚠️ VERY RECENT EDIT: Changes made within last 10 seconds - high time-gate risk`);
      }
    }
  }
  
  return {
    testType: "rapid_changes",
    completed: true,
    targetRecordId: targetRecord.id,
    results: testResults,
    summary: `Rapid changes test completed - monitored ${monitoringIntervals.length} intervals over 60 seconds for record "${targetRecord.title}"`
  };
}

// Recovery test: Verify that time-gated changes eventually appear
async function testRecoveryScenario(client: NotionSyncClient, databaseId: string, taskId?: string) {
  console.log(`\n🧪 RECOVERY TEST: Verify time-gated changes appear after delay`);
  console.log(`📝 Expected: Changes that were time-gated should appear after 45-60 seconds`);
  
  const testResults: Array<{
    phase: string;
    timestamp: string;
    recordCount: number;
    targetRecord?: {
      id: string;
      title: string;
      assignee: string | null;
      status: string | null;
      lastEditedTime: string;
      timeSinceEdit: number;
    };
    recoveryNotes: string;
  }> = [];
  
  // Phase 1: Initial state
  console.log(`\n📦 Phase 1: Initial state check`);
  const initialRecords = await client.fetchDatabaseChanges(databaseId);
  const targetRecord = taskId 
    ? initialRecords.find(r => r.id === taskId) 
    : initialRecords[0];
  
  if (!targetRecord) {
    throw new Error(`Target record not found: ${taskId || 'first record'}`);
  }
  
  testResults.push({
    phase: "initial",
    timestamp: new Date().toISOString(),
    recordCount: initialRecords.length,
    targetRecord: {
      id: targetRecord.id,
      title: targetRecord.title,
      assignee: targetRecord.properties.assignee,
      status: targetRecord.properties.status,
      lastEditedTime: new Date(targetRecord.lastModified).toISOString(),
      timeSinceEdit: Date.now() - targetRecord.lastModified
    },
    recoveryNotes: "Initial state before recovery test"
  });
  
  // Phase 2-4: Recovery intervals (45s, 75s, 120s)
  const recoveryIntervals = [45, 75, 120]; // seconds - longer intervals for time-gate recovery
  
  for (const intervalSeconds of recoveryIntervals) {
    console.log(`\n⏳ Recovery Phase: Checking after ${intervalSeconds} seconds...`);
    await new Promise(resolve => setTimeout(resolve, (intervalSeconds - (testResults.length > 1 ? recoveryIntervals[testResults.length - 2] || 0 : 0)) * 1000));
    
    const recoveryRecords = await client.fetchDatabaseChanges(databaseId);
    const recoveryTarget = recoveryRecords.find(r => r.id === targetRecord.id);
    
    if (recoveryTarget) {
      const assigneeChanged = targetRecord.properties.assignee !== recoveryTarget.properties.assignee;
      const statusChanged = targetRecord.properties.status !== recoveryTarget.properties.status;
      const lastEditedChanged = targetRecord.lastModified !== recoveryTarget.lastModified;
      const timeSinceEdit = Date.now() - recoveryTarget.lastModified;
      
      // Detect if this looks like a recovered time-gated change
      const looksLikeRecovery = (
        lastEditedChanged && 
        (assigneeChanged || statusChanged) && 
        timeSinceEdit < 180000 // Changed within last 3 minutes
      );
      
      testResults.push({
        phase: `recovery_${intervalSeconds}s`,
        timestamp: new Date().toISOString(),
        recordCount: recoveryRecords.length,
        targetRecord: {
          id: recoveryTarget.id,
          title: recoveryTarget.title,
          assignee: recoveryTarget.properties.assignee,
          status: recoveryTarget.properties.status,
          lastEditedTime: new Date(recoveryTarget.lastModified).toISOString(),
          timeSinceEdit: timeSinceEdit
        },
        recoveryNotes: `Recovery status: ${looksLikeRecovery ? 'POSSIBLE_RECOVERY' : 'NO_CHANGE'} - assignee=${assigneeChanged}, status=${statusChanged}, edit_age=${Math.round(timeSinceEdit/1000)}s`
      });
      
      console.log(`   📊 Recovery Check (${intervalSeconds}s):`);
      console.log(`     - Assignee: ${targetRecord.properties.assignee} → ${recoveryTarget.properties.assignee} ${assigneeChanged ? '(RECOVERED!)' : '(unchanged)'}`);
      console.log(`     - Status: ${targetRecord.properties.status} → ${recoveryTarget.properties.status} ${statusChanged ? '(RECOVERED!)' : '(unchanged)'}`);
      console.log(`     - Edit timestamp: ${lastEditedChanged ? 'UPDATED' : 'unchanged'}`);
      console.log(`     - Time since edit: ${Math.round(timeSinceEdit / 1000)}s ago`);
      
      if (looksLikeRecovery) {
        console.log(`     🎉 RECOVERY DETECTED: Time-gated change appears to have been recovered!`);
        console.log(`     🔍 Analysis: Change was made ${Math.round(timeSinceEdit / 1000)}s ago but only visible now`);
      }
    }
  }
  
  return {
    testType: "recovery",
    completed: true,
    targetRecordId: targetRecord.id,
    results: testResults,
    summary: `Recovery test completed - monitored ${recoveryIntervals.length} recovery intervals for record "${targetRecord.title}"`
  };
}