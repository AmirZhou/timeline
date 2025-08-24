import { action } from "../_generated/server";
import { v } from "convex/values";
import { NotionSyncClient } from "../lib/notionClient";

export const testCacheInvalidation = action({
  args: { 
    testRecordId: v.optional(v.string()),
    iterations: v.optional(v.number())
  },
  handler: async (ctx, { testRecordId, iterations = 3 }) => {
    const databaseId = "2584f2e11dba819eb0f5fc54bff7b13f";
    const client = new NotionSyncClient(process.env.NOTION_API_KEY!);
    
    console.log(`\n🧪 CACHE INVALIDATION TEST - ${iterations} iterations`);
    console.log(`📋 Database ID: ${databaseId}`);
    console.log(`🎯 Test Record ID: ${testRecordId || 'N/A (monitoring all)'}`);
    console.log(`🕒 Test started at: ${new Date().toISOString()}`);
    
    const results = [];
    
    for (let i = 1; i <= iterations; i++) {
      console.log(`\n--- ITERATION ${i}/${iterations} ---`);
      const startTime = Date.now();
      
      try {
        // Fetch data and capture headers/timing
        const records = await client.fetchDatabaseChanges(databaseId);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Log summary for this iteration
        console.log(`✅ Iteration ${i} completed:`);
        console.log(`   ⏱️ Duration: ${duration}ms`);
        console.log(`   📊 Records: ${records.length}`);
        console.log(`   🕒 Timestamp: ${new Date().toISOString()}`);
        
        results.push({
          iteration: i,
          duration,
          recordCount: records.length,
          timestamp: new Date().toISOString()
        });
        
        // Wait between iterations (except the last one)
        if (i < iterations) {
          console.log(`⏳ Waiting 2s before next iteration...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        console.error(`❌ Iteration ${i} failed:`, error);
        results.push({
          iteration: i,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Final summary
    console.log(`\n📈 CACHE INVALIDATION TEST SUMMARY:`);
    console.log(`   Total iterations: ${iterations}`);
    console.log(`   Successful: ${results.filter(r => !r.error).length}`);
    console.log(`   Failed: ${results.filter(r => r.error).length}`);
    
    const successfulResults = results.filter(r => !r.error && r.duration !== undefined) as Array<{iteration: number, duration: number, recordCount: number, timestamp: string}>;
    if (successfulResults.length > 0) {
      const avgDuration = successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length;
      const minDuration = Math.min(...successfulResults.map(r => r.duration));
      const maxDuration = Math.max(...successfulResults.map(r => r.duration));
      
      console.log(`   Average response time: ${avgDuration.toFixed(2)}ms`);
      console.log(`   Min response time: ${minDuration}ms`);
      console.log(`   Max response time: ${maxDuration}ms`);
      console.log(`   Response time variation: ${(maxDuration - minDuration).toFixed(2)}ms`);
    }
    
    console.log(`🕒 Test completed at: ${new Date().toISOString()}`);
    
    return {
      success: true,
      iterations: iterations,
      results: results,
      summary: {
        totalIterations: iterations,
        successful: results.filter(r => !r.error).length,
        failed: results.filter(r => r.error).length,
        averageDuration: successfulResults.length > 0 
          ? successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length 
          : null
      }
    };
  }
});

export const testCachePatterns = action({
  args: {
    rapidRequests: v.optional(v.number()),
    intervalSeconds: v.optional(v.number())
  },
  handler: async (ctx, { rapidRequests = 5, intervalSeconds = 1 }) => {
    const databaseId = "2584f2e11dba819eb0f5fc54bff7b13f";
    const client = new NotionSyncClient(process.env.NOTION_API_KEY!);
    
    console.log(`\n🔄 CACHE PATTERN ANALYSIS TEST`);
    console.log(`📋 Database ID: ${databaseId}`);
    console.log(`⚡ Rapid requests: ${rapidRequests}`);
    console.log(`⏱️ Interval: ${intervalSeconds}s`);
    console.log(`🕒 Test started at: ${new Date().toISOString()}`);
    
    const results = [];
    
    // Phase 1: Rapid consecutive requests
    console.log(`\n🚀 PHASE 1: Rapid consecutive requests (${rapidRequests} requests)`);
    for (let i = 1; i <= rapidRequests; i++) {
      const startTime = Date.now();
      
      try {
        await client.fetchDatabaseChanges(databaseId);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`   Request ${i}/${rapidRequests}: ${duration}ms`);
        results.push({
          phase: 1,
          request: i,
          duration,
          timestamp: new Date().toISOString()
        });
        
        // Very small delay between rapid requests
        if (i < rapidRequests) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error) {
        console.error(`   Request ${i} failed:`, error);
        results.push({
          phase: 1,
          request: i,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Phase 2: Spaced requests with longer intervals
    console.log(`\n⏰ PHASE 2: Spaced requests (${intervalSeconds}s intervals)`);
    for (let i = 1; i <= 3; i++) {
      if (i > 1) {
        console.log(`   Waiting ${intervalSeconds}s...`);
        await new Promise(resolve => setTimeout(resolve, intervalSeconds * 1000));
      }
      
      const startTime = Date.now();
      
      try {
        await client.fetchDatabaseChanges(databaseId);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`   Spaced request ${i}/3: ${duration}ms`);
        results.push({
          phase: 2,
          request: i,
          duration,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.error(`   Spaced request ${i} failed:`, error);
        results.push({
          phase: 2,
          request: i,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Analysis
    console.log(`\n📊 CACHE PATTERN ANALYSIS RESULTS:`);
    
    const phase1Results = results.filter(r => r.phase === 1 && r.duration !== undefined) as Array<{phase: number, request: number, duration: number, timestamp: string}>;
    const phase2Results = results.filter(r => r.phase === 2 && r.duration !== undefined) as Array<{phase: number, request: number, duration: number, timestamp: string}>;
    
    if (phase1Results.length > 0) {
      const phase1Avg = phase1Results.reduce((sum, r) => sum + r.duration, 0) / phase1Results.length;
      const phase1Min = Math.min(...phase1Results.map(r => r.duration));
      const phase1Max = Math.max(...phase1Results.map(r => r.duration));
      
      console.log(`   🚀 Rapid requests (Phase 1):`);
      console.log(`     Average: ${phase1Avg.toFixed(2)}ms`);
      console.log(`     Range: ${phase1Min}ms - ${phase1Max}ms`);
      console.log(`     Variation: ${(phase1Max - phase1Min)}ms`);
    }
    
    if (phase2Results.length > 0) {
      const phase2Avg = phase2Results.reduce((sum, r) => sum + r.duration, 0) / phase2Results.length;
      const phase2Min = Math.min(...phase2Results.map(r => r.duration));
      const phase2Max = Math.max(...phase2Results.map(r => r.duration));
      
      console.log(`   ⏰ Spaced requests (Phase 2):`);
      console.log(`     Average: ${phase2Avg.toFixed(2)}ms`);
      console.log(`     Range: ${phase2Min}ms - ${phase2Max}ms`);
      console.log(`     Variation: ${(phase2Max - phase2Min)}ms`);
    }
    
    // Cache hit/miss indicators
    if (phase1Results.length > 1) {
      const firstRequest = phase1Results[0]!.duration;
      const subsequentAvg = phase1Results.slice(1).reduce((sum, r) => sum + r.duration, 0) / (phase1Results.length - 1);
      const speedupRatio = firstRequest / subsequentAvg;
      
      console.log(`   📈 Cache analysis:`);
      console.log(`     First request: ${firstRequest}ms`);
      console.log(`     Subsequent avg: ${subsequentAvg.toFixed(2)}ms`);
      console.log(`     Speedup ratio: ${speedupRatio.toFixed(2)}x`);
      
      if (speedupRatio > 1.5) {
        console.log(`     🎯 Strong cache hit pattern detected!`);
      } else if (speedupRatio > 1.2) {
        console.log(`     🟡 Possible cache hits detected`);
      } else {
        console.log(`     🔴 No clear cache pattern detected`);
      }
    }
    
    console.log(`🕒 Test completed at: ${new Date().toISOString()}`);
    
    return {
      success: true,
      results: results,
      analysis: {
        phase1: phase1Results.length > 0 ? {
          average: phase1Results.reduce((sum, r) => sum + r.duration, 0) / phase1Results.length,
          min: Math.min(...phase1Results.map(r => r.duration)),
          max: Math.max(...phase1Results.map(r => r.duration))
        } : null,
        phase2: phase2Results.length > 0 ? {
          average: phase2Results.reduce((sum, r) => sum + r.duration, 0) / phase2Results.length,
          min: Math.min(...phase2Results.map(r => r.duration)),
          max: Math.max(...phase2Results.map(r => r.duration))
        } : null
      }
    };
  }
});